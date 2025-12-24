import { Review } from '../models/index.js';
import type { Review as ReviewType } from '../types/index.js';

export class ReviewsService {
  async getApproved(): Promise<ReviewType[]> {
    const reviews = await Review.findAll({
      where: { isApproved: true },
      order: [['createdAt', 'DESC']],
    });
    return reviews.map(r => r.toJSON() as ReviewType);
  }
}
