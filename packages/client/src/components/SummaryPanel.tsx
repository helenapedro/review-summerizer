import { Clock, Sparkles } from "lucide-react";
import type { Summary } from "../types";
import { formatDateTime, formatSummarySource } from "../utils/formatters";

type SummaryPanelProps = {
  summary: Summary;
  source: string;
};

export const SummaryPanel = ({ summary, source }: SummaryPanelProps) => (
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

    <p className="summary-content">{summary.content}</p>

    <div className="summary-meta">
      <span>
        <Clock aria-hidden="true" />
        Generated {formatDateTime(summary.generatedAt)}
      </span>
      <span>Expires {formatDateTime(summary.expiresAt)}</span>
    </div>
  </section>
);
