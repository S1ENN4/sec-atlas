import { ImageResponse } from "next/og";

import { profile } from "@/content/profile";

// Link-preview image (LinkedIn, Slack, etc.), generated at build time and
// inherited by every route that does not define its own.
export const dynamic = "force-static";
export const alt = "appsec/kb: mapa interativo de segurança de software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
            Segurança de software,
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1, color: "#3ddc97" }}>
            mapeada por domínio.
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#8b98a5", marginTop: 28 }}>
            AppSec · CloudSec · Agentes de IA
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#8b98a5" }}>{profile.name}</div>
      </div>
    ),
    size,
  );
}
