import { env } from "../config/env";
import { HttpError } from "../errors/httpError";
import type { ReviewWithProduct } from "../repositories/reviewRepository";

type ResponsesApiResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
};

const getApiKey = () => env.OPENAI_API_KEY ?? env.OPEN_API_KEY;

const extractText = (response: ResponsesApiResponse) => {
  if (response.output_text) {
    return response.output_text.trim();
  }

  return (
    response.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter((text): text is string => typeof text === "string")
      .join("\n")
      .trim() ?? ""
  );
};

const buildSummaryInput = (reviews: ReviewWithProduct[]) => {
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

export const languageModelService = {
  async summarizeReviews(reviews: ReviewWithProduct[], reviewLimit: number) {
    const apiKey = getApiKey();

    if (!apiKey) {
      throw new HttpError(503, "OpenAI API key is not configured");
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.SUMMARIZER_MODEL,
        instructions: `Summarize the most recent product reviews for an ecommerce API. The input contains at most ${reviewLimit} recent reviews, not the full review history. Be concise, factual, and balanced. Mention common praise, common complaints, and the recent overall sentiment. Do not invent details.`,
        input: buildSummaryInput(reviews),
        max_output_tokens: 350,
      }),
    });

    if (!response.ok) {
      throw new HttpError(502, "Failed to generate review summary");
    }

    const data = (await response.json()) as ResponsesApiResponse;
    const content = extractText(data);

    if (!content) {
      throw new HttpError(502, "Language model returned an empty summary");
    }

    return content;
  },
};
