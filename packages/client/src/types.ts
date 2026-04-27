export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
};

export type Review = {
  id: number;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
  productId: number;
  product: Product;
};

export type Summary = {
  id: number;
  productId: number;
  product: Product;
  content: string;
  generatedAt: string;
  expiresAt: string;
};

export type ProductReviewsResponse = {
  reviews: Review[];
  summary: Summary;
  summarySource: "cache" | "generated" | "in-flight";
};
