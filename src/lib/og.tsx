import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ICONS } from "@/content/icons";
import type { ProviderId } from "@/content/services";
import { LOGO_COLORS, markSvg, svgDataUri } from "@/lib/logo";

/**
 * Shared look for Open Graph images. next/og renders a subset of CSS with
 * flexbox only and no CSS variables, so the dark palette is inlined.
 */
export const OG_SIZE = { width: 1200, height: 630 };

export const OG = {
  bg: "#0d0d10",
  surface: "#151519",
  border: "#2a2a31",
  text: "#f2f2f4",
  text2: "#b4b4bd",
  muted: "#8b8b96",
  aws: LOGO_COLORS.aws,
  gcp: LOGO_COLORS.gcp,
  azure: LOGO_COLORS.azure,
};

export function Brand({ size = 30 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <img src={svgDataUri(markSvg({ size: size * 1.6 }))} width={size * 1.6} height={size * 1.6} />
      <div style={{ display: "flex", fontSize: size, fontWeight: 600, letterSpacing: -0.8, color: OG.text }}>
        same<span style={{ color: OG.muted }}>but</span>
      </div>
    </div>
  );
}

/** Reads an icon from public/ as a data URI that next/og can draw, or null if there isn't one. */
export async function iconDataUri(id: string, provider: ProviderId) {
  if (!ICONS[id]?.includes(provider)) return null;
  const svg = await readFile(join(process.cwd(), "public", "icons", provider, `${id}.svg`));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}
