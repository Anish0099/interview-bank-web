import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Real Interview Questions from Top Companies",
  description:
    "Search real interview questions from Cognizant, TCS, Amazon, Razorpay and 50+ companies. Sourced from public interview experiences and structured with AI.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "InterviewBank — Real Interview Questions",
    description:
      "Search real interview questions across 50+ companies. Sourced from public experiences.",
    url: SITE_URL,
  },
};

const featuredCompanies = [
  { slug: "cognizant", name: "Cognizant" },
  { slug: "tcs", name: "TCS" },
  { slug: "infosys", name: "Infosys" },
  { slug: "amazon", name: "Amazon" },
  { slug: "google", name: "Google" },
  { slug: "microsoft", name: "Microsoft" },
  { slug: "razorpay", name: "Razorpay" },
  { slug: "flipkart", name: "Flipkart" },
];

export default function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <HowItWorks />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-white to-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center"
      >
        <div className="h-72 w-[36rem] rounded-full bg-brand-200/40 blur-3xl" />
      </div>
      <div className="container-tight py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="pill">Free · Updated every 6 hours</span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Real interview questions,{" "}
            <span className="text-brand-600">structured and searchable.</span>
          </h1>
          <p className="mt-5 text-lg text-zinc-600">
            Search thousands of interview questions aggregated from public
            interview experiences on Reddit, GeeksforGeeks and more.
          </p>
          <form
            action="/search"
            method="GET"
            className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-card focus-within:ring-2 focus-within:ring-brand-500"
          >
            <label htmlFor="q" className="sr-only">
              Search interview questions
            </label>
            <input
              id="q"
              name="q"
              type="search"
              placeholder="e.g. Cognizant SDE-2 system design"
              className="flex-1 border-0 bg-transparent px-3 py-2 text-base text-zinc-900 outline-none placeholder:text-zinc-400"
              autoComplete="off"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>
          <p className="mt-3 text-xs text-zinc-500">
            Try:{" "}
            <Link className="underline underline-offset-2 hover:text-zinc-800" href="/search?q=cognizant+sde-2">
              cognizant sde-2
            </Link>{" "}
            ·{" "}
            <Link className="underline underline-offset-2 hover:text-zinc-800" href="/search?q=amazon+system+design">
              amazon system design
            </Link>{" "}
            ·{" "}
            <Link className="underline underline-offset-2 hover:text-zinc-800" href="/search?q=razorpay+backend">
              razorpay backend
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function Featured() {
  return (
    <section className="container-tight py-16">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Popular companies
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Browse structured questions by company and role.
          </p>
        </div>
        <Link href="/companies" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          View all →
        </Link>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {featuredCompanies.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/company/${c.slug}`}
              className="group flex h-full items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-card transition hover:border-brand-300 hover:shadow-pop"
            >
              <span
                aria-hidden
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-700 group-hover:bg-brand-50 group-hover:text-brand-700"
              >
                {c.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="text-sm font-medium text-zinc-900">
                {c.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "1. We aggregate",
      body: "A scheduled job pulls interview experiences from public sources every 6 hours.",
    },
    {
      title: "2. We structure",
      body: "An LLM extracts company, role, rounds and questions into a canonical schema.",
    },
    {
      title: "3. You search",
      body: "Hybrid full-text + vector search surfaces the most relevant questions instantly.",
    },
  ];
  return (
    <section className="border-t border-zinc-200 bg-white">
      <div className="container-tight py-16">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="card p-6">
              <h3 className="text-sm font-semibold text-brand-700">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
