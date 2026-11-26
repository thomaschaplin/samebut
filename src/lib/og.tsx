import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ICONS } from "@/content/icons";
import type { ProviderId } from "@/content/services";

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
  aws: "#ff9900",
  gcp: "#4285f4",
  azure: "#0078d4",
};

export function Brand({ size = 30 }: { size?: number }) {
  const bar = (bg: string) => <div style={{ width: size * 0.3, height: size * 0.85, borderRadius: size * 0.1, background: bg }} />;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.45 }}>
      <div style={{ display: "flex", gap: size * 0.12 }}>
        {bar(OG.aws)}
        {bar(OG.gcp)}
        {bar(OG.azure)}
      </div>
      <div style={{ fontSize: size, fontWeight: 600, color: OG.text }}>samebut</div>
    </div>
  );
}

/** Reads an icon from public/ as a data URI that next/og can draw, or null if there isn't one. */
export async function iconDataUri(id: string, provider: ProviderId) {
  if (!ICONS[id]?.includes(provider)) return null;
  const svg = await readFile(join(process.cwd(), "public", "icons", provider, `${id}.svg`));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}
