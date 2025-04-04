import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CategoriesService } from './services/categories.service';
import { FirebaseAuthGuard } from '../FirebaseAuthGuard/firebase-auth.guard';
import { Category } from './models/category.model';
import {
  CategoryResponse,
  CategoriesListResponse,
  CategoryDetailResponse,
} from './models/category-response.model';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Fetch categories from Jumpseller' })
  @ApiResponse({
    status: 200,
    description: 'Categories fetched and stored successfully',
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @Get('fetch')
  async fetchCategories(): Promise<CategoryResponse> {
    return this.categoriesService.fetchCategories();
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Returns all categories',
    type: CategoriesListResponse,
  })
  @Get()
  async getAllCategories(): Promise<CategoriesListResponse> {
    return this.categoriesService.getAllCategories();
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the category',
    type: CategoryDetailResponse,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @Get(':id')
  async getCategoryById(
    @Param('id') id: string,
  ): Promise<CategoryDetailResponse> {
    return this.categoriesService.getCategoryById(id);
  }
}
