// reviews.model.ts
import { DocumentData } from '@google-cloud/firestore';

export class Review {
  id?: string;
  requestId: string;
  clientId: string;
  professionalId: string;
  rating: number;
  comment: string;
  createdAt: Date;

  constructor(
    id?: string,
    requestId?: string,
    clientId?: string,
    professionalId?: string,
    rating?: number,
    comment?: string,
    createdAt?: Date
  ) {
    this.id = id;
    this.requestId = requestId || '';
    this.clientId = clientId || '';
    this.professionalId = professionalId || '';
    this.rating = rating || 0;
    this.comment = comment || '';
    this.createdAt = createdAt || new Date();
  }

  // Versión alternativa del constructor que acepta objeto
  static createFromObject(data: Partial<Review>): Review {
    return new Review(
      data.id,
      data.requestId,
      data.clientId,
      data.professionalId,
      data.rating,
      data.comment,
      data.createdAt
    );
  }

  static fromFirestore(data: DocumentData): Review {
    return new Review(
      data.id,
      data.requestId,
      data.clientId,
      data.professionalId,
      data.rating,
      data.comment,
      data.createdAt?.toDate() || new Date()
    );
  }

  static toFirestore(review: Review): DocumentData {
    return {
      requestId: review.requestId,
      clientId: review.clientId,
      professionalId: review.professionalId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    };
  }
}