import type { Metadata } from "next";
import { api, safe } from "@/lib/api";
import { QuestionCard } from "@/components/QuestionCard";
import { SearchBox } from "@/components/SearchBox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { SearchResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ q?: string }> },
): Promise<Metadata> {
  const q = (await searchParams).q ?? "";
  const base = "Search interview questions";
  return {
    title: q ? `${base}: ${q}` : base,
    description: q
      ? `Real interview questions matching "${q}" — hybrid full-text + semantic search across 50+ companies.`
      : "Search structured interview questions from Cognizant, TCS, Amazon, Razorpay and more.",
    alternates: { canonical: q ? `/search?q=${encodeURIComponent(q)}` : "/search" },
    robots: q ? { index: false, follow: true } : undefined,
  };
}

export default async function SearchPage(
  { searchParams }: { searchParams: Promise<{ q?: string; type?: string }> },
) {
  const params = await searchParams;
  const q = params.q ?? "";
  const type = params.type;

  const results: SearchResponse | null = q
    ? await safe(() => api.search(q, type), null as SearchResponse | null)
    : null;

  return (
    <div className="container-tight py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <header className="mt-4 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Search interview questions
        </h1>
        <p className="mt-2 text-zinc-600">
          Hybrid full-text plus semantic search — the ranker blends keyword and
          meaning match, so exact terms and paraphrases both surface.
        </p>
      </header>

      <div className="mt-8 max-w-3xl">
        <SearchBox initialValue={q} autoFocus />
      </div>

      {q === "" ? (
        <EmptyPrompt />
      ) : results === null ? (
        <NoResults query={q} />
      ) : results.results.length === 0 ? (
        <NoResults query={q} />
      ) : (
        <section className="mt-10">
          <p className="text-sm text-zinc-600">
            {results.total} result{results.total === 1 ? "" : "s"} for{" "}
            <span className="font-medium text-zinc-800">&ldquo;{q}&rdquo;</span>
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {results.results.map((r) => (
              <li key={r.id}>
                <QuestionCard q={r} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function EmptyPrompt() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      <SuggestCard title="Try a company + role" example="cognizant sde-2" />
      <SuggestCard title="Try a topic" example="system design capacity estimation" />
    </div>
  );
}

function SuggestCard({ title, example }: { title: string; example: string }) {
  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold text-zinc-500">{title}</h2>
      <p className="mt-2 text-base text-zinc-800">&ldquo;{example}&rdquo;</p>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
      <p className="text-sm text-zinc-600">
        No matches for <span className="font-medium text-zinc-800">&ldquo;{query}&rdquo;</span> yet. Try a
        broader query or browse{" "}
        <a href="/companies" className="text-brand-700 underline">
          all companies
        </a>
        .
      </p>
    </div>
  );
}
