import { Clock, RefreshCw, Sparkles } from "lucide-react";
import type { Summary } from "../types";
import { formatDateTime, formatSummarySource } from "../utils/formatters";
import { parseSummarySections } from "../utils/summaryText";

type SummaryPanelProps = {
  summary: Summary;
  source: string;
  isRefreshing: boolean;
  onRefresh: () => void;
};

export const SummaryPanel = ({
  summary,
  source,
  isRefreshing,
  onRefresh,
}: SummaryPanelProps) => {
  const sections = parseSummarySections(summary.content);

  return (
    <section className="summary-panel" aria-labelledby="summary-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">AI Summary</span>
          <h2 id="summary-title">Recent review signal</h2>
        </div>
        <span className="source-badge">
          <Sparkles aria-hidden="true" />
          {formatSummarySource(source)}
        </span>
      </div>

      <button
        className="refresh-summary-button"
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={isRefreshing ? "spin" : undefined} aria-hidden="true" />
        {isRefreshing ? "Refreshing" : "Refresh summary"}
      </button>

      <div className="summary-sections">
        {sections.map((section) => (
          <section className="summary-section" key={section.title}>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
          </section>
        ))}
      </div>

      <div className="summary-meta">
        <span>
          <Clock aria-hidden="true" />
          Generated {formatDateTime(summary.generatedAt)}
        </span>
        <span>Expires {formatDateTime(summary.expiresAt)}</span>
      </div>
    </section>
  );
};
