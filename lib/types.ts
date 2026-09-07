export type Company = {
  id: number;
  slug: string;
  canonicalName: string;
  industry?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  questionCount?: number;
  topTopics?: string[];
  recentExperiences?: ExperienceSummary[];
  roles?: RoleWithCount[];
};

export type RoleWithCount = {
  slug: string;
  canonicalName: string;
  questionCount: number;
};

export type ExperienceSummary = {
  id: number;
  seniority?: string | null;
  outcome?: string | null;
  interviewDate?: string | null;
  summary?: string | null;
  sourceUrl?: string | null;
  roleSlug?: string | null;
  roleName?: string | null;
};

export type Role = {
  id: number;
  slug: string;
  canonicalName: string;
  category?: string | null;
  questionCount?: number;
};

export type Question = {
  id: number;
  slug: string;
  questionText: string;
  roundType?: string | null;
  difficulty?: string | null;
  topics: string[];
  company?: Pick<Company, "slug" | "canonicalName">;
  role?: Pick<Role, "slug" | "canonicalName">;
  sourceUrl?: string;
};

export type Stats = {
  companies: number;
  roles: number;
  questions: number;
  experiences: number;
  lastUpdated: string;
};

export type SearchResponse = {
  query: string;
  total: number;
  results: Question[];
};

export type SitemapPayload = {
  companies: string[];
  roles: string[];
  questions: string[];
  companyRoles: Array<{ company: string; role: string }>;
  lastUpdated: string;
};
