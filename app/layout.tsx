import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Real Interview Questions from Top Companies | InterviewBank",
    template: "%s | InterviewBank",
  },
  description:
    "Real interview questions from Cognizant, TCS, Amazon, Razorpay and 50+ companies. Sourced from public interview experiences.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: { "en-IN": "/" },
  },
  formatDetection: { email: false, telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow-pop"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="min-h-[calc(100vh-8rem)]">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white"
          >
            IB
          </span>
          <span className="text-base font-semibold tracking-tight">
            InterviewBank
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden gap-6 text-sm text-zinc-600 md:flex">
          <Link href="/companies" className="hover:text-zinc-900">
            Companies
          </Link>
          <Link href="/roles" className="hover:text-zinc-900">
            Roles
          </Link>
          <Link href="/search" className="hover:text-zinc-900">
            Search
          </Link>
        </nav>
        <Link href="/search" className="btn-primary">
          Start searching
        </Link>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-zinc-200 bg-white">
      <div className="container-tight grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
              IB
            </span>
            <span className="font-semibold">InterviewBank</span>
          </div>
          <p className="mt-3 text-sm text-zinc-600">
            Structured, searchable interview questions from public experiences.
          </p>
        </div>
        <FooterCol
          title="Browse"
          links={[
            { href: "/companies", label: "All companies" },
            { href: "/roles", label: "All roles" },
            { href: "/search", label: "Search" },
          ]}
        />
        <FooterCol
          title="Project"
          links={[
            { href: "/about", label: "About" },
            { href: "/legal", label: "Legal & takedowns" },
            { href: "/sitemap.xml", label: "Sitemap" },
          ]}
        />
        <FooterCol
          title="Built by"
          links={[{ href: "https://your-portfolio.example", label: "Your portfolio" }]}
        />
      </div>
      <div className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} InterviewBank. Content is aggregated from
        public sources for educational use.
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-zinc-600">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-zinc-900">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
