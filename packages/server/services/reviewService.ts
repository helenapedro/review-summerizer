import { HttpError } from "../errors/httpError";
import { productRepository } from "../repositories/productRepository";
import {
  reviewRepository,
  type ReviewWithProduct,
} from "../repositories/reviewRepository";

const formatReview = (review: ReviewWithProduct) => ({
  id: review.id,
  author: review.author,
  rating: review.rating,
  content: review.content,
  createdAt: review.createdAt,
  productId: review.productIt,
  product: review.product,
});

const ensureProductExists = async (productId: number) => {
  const productExists = await productRepository.exists(productId);

  if (!productExists) {
    throw new HttpError(404, "Product not found");
  }
};

export const reviewService = {
  async getReviews(productId?: number) {
    if (productId !== undefined) {
      await ensureProductExists(productId);
    }

    const reviews = await reviewRepository.findMany(productId);

    return reviews.map(formatReview);
  },

  async getProductReviews(productId: number) {
    await ensureProductExists(productId);

    const reviews = await reviewRepository.findMany(productId);

    return reviews.map(formatReview);
  },
};
