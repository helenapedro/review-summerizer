import type { ReviewWithProduct } from "../repositories/reviewRepository";

export const buildReviewSummaryInstructions = (reviewLimit: number) =>
  `Summarize the most recent product reviews for an ecommerce API. The input contains at most ${reviewLimit} recent reviews, not the full review history. Be concise, factual, and balanced. Mention common praise, common complaints, and the recent overall sentiment. Do not invent details. Return plain text only, with 3 short labeled sections: Overall sentiment, Common praise, Common complaints. Do not use Markdown formatting, bullets, asterisks, or headings with symbols.`;

export const buildReviewSummaryInput = (reviews: ReviewWithProduct[]) => {
  const product = reviews[0]?.product;

  return [
    `Product: ${product?.name ?? "Unknown product"}`,
    product?.description ? `Description: ${product.description}` : undefined,
    "Reviews:",
    ...reviews.map(
      (review, index) =>
        `${index + 1}. Rating: ${review.rating}/5. Author: ${review.author}. Review: ${review.content}`,
    ),
  ]
    .filter(Boolean)
    .join("\n");
};
