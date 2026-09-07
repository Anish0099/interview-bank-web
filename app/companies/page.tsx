import type { Metadata } from "next";
import { api, safe } from "@/lib/api";
import type { Company } from "@/lib/types";
import { CompanyCard } from "@/components/CompanyCard";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { collectionPageSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Companies — Browse Interview Questions",
  description:
    "Browse interview questions from 50+ companies including Cognizant, TCS, Amazon, Google, Razorpay, Flipkart and more. Free and updated regularly.",
  alternates: { canonical: "/companies" },
};

export default async function CompaniesPage() {
  const data = await safe(() => api.companies(200, 0), { items: [] as Company[], total: 0 });
  const companies = data.items;

  return (
    <div className="container-tight py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Companies" }]} />
      <header className="mt-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          All companies
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          Browse structured interview questions from {data.total} companies — Indian
          IT services, product startups, and global tech. Pick a company to see
          role-by-role breakdowns of recent interview rounds and questions.
        </p>
      </header>

      {companies.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <li key={c.slug}>
              <CompanyCard c={c} />
            </li>
          ))}
        </ul>
      )}

      <JsonLd
        data={collectionPageSchema(
          "All companies",
          absoluteUrl("/companies"),
          `Browse ${data.total} companies with structured interview questions.`,
        )}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
      <p className="text-sm text-zinc-600">
        No companies indexed yet. Check back after the next scrape run.
      </p>
    </div>
  );
}
