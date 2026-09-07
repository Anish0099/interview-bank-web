import { SITE_NAME, SITE_URL, absoluteUrl } from "./seo";
import type { Company, Question, Role } from "./types";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema(company: Pick<Company, "canonicalName" | "slug" | "logoUrl" | "description">) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.canonicalName,
    url: absoluteUrl(`/company/${company.slug}`),
    ...(company.logoUrl ? { logo: company.logoUrl } : {}),
    ...(company.description ? { description: company.description } : {}),
  };
}

export function collectionPageSchema(name: string, url: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url,
    description,
  };
}

export function questionListSchema(
  company: Pick<Company, "canonicalName" | "slug">,
  role: Pick<Role, "canonicalName" | "slug"> | null,
  questions: Pick<Question, "slug" | "questionText">[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${company.canonicalName}${role ? ` ${role.canonicalName}` : ""} interview questions`,
    itemListElement: questions.map((q, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/question/${q.slug}`),
      name: q.questionText,
    })),
  };
}

export function qaPageSchema(question: Question, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question.questionText,
      text: question.questionText,
      url,
      ...(question.company
        ? { about: { "@type": "Organization", name: question.company.canonicalName } }
        : {}),
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
