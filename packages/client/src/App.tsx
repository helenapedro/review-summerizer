import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ApiError,
  fetchProductReviews,
  fetchProducts,
  refreshProductSummary,
} from "./api/reviews";
import { ProductHeader } from "./components/ProductHeader";
import { ProductSelector } from "./components/ProductSelector";
import { ReviewList } from "./components/ReviewList";
import type { ReviewSort } from "./components/ReviewControls";
import { SummaryPanel } from "./components/SummaryPanel";
import type { Product, ProductReviewsResponse, Review } from "./types";

export const App = () => {
  const [productId, setProductId] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [data, setData] = useState<ProductReviewsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingSummary, setIsRefreshingSummary] = useState(false);
  const [reviewQuery, setReviewQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [reviewSort, setReviewSort] = useState<ReviewSort>("newest");

  const product = useMemo(
    () => data?.summary.product ?? data?.reviews[0]?.product,
    [data],
  );

  const visibleReviews = useMemo(() => {
    const normalizedQuery = reviewQuery.trim().toLowerCase();
    const reviews = data?.reviews ?? [];

    return reviews
      .filter((review) => {
        const matchesRating = review.rating >= minRating;
        const matchesQuery =
          normalizedQuery.length === 0 ||
          review.author.toLowerCase().includes(normalizedQuery) ||
          review.content.toLowerCase().includes(normalizedQuery);

        return matchesRating && matchesQuery;
      })
      .sort(sortReviews(reviewSort));
  }, [data, minRating, reviewQuery, reviewSort]);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const result = await fetchProducts(controller.signal);

        if (!controller.signal.aborted) {
          setProducts(result.products);
        }
      } catch {
        if (!controller.signal.aborted) {
          setProducts([]);
        }
      }
    };

    void loadProducts();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadReviews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchProductReviews(productId, controller.signal);
        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          caughtError instanceof ApiError
            ? caughtError.message
            : "Unable to load product review data";
        setError(message);
        setData(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadReviews();

    return () => controller.abort();
  }, [productId]);

  const handleProductSelect = (nextProductId: number) => {
    setProductId(nextProductId);
  };

  const handleRefreshSummary = async () => {
    setIsRefreshingSummary(true);
    setError(null);

    try {
      const result = await refreshProductSummary(productId);

      setData((currentData) => {
        if (!currentData) {
          return currentData;
        }

        return {
          ...currentData,
          summary: result.summary,
          summarySource: result.source,
        };
      });
    } catch (caughtError) {
      const message =
        caughtError instanceof ApiError
          ? caughtError.message
          : "Unable to refresh product summary";
      setError(message);
    } finally {
      setIsRefreshingSummary(false);
    }
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>RS</span>
          <div>
            <strong>Review Summerizer</strong>
            <small>Product insight console</small>
          </div>
        </div>

        <ProductSelector
          isLoading={isLoading}
          products={products}
          selectedProductId={productId}
          onProductSelect={handleProductSelect}
        />
      </aside>

      <div className="content">
        {isLoading ? (
          <section className="state-panel">
            <RefreshCw className="spin" aria-hidden="true" />
            <h1>Loading product reviews</h1>
          </section>
        ) : null}

        {!isLoading && error ? (
          <section className="state-panel error-state">
            <AlertCircle aria-hidden="true" />
            <h1>{error}</h1>
          </section>
        ) : null}

        {!isLoading && !error && data && product ? (
          <>
            <ProductHeader product={product} reviews={data.reviews} />
            <div className="main-grid">
              <SummaryPanel
                summary={data.summary}
                source={data.summarySource}
                isRefreshing={isRefreshingSummary}
                onRefresh={handleRefreshSummary}
              />
              <ReviewList
                reviews={visibleReviews}
                totalReviews={data.reviews.length}
                query={reviewQuery}
                minRating={minRating}
                sort={reviewSort}
                onQueryChange={setReviewQuery}
                onMinRatingChange={setMinRating}
                onSortChange={setReviewSort}
              />
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
};

const sortReviews =
  (sort: ReviewSort) =>
  (first: Review, second: Review) => {
    if (sort === "highest") {
      return second.rating - first.rating;
    }

    if (sort === "lowest") {
      return first.rating - second.rating;
    }

    return (
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
    );
  };
