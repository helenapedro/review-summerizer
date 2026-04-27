import { Package } from "lucide-react";
import type { Product, Review } from "../types";
import { formatCurrency } from "../utils/formatters";

type ProductHeaderProps = {
  product: Product;
  reviews: Review[];
};

const getAverageRating = (reviews: Review[]) => {
  if (reviews.length === 0) {
    return "0.0";
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1);
};

export const ProductHeader = ({ product, reviews }: ProductHeaderProps) => (
  <section className="product-header" aria-labelledby="product-title">
    <div className="product-icon">
      <Package aria-hidden="true" />
    </div>
    <div className="product-copy">
      <span className="eyebrow">Product #{product.id}</span>
      <h1 id="product-title">{product.name}</h1>
      {product.description ? <p>{product.description}</p> : null}
    </div>
    <div className="product-stats">
      <div>
        <span>{formatCurrency(product.price)}</span>
        <small>Price</small>
      </div>
      <div>
        <span>{reviews.length}</span>
        <small>Reviews</small>
      </div>
      <div>
        <span>{getAverageRating(reviews)}</span>
        <small>Avg rating</small>
      </div>
    </div>
  </section>
);
