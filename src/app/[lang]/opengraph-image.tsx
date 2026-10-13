import { ImageResponse } from "next/og";

import { profile } from "@/content/profile";
import { LOCALES, isLocale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";

// Link-preview image (LinkedIn, Slack, etc.), generated at build time per
// locale and inherited by every route that does not define its own.
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));
export const alt = "appsec/kb";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getUi(isLocale(lang) ? lang : "en");
  // "Software security, mapped by domain." -> accent on the last clause.
  const [head, ...tail] = t.meta.ogTitle.split(", ");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0d1117",
          color: "#e6edf3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#3ddc97" }}>appsec/kb</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>{tail.length ? `${head},` : head}</div>
          {tail.length ? (
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1, color: "#3ddc97" }}>{tail.join(", ")}</div>
          ) : null}
          <div style={{ display: "flex", fontSize: 32, color: "#8b98a5", marginTop: 28 }}>{t.meta.ogTagline}</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#8b98a5" }}>{profile.name}</div>
      </div>
    ),
    size,
  );
}
