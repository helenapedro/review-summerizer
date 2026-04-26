import { env } from "../config/env";
import { HttpError } from "../errors/httpError";
import {
  buildReviewSummaryInput,
  buildReviewSummaryInstructions,
} from "../prompts/reviewSummaryPrompt";
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
        instructions: buildReviewSummaryInstructions(reviewLimit),
        input: buildReviewSummaryInput(reviews),
        max_output_tokens: 500,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();

      console.error("OpenAI summary generation failed.", {
        status: response.status,
        statusText: response.statusText,
        response: responseText.slice(0, 500),
      });

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
