import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from './services/reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Conflict - Review already exists for this request' })
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiQuery({ name: 'professionalId', required: false, description: 'Filter by professional ID' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client ID' })
  @ApiResponse({ status: 200, description: 'List of reviews' })
  async getReviews(
    @Query('professionalId') professionalId?: string,
    @Query('clientId') clientId?: string,
  ) {
    if (professionalId) {
      return this.reviewsService.findByProfessionalId(professionalId);
    }
    if (clientId) {
      return this.reviewsService.findByClientId(clientId);
    }
    return this.reviewsService.findAll();
  }

  @Get('professional/:professionalId')
  async getByProfessional(@Param('professionalId') professionalId: string) {
    const reviews = await this.reviewsService.findByProfessionalId(professionalId);

    if (reviews.length === 0) {
      return {
        status: 'success',
        message: 'No se encontraron reseñas para este profesional',
        data: [],
        professionalId: professionalId,
      };
    }

    return {
      status: 'success',
      data: reviews,
      count: reviews.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review details' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async getReviewById(@Param('id') id: string) {
    return this.reviewsService.findById(id);
  }

  @Get('request/:requestId')
  @ApiOperation({ summary: 'Get review by request ID' })
  @ApiParam({ name: 'requestId', description: 'Request ID' })
  @ApiResponse({ status: 200, description: 'Review details' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async getReviewByRequestId(@Param('requestId') requestId: string) {
    return this.reviewsService.findByRequestId(requestId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateReview(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.updateReview(id, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 204, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}
