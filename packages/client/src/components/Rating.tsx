import { Star } from "lucide-react";

type RatingProps = {
  value: number;
};

export const Rating = ({ value }: RatingProps) => (
  <div className="rating" aria-label={`${value} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, index) => {
      const filled = index < value;

      return (
        <Star
          key={index}
          className={filled ? "rating-star filled" : "rating-star"}
          aria-hidden="true"
        />
      );
    })}
  </div>
);
