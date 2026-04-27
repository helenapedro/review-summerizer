import { ArrowDownUp, Filter, Search } from "lucide-react";

export type ReviewSort = "newest" | "highest" | "lowest";

type ReviewControlsProps = {
  query: string;
  minRating: number;
  sort: ReviewSort;
  onQueryChange: (value: string) => void;
  onMinRatingChange: (value: number) => void;
  onSortChange: (value: ReviewSort) => void;
};

export const ReviewControls = ({
  query,
  minRating,
  sort,
  onQueryChange,
  onMinRatingChange,
  onSortChange,
}: ReviewControlsProps) => (
  <div className="review-controls" aria-label="Review filters">
    <label className="control-field">
      <span>
        <Search aria-hidden="true" />
        Search
      </span>
      <input
        type="search"
        value={query}
        placeholder="Author or review text"
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </label>

    <label className="control-field">
      <span>
        <Filter aria-hidden="true" />
        Min rating
      </span>
      <select
        value={minRating}
        onChange={(event) => onMinRatingChange(Number(event.target.value))}
      >
        <option value={0}>All ratings</option>
        <option value={5}>5 stars</option>
        <option value={4}>4+ stars</option>
        <option value={3}>3+ stars</option>
        <option value={2}>2+ stars</option>
        <option value={1}>1+ stars</option>
      </select>
    </label>

    <label className="control-field">
      <span>
        <ArrowDownUp aria-hidden="true" />
        Sort
      </span>
      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value as ReviewSort)}
      >
        <option value="newest">Newest first</option>
        <option value="highest">Highest rated</option>
        <option value="lowest">Lowest rated</option>
      </select>
    </label>
  </div>
);
