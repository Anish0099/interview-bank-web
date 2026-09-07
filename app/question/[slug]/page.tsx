import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, safe } from "@/lib/api";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuestionCard } from "@/components/QuestionCard";
import {
  breadcrumbSchema,
  qaPageSchema,
} from "@/lib/schema";
import { SITE_URL, absoluteUrl, truncate } from "@/lib/seo";
import type { Question } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const data = await safe(() => api.sitemapData(), {
    companies: [], roles: [], questions: [], companyRoles: [], lastUpdated: new Date().toISOString(),
  });
  return data.questions.slice(0, 10000).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const data = await safe(() => api.question(slug), null as (Question & { related: Question[] }) | null);
  if (!data) return { title: "Question not found" };
  const q = data;
  const companyPart = q.company ? `${q.company.canonicalName} — ` : "";
  const title = truncate(`${companyPart}${q.questionText}`, 60);
  const description = truncate(
    `${q.questionText} — asked at ${q.company?.canonicalName ?? "a top company"}${q.role ? ` for ${q.role.canonicalName}` : ""}. Round: ${q.roundType ?? "n/a"}. Topics: ${q.topics.join(", ") || "general"}.`,
    160,
  );
  return {
    title,
    description,
    alternates: { canonical: `/question/${q.slug}` },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/question/${q.slug}`),
    },
  };
}

export default async function QuestionPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const data = await safe(() => api.question(slug), null as (Question & { related: Question[] }) | null);
  if (!data) notFound();

  const q = data;
  const related = data.related ?? [];
  const canonicalUrl = absoluteUrl(`/question/${q.slug}`);

  return (
    <div className="container-tight py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(q.company
            ? [
                { label: "Companies", href: "/companies" },
                { label: q.company.canonicalName, href: `/company/${q.company.slug}` },
              ]
            : []),
          { label: "Question" },
        ]}
      />

      <article className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {q.company && (
            <Link href={`/company/${q.company.slug}`} className="pill hover:border-brand-300 hover:text-brand-700">
              {q.company.canonicalName}
            </Link>
          )}
          {q.role && q.company && (
            <Link
              href={`/company/${q.company.slug}/${q.role.slug}`}
              className="pill hover:border-brand-300 hover:text-brand-700"
            >
              {q.role.canonicalName}
            </Link>
          )}
          {q.roundType && <span className="pill capitalize">{q.roundType.replace(/_/g, " ")}</span>}
          {q.difficulty && <span className="pill capitalize">{q.difficulty}</span>}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {q.questionText}
        </h1>

        {q.topics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {q.topics.map((t) => (
              <span key={t} className="pill">{t}</span>
            ))}
          </div>
        )}

        {q.sourceUrl && (
          <p className="mt-6 text-sm text-zinc-600">
            Source:{" "}
            <a
              href={q.sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-brand-700 hover:underline"
            >
              {new URL(q.sourceUrl).hostname}
            </a>
          </p>
        )}

        <section className="prose mt-10 max-w-none text-zinc-700">
          <h2 className="!mt-0 text-xl font-semibold text-zinc-900">
            How to approach this question
          </h2>
          <p>
            Restate the problem before jumping to a solution — many interview
            rubrics reward clarifying assumptions more than the eventual
            algorithm. If this is a coding question, walk through a small input
            first, discuss brute force, then optimise. If it&apos;s a system
            design or behavioural prompt, define scope and constraints out
            loud.
          </p>
          <p>
            The question is tagged{" "}
            {q.topics.length > 0 ? q.topics.join(", ") : "general"}. Interviewers
            typically follow up by asking you to reason about worst-case
            behaviour, alternative data structures, or edge cases you haven&apos;t
            yet covered — plan a couple of those pre-emptively.
          </p>
        </section>
      </article>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight">Related questions</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.id}>
                <QuestionCard q={r} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <JsonLd
        data={[
          qaPageSchema(q, canonicalUrl),
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            ...(q.company
              ? [
                  { name: "Companies", url: absoluteUrl("/companies") },
                  { name: q.company.canonicalName, url: absoluteUrl(`/company/${q.company.slug}`) },
                ]
              : []),
            { name: "Question", url: canonicalUrl },
          ]),
        ]}
      />
    </div>
  );
}
