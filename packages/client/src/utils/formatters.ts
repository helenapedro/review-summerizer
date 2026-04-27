export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);

export const formatSummarySource = (source: string) => {
  if (source === "in-flight") {
    return "Shared generation";
  }

  return source[0]?.toUpperCase() + source.slice(1);
};
