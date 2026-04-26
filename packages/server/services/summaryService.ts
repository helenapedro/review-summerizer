import { env } from "../config/env";
import { HttpError } from "../errors/httpError";
import { productRepository } from "../repositories/productRepository";
import type { ReviewWithProduct } from "../repositories/reviewRepository";
import { reviewRepository } from "../repositories/reviewRepository";
import {
  summaryRepository,
  type SummaryWithProduct,
} from "../repositories/summaryRepository";
import { languageModelService } from "./languageModelService";

const formatSummary = (summary: NonNullable<SummaryWithProduct>) => ({
  id: summary.id,
  productId: summary.productId,
  product: summary.product,
  content: summary.content,
  generatedAt: summary.generatedAt,
  expiresAt: summary.expiresAt,
});

const ensureProductExists = async (productId: number) => {
  const productExists = await productRepository.exists(productId);

  if (!productExists) {
    throw new HttpError(404, "Product not found");
  }
};

const isSummaryFresh = (summary: NonNullable<SummaryWithProduct>) =>
  summary.expiresAt.getTime() > Date.now();

const buildExpiresAt = () =>
  new Date(Date.now() + env.SUMMARY_TTL_HOURS * 60 * 60 * 1000);

const ensureReviewsExist = (reviews: ReviewWithProduct[]) => {
  if (reviews.length === 0) {
    throw new HttpError(404, "No reviews found for product");
  }
};

type SummaryResult = {
  summary: ReturnType<typeof formatSummary>;
  source: "cache" | "generated" | "in-flight";
};

type ProductId = number;

const pendingSummaryGenerations = new Map<ProductId, Promise<SummaryResult>>();

const generateAndStoreSummary = async (
  productId: number,
): Promise<SummaryResult> => {
  const reviews = await reviewRepository.findRecentByProductId(
    productId,
    env.SUMMARY_REVIEW_LIMIT,
  );
  ensureReviewsExist(reviews);

  const content = await languageModelService.summarizeReviews(
    reviews,
    env.SUMMARY_REVIEW_LIMIT,
  );
  const summary = await summaryRepository.upsert(
    productId,
    content,
    buildExpiresAt(),
  );

  return {
    summary: formatSummary(summary),
    source: "generated",
  };
};

const getOrCreatePendingGeneration = (productId: number) => {
  const pendingGeneration = pendingSummaryGenerations.get(productId);

  if (pendingGeneration) {
    return pendingGeneration.then((result) => ({
      ...result,
      source: "in-flight" as const,
    }));
  }

  const generation = generateAndStoreSummary(productId).finally(() => {
    pendingSummaryGenerations.delete(productId);
  });

  pendingSummaryGenerations.set(productId, generation);

  return generation;
};

export const summaryService = {
  async getProductSummary(productId: number) {
    await ensureProductExists(productId);

    const summary = await summaryRepository.findByProductId(productId);

    if (!summary) {
      throw new HttpError(404, "Summary not found");
    }

    return formatSummary(summary);
  },

  async summarizeProductReviews(productId: number, forceRefresh = false) {
    await ensureProductExists(productId);

    const existingSummary = await summaryRepository.findByProductId(productId);

    if (existingSummary && isSummaryFresh(existingSummary) && !forceRefresh) {
      return {
        summary: formatSummary(existingSummary),
        source: "cache" as const,
      };
    }

    return getOrCreatePendingGeneration(productId);
  },
};
