import { ImageResponse } from "next/og";
import { api, safe } from "@/lib/api";
import type { Company } from "@/lib/types";

export const runtime = "nodejs";
const SIZE = { width: 1200, height: 630 };

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const c = await safe(() => api.company(slug), null as Company | null);

  const displayName = c?.canonicalName ?? slug.replace(/-/g, " ");
  const count = c?.questionCount ?? 0;
  const industry = c?.industry ?? "InterviewBank";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)",
          color: "#18181b",
          fontFamily: "sans-serif",
          padding: "72px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#4f46e5",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            IB
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#3f3f46" }}>
            InterviewBank
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 104,
                height: 104,
                borderRadius: 24,
                background: "#e4e4e7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 44,
                fontWeight: 700,
                color: "#3f3f46",
              }}
            >
              {initials || "IB"}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -1 }}>
                {displayName}
              </div>
              <div style={{ fontSize: 32, color: "#52525b" }}>{industry}</div>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 36,
              color: "#4f46e5",
              fontWeight: 600,
            }}
          >
            {count} real interview questions
          </div>
        </div>

        <div style={{ fontSize: 24, color: "#71717a" }}>
          interviews.yourdomain.com
        </div>
      </div>
    ),
    { ...SIZE },
  );
}
