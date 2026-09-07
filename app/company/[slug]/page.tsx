import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, safe } from "@/lib/api";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  breadcrumbSchema,
  organizationSchema,
  questionListSchema,
} from "@/lib/schema";
import { SITE_URL, absoluteUrl, titleCase, truncate } from "@/lib/seo";
import type { Company, RoleWithCount } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const data = await safe(() => api.sitemapData(), {
    companies: [], roles: [], questions: [], companyRoles: [], lastUpdated: new Date().toISOString(),
  });
  return data.companies.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const c = await safe(() => api.company(slug), null as Company | null);
  if (!c) return { title: "Company not found" };
  const count = c.questionCount ?? 0;
  const title = truncate(`${c.canonicalName} interview questions (${count})`, 60);
  const description = truncate(
    `${count} real ${c.canonicalName} interview questions from public interview experiences. Covers ${
      (c.topTopics ?? []).slice(0, 4).join(", ") || "DSA, system design and behavioral rounds"
    }.`,
    160,
  );
  const canonical = `/company/${c.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      images: [
        {
          url: absoluteUrl(`/og/company/${c.slug}`),
          width: 1200,
          height: 630,
          alt: `${c.canonicalName} interview questions`,
        },
      ],
    },
  };
}

export default async function CompanyPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const c = await safe(() => api.company(slug), null as Company | null);
  if (!c) notFound();

  const roles = c.roles ?? [];
  const recent = c.recentExperiences ?? [];
  const topics = c.topTopics ?? [];
  const questionCount = c.questionCount ?? 0;
  const lastUpdated = recent[0]?.interviewDate ?? new Date().toISOString().slice(0, 10);

  return (
    <div className="container-tight py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Companies", href: "/companies" },
          { label: c.canonicalName },
        ]}
      />

      <header className="mt-4 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {c.canonicalName} interview questions
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            {questionCount} structured question{questionCount === 1 ? "" : "s"}{" "}
            aggregated from public interview experiences across {roles.length}{" "}
            role{roles.length === 1 ? "" : "s"}. Last updated {lastUpdated}.
          </p>
        </div>
        <div
          aria-hidden
          className="hidden h-16 w-16 flex-none items-center justify-center rounded-2xl bg-zinc-100 text-lg font-semibold text-zinc-700 sm:inline-flex"
        >
          {c.canonicalName.slice(0, 2).toUpperCase()}
        </div>
      </header>

      {c.description && (
        <section className="mt-6 max-w-3xl text-zinc-700">
          <p>{c.description}</p>
        </section>
      )}

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <RolesSection roles={roles} companySlug={c.slug} />
        <TopicsSection topics={topics} />
        <RoundsBreakdown recent={recent} />
      </section>

      <RecentSection recent={recent} companyName={c.canonicalName} />

      <IntroCopy company={c} />

      <JsonLd
        data={[
          organizationSchema(c),
          questionListSchema(
            c,
            null,
            // itemList is derived from top topics as placeholder question anchors
            topics.slice(0, 10).map((t, i) => ({
              slug: `${c.slug}-${t}-${i}`,
              questionText: `${titleCase(t)} — ${c.canonicalName} interview`,
            })),
          ),
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Companies", url: absoluteUrl("/companies") },
            { name: c.canonicalName, url: absoluteUrl(`/company/${c.slug}`) },
          ]),
        ]}
      />
    </div>
  );
}

function RolesSection({
  roles,
  companySlug,
}: {
  roles: RoleWithCount[];
  companySlug: string;
}) {
  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold text-zinc-500">Roles</h2>
      {roles.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">
          No role breakdowns yet — questions are still being categorised.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-zinc-100">
          {roles.map((r) => (
            <li key={r.slug} className="py-2">
              <Link
                href={`/company/${companySlug}/${r.slug}`}
                className="flex items-center justify-between text-sm text-zinc-800 hover:text-brand-700"
              >
                <span>{r.canonicalName}</span>
                <span className="text-xs text-zinc-500">
                  {r.questionCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TopicsSection({ topics }: { topics: string[] }) {
  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold text-zinc-500">Most asked topics</h2>
      {topics.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">Topics appear once questions are indexed.</p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {topics.map((t) => (
            <li key={t} className="pill">
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RoundsBreakdown({ recent }: { recent: NonNullable<Company["recentExperiences"]> }) {
  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold text-zinc-500">
        Rounds typically involved
      </h2>
      <ul className="mt-3 space-y-2 text-sm text-zinc-700">
        <li>
          <strong>Screening</strong> — recruiter chat or a short online assessment.
        </li>
        <li>
          <strong>DSA</strong> — 1–2 rounds of coding problems on arrays, strings,
          graphs and dynamic programming.
        </li>
        <li>
          <strong>System design</strong> — expected from SDE-2 and above; scoping,
          data model, scaling.
        </li>
        <li>
          <strong>Behavioral</strong> — motivation, past projects, teamwork.
        </li>
        <li>
          <strong>HR</strong> — compensation, availability, wrap-up.
        </li>
      </ul>
      {recent.length > 0 && (
        <p className="mt-4 text-xs text-zinc-500">
          Based on {recent.length} recent experience{recent.length === 1 ? "" : "s"}.
        </p>
      )}
    </div>
  );
}

function RecentSection({
  recent,
  companyName,
}: {
  recent: NonNullable<Company["recentExperiences"]>;
  companyName: string;
}) {
  if (recent.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight">
        Recent {companyName} experiences
      </h2>
      <ul className="mt-4 space-y-3">
        {recent.map((e) => (
          <li key={e.id} className="card p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              {e.roleName && <span className="pill">{e.roleName}</span>}
              {e.seniority && <span className="pill capitalize">{e.seniority}</span>}
              {e.outcome && <span className="pill capitalize">{e.outcome}</span>}
              {e.interviewDate && <span>{e.interviewDate}</span>}
            </div>
            {e.summary && (
              <p className="mt-2 text-sm text-zinc-700">{e.summary}</p>
            )}
            {e.sourceUrl && (
              <a
                href={e.sourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-2 inline-block text-xs text-brand-600 hover:text-brand-700"
              >
                Source →
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function IntroCopy({ company }: { company: Company }) {
  const roles = company.roles ?? [];
  const topics = company.topTopics ?? [];
  const questionCount = company.questionCount ?? 0;
  return (
    <section className="mt-14 max-w-3xl text-zinc-700">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
        Preparing for a {company.canonicalName} interview
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed">
        <p>
          This page collects {questionCount} structured question
          {questionCount === 1 ? "" : "s"} from real{" "}
          {company.canonicalName} interview experiences shared on Reddit,
          GeeksforGeeks and similar public sources. Each experience is parsed by
          an LLM into a canonical schema so you can filter by round type,
          difficulty and topic instead of hunting through free-form posts.
        </p>
        <p>
          The bank spans{" "}
          {roles.length > 0
            ? `${roles.length} role${roles.length === 1 ? "" : "s"} — ${roles
                .slice(0, 4)
                .map((r) => r.canonicalName)
                .join(", ")}${roles.length > 4 ? " and more" : ""}`
            : "several roles from entry-level to senior positions"}
          . Wherever a company runs a distinct rubric per role, we surface it
          via <Link href="/roles" className="text-brand-700 hover:underline">role-specific pages</Link>{" "}
          so you can jump straight to what applies to you.
        </p>
        <p>
          Recent {company.canonicalName} interviews lean on{" "}
          {topics.length > 0
            ? topics.slice(0, 6).map((t) => t.replace(/-/g, " ")).join(", ")
            : "core CS fundamentals, data structures, and problem solving"}
          . For SDE-1 candidates, expect 1–2 rounds of DSA followed by a
          behavioural round. For SDE-2 and above, a system design round is
          almost always in scope, and depth of domain experience gets probed
          via a &quot;deep dive&quot; on past projects.
        </p>
        <p>
          A note on sources: every experience links back to the original public
          post. If you are the author of a linked experience and want it
          removed, use the <Link href="/legal" className="text-brand-700 hover:underline">takedown form</Link>{" "}
          and we will remove it within 48 hours. Nothing on this page is
          affiliated with, or endorsed by, {company.canonicalName}.
        </p>
        <p>
          Related companies you might also study for:{" "}
          <RelatedCompanies exclude={company.slug} industry={company.industry ?? undefined} />.
        </p>
      </div>
    </section>
  );
}

async function RelatedCompanies({
  exclude,
  industry,
}: {
  exclude: string;
  industry?: string;
}) {
  const data = await safe(() => api.companies(200, 0), { items: [] as Company[], total: 0 });
  const pool = data.items.filter((c) => c.slug !== exclude);
  const same = industry ? pool.filter((c) => c.industry === industry) : pool;
  const picks = (same.length >= 5 ? same : pool).slice(0, 5);
  if (picks.length === 0) return <span>Amazon, Google, Microsoft, Flipkart, Razorpay</span>;
  return (
    <>
      {picks.map((c, i) => (
        <span key={c.slug}>
          <Link href={`/company/${c.slug}`} className="text-brand-700 hover:underline">
            {c.canonicalName}
          </Link>
          {i < picks.length - 1 ? ", " : ""}
        </span>
      ))}
    </>
  );
}
