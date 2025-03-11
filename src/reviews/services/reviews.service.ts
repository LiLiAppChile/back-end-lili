import { Injectable } from '@nestjs/common';
import { db } from '../../config/firebase.config';
import { Review } from '../models/reviews.models';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

@Injectable()
export class ReviewsService {
  private readonly reviewsCollection = db.collection('reviews');

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = { ...createReviewDto, createdAt: new Date() };
    const docRef = await this.reviewsCollection.add(review);
    return { id: docRef.id, ...review };
  }

  async getReviews() {
    const snapshot = await this.reviewsCollection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async getReviewById(id: string) {
    const doc = await this.reviewsCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }

  async updateReview(id: string, updateReviewDto: UpdateReviewDto) {
    const doc = await this.reviewsCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    const updateData = { ...updateReviewDto };
    await this.reviewsCollection.doc(id).update(updateData);
    return { id, ...updateReviewDto };
  }

  async deleteReview(id: string) {
    const doc = await this.reviewsCollection.doc(id).get();
    if (!doc.exists) {
      return { message: 'Review not found' };
    }
    await this.reviewsCollection.doc(id).delete();
    return { message: 'Review deleted successfully' };
  }
}
