import Link from "next/link";
import type { Company } from "@/lib/types";

export function CompanyCard({ c }: { c: Company }) {
  const initials = c.canonicalName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <Link
      href={`/company/${c.slug}`}
      className="group flex h-full flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-card transition hover:border-brand-300 hover:shadow-pop"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-700 group-hover:bg-brand-50 group-hover:text-brand-700"
        >
          {initials || c.slug.slice(0, 2).toUpperCase()}
        </span>
        <div>
          <div className="text-sm font-semibold text-zinc-900">{c.canonicalName}</div>
          {c.industry && (
            <div className="text-xs text-zinc-500">{c.industry}</div>
          )}
        </div>
      </div>
      <div className="mt-4 text-xs text-zinc-500">
        {c.questionCount ?? 0} question{(c.questionCount ?? 0) === 1 ? "" : "s"}
      </div>
    </Link>
  );
}
