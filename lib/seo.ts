export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviews.yourdomain.com";

export const SITE_NAME = "InterviewBank";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export function titleCase(input: string): string {
  return input
    .split(/[-\s_]+/)
    .filter(Boolean)
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

export function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return input.slice(0, max - 1).trimEnd() + "…";
}
