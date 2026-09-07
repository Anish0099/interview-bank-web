import Link from "next/link";
import type { Question } from "@/lib/types";

export function QuestionCard({ q }: { q: Question }) {
  const href = `/question/${q.slug}`;
  return (
    <article className="card p-5 transition hover:shadow-pop">
      <Link href={href} className="block">
        <h3 className="text-base font-medium leading-snug text-zinc-900 group-hover:text-brand-700">
          {q.questionText}
        </h3>
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {q.company && (
          <Link
            href={`/company/${q.company.slug}`}
            className="pill hover:border-brand-300 hover:text-brand-700"
          >
            {q.company.canonicalName}
          </Link>
        )}
        {q.role && (
          <Link
            href={`/company/${q.company?.slug ?? ""}/${q.role.slug}`}
            className="pill hover:border-brand-300 hover:text-brand-700"
          >
            {q.role.canonicalName}
          </Link>
        )}
        {q.difficulty && (
          <span className="pill capitalize">{q.difficulty}</span>
        )}
        {q.roundType && (
          <span className="pill capitalize">{q.roundType.replace(/_/g, " ")}</span>
        )}
        {q.topics?.slice(0, 3).map((t) => (
          <span key={t} className="pill">
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
