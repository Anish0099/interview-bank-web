import type { MetadataRoute } from "next";
import { api, safe } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

const PER_SITEMAP = 5000;

export async function generateSitemaps() {
  const data = await safe(() => api.sitemapData(), {
    companies: [], roles: [], questions: [], companyRoles: [], lastUpdated: new Date().toISOString(),
  });
  const totalUrls =
    3 + // static pages
    data.companies.length +
    data.roles.length +
    data.questions.length +
    data.companyRoles.length;
  const chunks = Math.max(1, Math.ceil(totalUrls / PER_SITEMAP));
  return Array.from({ length: chunks }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const data = await safe(() => api.sitemapData(), {
    companies: [], roles: [], questions: [], companyRoles: [], lastUpdated: new Date().toISOString(),
  });
  const lastModified = new Date(data.lastUpdated);
  const all: MetadataRoute.Sitemap = [];

  // static entries — only in the first chunk
  if (id === 0) {
    all.push(
      { url: `${SITE_URL}/`, lastModified, changeFrequency: "daily", priority: 1 },
      { url: `${SITE_URL}/companies`, lastModified, changeFrequency: "daily", priority: 0.9 },
      { url: `${SITE_URL}/roles`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    );
  }

  for (const slug of data.companies) {
    all.push({ url: `${SITE_URL}/company/${slug}`, lastModified, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const cr of data.companyRoles) {
    all.push({ url: `${SITE_URL}/company/${cr.company}/${cr.role}`, lastModified, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const slug of data.questions) {
    all.push({ url: `${SITE_URL}/question/${slug}`, lastModified, changeFrequency: "monthly", priority: 0.6 });
  }

  const start = id * PER_SITEMAP;
  const end = start + PER_SITEMAP;
  return all.slice(start, end);
}
