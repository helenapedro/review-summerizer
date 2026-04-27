import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ApiError, fetchProductReviews } from "./api/reviews";
import { ProductHeader } from "./components/ProductHeader";
import { ProductSelector } from "./components/ProductSelector";
import { ReviewList } from "./components/ReviewList";
import { SummaryPanel } from "./components/SummaryPanel";
import type { ProductReviewsResponse } from "./types";

export const App = () => {
  const [productId, setProductId] = useState(1);
  const [inputValue, setInputValue] = useState("1");
  const [data, setData] = useState<ProductReviewsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const product = useMemo(
    () => data?.summary.product ?? data?.reviews[0]?.product,
    [data],
  );

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

  const handleSubmit = () => {
    const nextProductId = Number(inputValue);

    if (!Number.isInteger(nextProductId) || nextProductId < 1) {
      setError("Enter a valid positive product ID.");
      return;
    }

    setProductId(nextProductId);
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
          inputValue={inputValue}
          isLoading={isLoading}
          onInputChange={setInputValue}
          onSubmit={handleSubmit}
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
              />
              <ReviewList reviews={data.reviews} />
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
};
