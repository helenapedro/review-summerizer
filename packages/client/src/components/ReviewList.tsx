import type { Review } from "../types";
import { formatDateTime } from "../utils/formatters";
import { Rating } from "./Rating";
import { ReviewControls, type ReviewSort } from "./ReviewControls";

type ReviewListProps = {
  reviews: Review[];
  totalReviews: number;
  query: string;
  minRating: number;
  sort: ReviewSort;
  onQueryChange: (value: string) => void;
  onMinRatingChange: (value: number) => void;
  onSortChange: (value: ReviewSort) => void;
};

export const ReviewList = ({
  reviews,
  totalReviews,
  query,
  minRating,
  sort,
  onQueryChange,
  onMinRatingChange,
  onSortChange,
}: ReviewListProps) => (
  <section className="reviews-section" aria-labelledby="reviews-title">
    <div className="section-heading">
      <div>
        <span className="eyebrow">Customer Reviews</span>
        <h2 id="reviews-title">Latest feedback</h2>
      </div>
      <span className="count-badge">
        {reviews.length} of {totalReviews}
      </span>
    </div>

    <ReviewControls
      query={query}
      minRating={minRating}
      sort={sort}
      onQueryChange={onQueryChange}
      onMinRatingChange={onMinRatingChange}
      onSortChange={onSortChange}
    />

    <div className="review-list">
      {reviews.length === 0 ? (
        <div className="empty-reviews">No reviews match the current filters.</div>
      ) : null}

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
