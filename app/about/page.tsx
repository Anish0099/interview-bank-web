import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About InterviewBank",
  description: "How InterviewBank aggregates and structures interview questions from public sources.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container-tight py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <article className="prose prose-zinc mt-6 max-w-3xl text-[15px] leading-relaxed text-zinc-700">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          About InterviewBank
        </h1>
        <p>
          InterviewBank is a free, structured search index over public interview
          experiences. A scheduled scraper collects posts from Reddit,
          GeeksforGeeks and similar public sources, an LLM extracts a canonical
          schema (company, role, rounds, questions, topics, difficulty), and a
          hybrid full-text + vector index serves it back through a fast search
          UI.
        </p>
        <p>
          The goal is to remove the noise from &quot;interview experience&quot;
          posts — same question phrased 20 different ways, buried in
          storytelling. You should be able to type a company + role and see
          the questions it actually asks, grouped by round and topic.
        </p>
        <p>
          Every question links back to the original public post. Nothing on
          this site is affiliated with, or endorsed by, the companies named.
        </p>
      </article>
    </div>
  );
}
