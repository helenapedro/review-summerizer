const sectionLabels = [
  "Overall sentiment",
  "Common praise",
  "Common complaints",
  "Product summary",
  "Brew quality",
  "Ease of use",
];

export type SummarySection = {
  title: string;
  body: string;
};

export const parseSummarySections = (content: string): SummarySection[] => {
  const normalized = content
    .replace(/\*\*/g, "")
    .replace(/\s+-\s+/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();

  const pattern = new RegExp(
    `(${sectionLabels.map(escapeRegExp).join("|")}):`,
    "gi",
  );
  const matches = [...normalized.matchAll(pattern)];

  if (matches.length === 0) {
    return [{ title: "Summary", body: normalized }];
  }

  return matches
    .map((match, index) => {
      const start = (match.index ?? 0) + match[0].length;
      const end = matches[index + 1]?.index ?? normalized.length;
      const title = toTitleCase(match[1] ?? "Summary");
      const body = normalized.slice(start, end).trim();

      return { title, body };
    })
    .filter((section) => section.body.length > 0);
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
