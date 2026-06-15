import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE.name;

export default function Og() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: 80, background: "#0f172a", color: "white",
      }}>
        <div style={{ display: "flex", fontSize: 30, color: "#7dd3fc", fontWeight: 600 }}>{SITE.domain}</div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 800, marginTop: 16, lineHeight: 1.1 }}>
          Occupant load & egress calculator
        </div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 24, color: "#cbd5e1" }}>
          Built on the {SITE.codeEdition} · free, code-cited
        </div>
      </div>
    ),
    size,
  );
}
