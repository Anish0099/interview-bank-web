# interview-bank-web

Next.js 15 (App Router) frontend for InterviewBank.

## Local development

```bash
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL to your local Spring Boot server (default http://localhost:8080)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_API_URL` | Origin of the Spring Boot API. |
| `NEXT_PUBLIC_SITE_URL` | Absolute origin of this site — used for `metadataBase`, canonicals, sitemap and JSON-LD. |

## Deploy

Import this repo into Vercel and set the two env vars above. The default build/output settings work as-is.

Full end-to-end setup (Neon, Reddit app, Groq, Gemini, Render, Vercel, custom domain, Search Console) lives in the API repo: [SETUP.md](https://github.com/Anish0099/interview-bank-api/blob/main/SETUP.md).

## Structure

- `app/` — routes, layouts, `sitemap.ts`, `robots.ts`, dynamic OG image routes.
- `components/` — presentational and small interactive components.
- `lib/api.ts` — typed fetch wrapper for the backend, with per-route ISR revalidation.
- `lib/seo.ts` — SEO helpers.
- `lib/types.ts` — shared TS types matching the API DTOs.
