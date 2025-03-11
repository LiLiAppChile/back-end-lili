import { Module } from '@nestjs/common';
import { ReviewsService } from './services/reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
