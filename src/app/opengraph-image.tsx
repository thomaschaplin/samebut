import { ImageResponse } from "next/og";
import { Brand, iconDataUri, OG, OG_SIZE } from "@/lib/og";

export const alt = "samebut: AWS, Google Cloud and Azure services, side by side";
export const size = OG_SIZE;
export const contentType = "image/png";

const SHOWCASE = ["object-storage", "functions", "kubernetes", "key-value"];

export default async function Image() {
  const rows = await Promise.all(
    SHOWCASE.map(async (id) => Promise.all((["aws", "gcp", "azure"] as const).map((p) => iconDataUri(id, p)))),
  );
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: OG.bg, padding: 72, gap: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <Brand />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 76, fontWeight: 700, color: OG.text, lineHeight: 1.02, letterSpacing: -2 }}>Know one cloud?</div>
            <div style={{ fontSize: 76, fontWeight: 700, color: OG.muted, lineHeight: 1.02, letterSpacing: -2 }}>Find the other two.</div>
            <div style={{ fontSize: 28, color: OG.text2, marginTop: 8 }}>AWS · Google Cloud · Azure, side by side</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 22, background: OG.surface, border: `1px solid ${OG.border}`, borderRadius: 28, padding: 36 }}>
          {rows.map((icons, i) => (
            <div key={i} style={{ display: "flex", gap: 22 }}>
              {icons.map((src, j) => (src ? <img key={j} src={src} width={84} height={84} /> : <div key={j} style={{ width: 84, height: 84 }} />))}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
