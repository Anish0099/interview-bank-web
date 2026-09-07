import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Legal & Takedowns",
  description:
    "Fair-use content aggregation, source attribution and takedown request process for InterviewBank.",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return (
    <div className="container-tight py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Legal" }]} />
      <article className="prose prose-zinc mt-6 max-w-3xl text-[15px] leading-relaxed text-zinc-700">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Legal &amp; takedown requests
        </h1>
        <h2 className="mt-8">Content sourcing</h2>
        <p>
          InterviewBank indexes public interview-experience posts. Each
          extracted question links back to the original post and preserves the
          source URL. We do not store Reddit usernames or personally identifying
          information.
        </p>
        <h2 className="mt-8">Fair use</h2>
        <p>
          Individual interview questions are typically short factual utterances
          not eligible for copyright in most jurisdictions. Where a full post
          would be, we index the extracted question text plus a short summary
          only — not the original prose.
        </p>
        <h2 className="mt-8">Takedown requests</h2>
        <p>
          If you authored an experience that appears here and want it removed,
          email the address below with (a) the URL of the InterviewBank page
          you want removed and (b) either the source URL you posted or another
          way to prove authorship. We remove within 48 hours.
        </p>
        <p>
          Contact:{" "}
          <span className="rounded bg-zinc-100 px-2 py-1 font-mono text-sm">
            takedowns@your-domain.example
          </span>
        </p>
        <h2 className="mt-8">Trademarks</h2>
        <p>
          Company names and logos are the property of their respective owners.
          Their appearance here is descriptive, not affiliative or endorsing.
        </p>
      </article>
    </div>
  );
}
