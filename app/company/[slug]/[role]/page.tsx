import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, safe } from "@/lib/api";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuestionCard } from "@/components/QuestionCard";
import {
  breadcrumbSchema,
  questionListSchema,
} from "@/lib/schema";
import { SITE_URL, absoluteUrl, truncate } from "@/lib/seo";

export const revalidate = 3600;

type PageParams = { slug: string; role: string };

export async function generateStaticParams() {
  const data = await safe(() => api.sitemapData(), {
    companies: [], roles: [], questions: [], companyRoles: [], lastUpdated: new Date().toISOString(),
  });
  return data.companyRoles.map((cr) => ({ slug: cr.company, role: cr.role }));
}

export async function generateMetadata(
  { params }: { params: Promise<PageParams> },
): Promise<Metadata> {
  const { slug, role } = await params;
  const data = await safe(() => api.companyRole(slug, role), null as Awaited<ReturnType<typeof api.companyRole>> | null);
  if (!data) return { title: "Not found" };
  const company = data.company.canonicalName;
  const roleName = data.role.canonicalName;
  const count = data.questions.length;
  const title = truncate(`${company} ${roleName} interview questions`, 60);
  const description = truncate(
    `${count} real ${company} ${roleName} interview questions with round-by-round breakdown, difficulty and topics.`,
    160,
  );
  const canonical = `/company/${slug}/${role}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      images: [{ url: absoluteUrl(`/og/company/${slug}`), width: 1200, height: 630 }],
    },
  };
}

export default async function CompanyRolePage(
  { params }: { params: Promise<PageParams> },
) {
  const { slug, role } = await params;
  const data = await safe(() => api.companyRole(slug, role), null as Awaited<ReturnType<typeof api.companyRole>> | null);
  if (!data) notFound();

  const company = data.company;
  const roleData = data.role;
  const questions = data.questions;
  const stats = data.stats;

  return (
    <div className="container-tight py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Companies", href: "/companies" },
          { label: company.canonicalName, href: `/company/${company.slug}` },
          { label: roleData.canonicalName },
        ]}
      />
      <header className="mt-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {company.canonicalName} {roleData.canonicalName} interview questions
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          {questions.length} question{questions.length === 1 ? "" : "s"} from real{" "}
          {company.canonicalName} {roleData.canonicalName} interviews, grouped by
          round and topic.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total questions" value={questions.length.toString()} />
        <StatCard label="Round mix" value={Object.keys(stats.rounds).length + " round types"} />
        <StatCard label="Difficulty split" value={friendlyDiff(stats.difficulty)} />
        <StatCard
          label="Also study"
          value={
            <Link href={`/company/${company.slug}`} className="text-brand-700 hover:underline">
              All {company.canonicalName} questions →
            </Link>
          }
        />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Questions</h2>
        {questions.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No questions yet.</p>
        ) : (
          <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {questions.map((q) => (
              <li key={q.id}>
                <QuestionCard q={q} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14 max-w-3xl text-[15px] leading-relaxed text-zinc-700">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          What {company.canonicalName} tends to ask {roleData.canonicalName} candidates
        </h2>
        <p className="mt-4">
          Based on the {questions.length} indexed question
          {questions.length === 1 ? "" : "s"}, the {roleData.canonicalName}{" "}
          interview loop at {company.canonicalName} typically includes {Object.keys(stats.rounds).length}{" "}
          distinct round type{Object.keys(stats.rounds).length === 1 ? "" : "s"}.
          Expect a healthy mix of {friendlyDiff(stats.difficulty)} — the coding
          bar generally scales with the level (SDE-2 and above see harder
          problems and more open-ended system design questions).
        </p>
        <p className="mt-4">
          Prepare thematically: cluster the questions on this page by topic
          (data structures, system design, behavioural) and drill each cluster
          separately. Use the source links on individual questions to read the
          original experience for full context — that&apos;s where the
          rubric-shaping detail usually lives.
        </p>
      </section>

      <JsonLd
        data={[
          questionListSchema(
            company,
            roleData,
            questions.slice(0, 20).map((q) => ({ slug: q.slug, questionText: q.questionText })),
          ),
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Companies", url: absoluteUrl("/companies") },
            { name: company.canonicalName, url: absoluteUrl(`/company/${company.slug}`) },
            {
              name: roleData.canonicalName,
              url: absoluteUrl(`/company/${company.slug}/${roleData.slug}`),
            },
          ]),
        ]}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

function friendlyDiff(dist: Record<string, number>) {
  const total = Object.values(dist).reduce((a, b) => a + b, 0);
  if (total === 0) return "mixed difficulty";
  const parts: string[] = [];
  for (const [k, v] of Object.entries(dist)) {
    parts.push(`${Math.round((v * 100) / total)}% ${k}`);
  }
  return parts.join(", ");
}
