import type {
  Company,
  Question,
  Role,
  SearchResponse,
  SitemapPayload,
  Stats,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const DEFAULT_REVALIDATE = 3600;

type FetchOpts = {
  revalidate?: number | false;
  tags?: string[];
};

async function get<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const next: { revalidate?: number; tags?: string[] } = {};
  if (opts.revalidate === false) {
    // no-store handled below
  } else {
    next.revalidate = opts.revalidate ?? DEFAULT_REVALIDATE;
  }
  if (opts.tags) next.tags = opts.tags;

  const res = await fetch(url, {
    headers: { accept: "application/json" },
    cache: opts.revalidate === false ? "no-store" : undefined,
    next: opts.revalidate === false ? undefined : next,
  });

  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText} for ${path}`);
  }
  return (await res.json()) as T;
}

export const api = {
  stats: () => get<Stats>("/api/stats", { tags: ["stats"] }),
  companies: (limit = 60, offset = 0) =>
    get<{ items: Company[]; total: number }>(
      `/api/companies?limit=${limit}&offset=${offset}`,
      { tags: ["companies"] },
    ),
  company: (slug: string) =>
    get<Company>(
      `/api/companies/${encodeURIComponent(slug)}`,
      { tags: [`company:${slug}`] },
    ),
  companyRole: (slug: string, role: string) =>
    get<{
      company: Company;
      role: Role;
      questions: Question[];
      stats: { difficulty: Record<string, number>; rounds: Record<string, number> };
    }>(
      `/api/companies/${encodeURIComponent(slug)}/roles/${encodeURIComponent(role)}`,
      { tags: [`company:${slug}:${role}`] },
    ),
  roles: () => get<{ items: Role[] }>("/api/roles", { tags: ["roles"] }),
  question: (slug: string) =>
    get<Question & { related: Question[] }>(
      `/api/questions/${encodeURIComponent(slug)}`,
      { tags: [`question:${slug}`] },
    ),
  search: (q: string, type?: string) => {
    const params = new URLSearchParams({ q });
    if (type) params.set("type", type);
    return get<SearchResponse>(`/api/search?${params.toString()}`, {
      revalidate: false,
    });
  },
  sitemapData: () =>
    get<SitemapPayload>("/api/sitemap-data", { revalidate: 1800 }),
};

export function apiBase() {
  return API_BASE;
}

export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[api] falling back:`, (err as Error).message);
    }
    return fallback;
  }
}
