import type { Product, ProductReviewsResponse, Summary } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

type ApiErrorResponse = {
  error?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const fetchProductReviews = async (productId: number, signal?: AbortSignal) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
    signal,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as ApiErrorResponse;
    throw new ApiError(
      data.error ?? "Unable to load product reviews",
      response.status,
    );
  }

  return (await response.json()) as ProductReviewsResponse;
};

export const fetchProducts = async (signal?: AbortSignal) => {
  const response = await fetch(`${API_BASE_URL}/products`, { signal });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as ApiErrorResponse;
    throw new ApiError(data.error ?? "Unable to load products", response.status);
  }

  return (await response.json()) as { products: Product[] };
};

export const refreshProductSummary = async (productId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/summary?force=true`,
    { method: "POST" },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as ApiErrorResponse;
    throw new ApiError(
      data.error ?? "Unable to refresh product summary",
      response.status,
    );
  }

  return (await response.json()) as {
    summary: Summary;
    source: ProductReviewsResponse["summarySource"];
  };
};
