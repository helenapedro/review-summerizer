import type { Review } from "../types";
import { formatDateTime } from "../utils/formatters";
import { Rating } from "./Rating";

type ReviewListProps = {
  reviews: Review[];
};

export const ReviewList = ({ reviews }: ReviewListProps) => (
  <section className="reviews-section" aria-labelledby="reviews-title">
    <div className="section-heading">
      <div>
        <span className="eyebrow">Customer Reviews</span>
        <h2 id="reviews-title">Latest feedback</h2>
      </div>
      <span className="count-badge">{reviews.length} total</span>
    </div>

    <div className="review-list">
      {reviews.map((review) => (
        <article className="review-card" key={review.id}>
          <header>
            <div>
              <h3>{review.author}</h3>
              <span>{formatDateTime(review.createdAt)}</span>
            </div>
            <Rating value={review.rating} />
          </header>
          <p>{review.content}</p>
        </article>
      ))}
    </div>
  </section>
);
