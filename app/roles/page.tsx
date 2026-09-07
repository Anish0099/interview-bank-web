import type { Metadata } from "next";
import Link from "next/link";
import { api, safe } from "@/lib/api";
import type { Role } from "@/lib/types";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { collectionPageSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Roles — Interview Questions by Job Title",
  description:
    "Browse interview questions by role: SDE-1, SDE-2, Senior SDE, Backend, Frontend, Data Engineer, ML Engineer, DevOps, Android, iOS and more.",
  alternates: { canonical: "/roles" },
};

export default async function RolesPage() {
  const data = await safe(() => api.roles(), { items: [] as Role[] });

  return (
    <div className="container-tight py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Roles" }]} />
      <header className="mt-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Interview questions by role
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          From SDE-1 fresher rounds to Staff Engineer system-design deep dives —
          jump straight to the role you&apos;re preparing for.
        </p>
      </header>

      {data.items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-600">
          No roles indexed yet.
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/search?q=${encodeURIComponent(r.canonicalName)}`}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-card transition hover:border-brand-300 hover:shadow-pop"
              >
                <div>
                  <div className="text-sm font-medium text-zinc-900">{r.canonicalName}</div>
                  {r.category && (
                    <div className="text-xs text-zinc-500">{r.category}</div>
                  )}
                </div>
                <span className="text-xs text-zinc-500">
                  {r.questionCount ?? 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <JsonLd
        data={collectionPageSchema(
          "All roles",
          absoluteUrl("/roles"),
          "Interview questions organised by job role.",
        )}
      />
    </div>
  );
}
