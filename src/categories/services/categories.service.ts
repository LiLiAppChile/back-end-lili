import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { db } from '../../config/firebase.config';
import { Category } from '../models/category.model';
import {
  CategoryResponse,
  CategoriesListResponse,
  CategoryDetailResponse,
} from '../models/category-response.model';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  private readonly categoriesCollection = db.collection('categories');
  private readonly baseUrl = 'https://api.jumpseller.com/v1';
  private readonly login: string;
  private readonly authToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.login = this.configService.get<string>('JUMPSELLER_LOGIN') || '';
    this.authToken =
      this.configService.get<string>('JUMPSELLER_AUTH_TOKEN') || '';
  }

  async fetchCategories(): Promise<CategoryResponse> {
    try {
      // Primero verificar si ya tenemos categorías en la base de datos
      const existingCategoriesResponse = await this.getAllCategories();
      const existingCategories = existingCategoriesResponse.data || [];

      if (existingCategories.length > 0) {
        this.logger.log(
          `Se encontraron ${existingCategories.length} categorías existentes en la base de datos`,
        );
      }

      const url = `${this.baseUrl}/categories.json?login=${this.login}&authtoken=${this.authToken}`;

      this.logger.log('Obteniendo categorías desde la API de Jumpseller');
      const response = await firstValueFrom(this.httpService.get(url));

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error(
          'Formato de respuesta inválido de la API de Jumpseller',
        );
      }

      const categories = response.data;
      this.logger.log(
        `Se recuperaron ${categories.length} categorías de la API`,
      );

      // Almacenar categorías en Firestore
      const savedCategories = await this.saveCategoriesToFirestore(categories);

      return {
        success: true,
        timestamp: new Date().toISOString(),
        message: `Se procesaron exitosamente ${categories.length} categorías`,
        data: {
          stats: {
            total: categories.length,
            new: savedCategories.filter((cat) => cat.isNew).length,
            updated: savedCategories.filter((cat) => !cat.isNew).length,
          },
          categories: savedCategories.map(({ isNew, ...cat }) => cat),
        },
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener categorías: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        timestamp: new Date().toISOString(),
        message: error.message,
      };
    }
  }

  private async saveCategoriesToFirestore(categories: any[]) {
    const savedCategories: (Category & { isNew: boolean })[] = [];

    for (const category of categories) {
      try {
        // Verificar si la categoría está anidada en una propiedad "category"
        const actualCategory = category.category || category;

        if (!actualCategory.id) {
          this.logger.warn(
            `La categoría no tiene un ID válido: ${JSON.stringify(actualCategory)}`,
          );
          continue;
        }

        // Verificar si la categoría ya existe
        const existingCategoriesQuery = await this.categoriesCollection
          .where('id', '==', actualCategory.id.toString())
          .get();

        if (!existingCategoriesQuery.empty) {
          this.logger.log(
            `La categoría con ID ${actualCategory.id} ya existe, actualizando`,
          );
          const docId = existingCategoriesQuery.docs[0].id;

          const categoryData = {
            id: actualCategory.id.toString(),
            name: actualCategory.name || '',
            permalink: actualCategory.permalink || '',
            parent_id: actualCategory.parent_id
              ? actualCategory.parent_id.toString()
              : null,
            description: actualCategory.description || '',
            image_url: actualCategory.image_url || '',
            updatedAt: new Date().toISOString(),
          };

          await this.categoriesCollection.doc(docId).update(categoryData);
          savedCategories.push({
            ...categoryData,
            createdAt: existingCategoriesQuery.docs[0].data().createdAt,
            isNew: false,
          });
          continue;
        }

        // Preparar datos de categoría para almacenamiento
        const categoryData = {
          id: actualCategory.id.toString(),
          name: actualCategory.name || '',
          permalink: actualCategory.permalink || '',
          parent_id: actualCategory.parent_id
            ? actualCategory.parent_id.toString()
            : null,
          description: actualCategory.description || '',
          image_url: actualCategory.image_url || '',
          createdAt: new Date().toISOString(),
        };

        // Almacenar en Firestore
        const docRef = await this.categoriesCollection.add(categoryData);
        savedCategories.push({ ...categoryData, isNew: true });

        this.logger.log(
          `Categoría ${categoryData.id} (${categoryData.name}) guardada`,
        );
      } catch (categoryError) {
        this.logger.error(
          `Error al guardar categoría ${category?.id || 'desconocida'}: ${categoryError.message}`,
          categoryError.stack,
        );
      }
    }

    return savedCategories;
  }

  async getAllCategories(): Promise<CategoriesListResponse> {
    const snapshot = await this.categoriesCollection.get();
    const categories = snapshot.docs.map(
      (doc) => ({ ...doc.data() }) as Category,
    );

    return {
      success: true,
      timestamp: new Date().toISOString(),
      count: categories.length,
      data: categories,
    };
  }

  async getCategoryById(categoryId: string): Promise<CategoryDetailResponse> {
    const snapshot = await this.categoriesCollection
      .where('id', '==', categoryId)
      .get();

    if (snapshot.empty) {
      return {
        success: false,
        timestamp: new Date().toISOString(),
        message: `Categoría con ID ${categoryId} no encontrada`,
        data: null as unknown as Category, // Conversión para resolver error de TypeScript
      };
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: snapshot.docs[0].data() as Category,
    };
  }
}
