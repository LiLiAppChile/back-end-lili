import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { db } from '../../config/firebase.config';
import { Review } from '../models/reviews.models';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

@Injectable()
export class ReviewsService {
  private readonly reviewsCollection = db.collection('reviews');

  private toReview(doc: FirebaseFirestore.DocumentSnapshot): Review {
    const data = doc.data();
    if (!data) {
      throw new Error('Los datos de la reseña no existen');
    }

    // Manejo seguro de la fecha createdAt
    const createdAt =
      typeof data.createdAt === 'string'
        ? data.createdAt
        : data.createdAt?.toDate()?.toISOString() || new Date().toISOString();

    return new Review(
      doc.id,
      data.requestId,
      data.clientId,
      data.professionalId,
      data.rating,
      data.comment,
      createdAt,
    );
  }

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { requestId, clientId, professionalId, rating, comment } = createReviewDto;

    try {
      // Verificar si ya existe una reseña para este requestId
      const existingReview = await this.findByRequestId(requestId);
      if (existingReview) {
        throw new ConflictException('Ya existe una reseña para este servicio');
      }

      // Validación de rating
      this.validateRating(rating);

      const reviewRef = this.reviewsCollection.doc();
      const reviewData = {
        requestId,
        clientId,
        professionalId,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };

      await reviewRef.set(reviewData);
      return this.toReview(await reviewRef.get());
    } catch (error) {
      this.handleError(error, 'Error al crear la reseña');
    }
  }

  async findAll(limit?: number, orderBy?: string): Promise<Review[]> {
    try {
      let query: FirebaseFirestore.Query = this.reviewsCollection;

      if (orderBy) {
        query = query.orderBy(orderBy, 'desc');
      }
      if (limit) {
        query = query.limit(limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => this.toReview(doc));
    } catch (error) {
      this.handleError(error, 'Error al obtener las reseñas');
    }
  }

  async findById(id: string): Promise<Review> {
    try {
      const reviewDoc = await this.reviewsCollection.doc(id).get();
      if (!reviewDoc.exists) {
        throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
      }
      return this.toReview(reviewDoc);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateReview(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    try {
      const reviewDoc = await this.reviewsCollection.doc(id).get();
      if (!reviewDoc.exists) {
        throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
      }

      this.validateUpdateData(updateReviewDto);

      const filteredUpdateData = this.filterUndefinedFields({
        rating: updateReviewDto.rating,
        comment: updateReviewDto.comment,
      });

      await this.reviewsCollection.doc(id).update(filteredUpdateData);
      return this.toReview(await this.reviewsCollection.doc(id).get());
    } catch (error) {
      this.handleError(error, 'Error al actualizar la reseña');
    }
  }

  async deleteReview(id: string): Promise<void> {
    try {
      const reviewDoc = await this.reviewsCollection.doc(id).get();
      if (!reviewDoc.exists) {
        throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
      }
      await this.reviewsCollection.doc(id).delete();
    } catch (error) {
      this.handleError(error, 'Error al eliminar la reseña');
    }
  }

  async findByProfessionalId(
    professionalId: string,
    minRating?: number,
    limit?: number,
  ): Promise<Review[]> {
    try {
      let query = this.reviewsCollection.where('professionalId', '==', professionalId);

      if (minRating) {
        query = query.where('rating', '>=', minRating);
      }
      if (limit) {
        query = query.limit(limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => this.toReview(doc));
    } catch (error) {
      this.handleError(error, 'Error al buscar reseñas por profesional');
    }
  }

  async findByClientId(clientId: string, limit?: number): Promise<Review[]> {
    try {
      let query = this.reviewsCollection.where('clientId', '==', clientId);

      if (limit) {
        query = query.limit(limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => this.toReview(doc));
    } catch (error) {
      this.handleError(error, 'Error al buscar reseñas por cliente');
    }
  }

  async findByRequestId(requestId: string): Promise<Review | null> {
    try {
      const snapshot = await this.reviewsCollection
        .where('requestId', '==', requestId)
        .limit(1)
        .get();

      return snapshot.empty ? null : this.toReview(snapshot.docs[0]);
    } catch (error) {
      this.handleError(error, 'Error al buscar reseña por servicio');
    }
  }

  async getProfessionalAverageRating(professionalId: string): Promise<number> {
    try {
      const reviews = await this.findByProfessionalId(professionalId);
      if (reviews.length === 0) return 0;

      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      return parseFloat((total / reviews.length).toFixed(2));
    } catch (error) {
      this.handleError(error, 'Error al calcular rating promedio');
    }
  }

  // Métodos auxiliares
  private validateRating(rating: number): void {
    if (rating < 1 || rating > 5) {
      throw new ConflictException('El rating debe estar entre 1 y 5');
    }
  }

  private validateUpdateData(updateData: UpdateReviewDto): void {
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('No se proporcionaron datos para actualizar');
    }

    if (updateData.rating) {
      this.validateRating(updateData.rating);
    }
  }

  private filterUndefinedFields(obj: Record<string, any>): Record<string, any> {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
  }

  private handleError(error: Error, context?: string): never {
    if (error instanceof NotFoundException || error instanceof ConflictException) {
      throw error;
    }
    const errorMessage = context ? `${context}: ${error.message}` : error.message;
    throw new InternalServerErrorException(errorMessage);
  }
}
