import { ImageResponse } from "next/og";
import { getMapping } from "@/content/lookup";
import { CATEGORY_LABEL, MAPPINGS, PROVIDERS } from "@/content/services";
import { Brand, iconDataUri, OG, OG_SIZE } from "@/lib/og";

export const alt = "Cloud service equivalents across AWS, Google Cloud and Azure";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return MAPPINGS.map((m) => ({ id: m.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const m = getMapping((await params).id)!;
  const cols = await Promise.all(PROVIDERS.map(async (p) => ({ p, svc: m[p.id], icon: m[p.id].none ? null : await iconDataUri(m.id, p.id) })));
  const color = { aws: OG.aws, gcp: OG.gcp, azure: OG.azure };

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: OG.bg, padding: 64, justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Brand size={28} />
          <div style={{ fontSize: 22, color: OG.text2, border: `2px solid ${OG.border}`, borderRadius: 999, padding: "4px 18px" }}>
            {CATEGORY_LABEL[m.category]}
          </div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, color: OG.text, letterSpacing: -1.5, lineHeight: 1.05 }}>{m.concept}</div>
        <div style={{ display: "flex", gap: 20 }}>
          {cols.map(({ p, svc, icon }) => (
            <div
              key={p.id}
              style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, background: OG.surface, border: `1px solid ${OG.border}`, borderTop: `6px solid ${color[p.id]}`, borderRadius: 22, padding: 28 }}
            >
              <div style={{ fontSize: 20, color: OG.muted }}>{p.name}</div>
              {icon ? <img src={icon} width={72} height={72} /> : <div style={{ width: 72, height: 72, borderRadius: 16, border: `2px dashed ${OG.border}` }} />}
              <div style={{ fontSize: 32, fontWeight: 700, color: svc.none ? OG.muted : OG.text, lineHeight: 1.1 }}>
                {svc.none ? "No direct equivalent" : svc.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
