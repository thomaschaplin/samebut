/**
 * The samebut mark: one cloud, cut into three stripes (AWS orange, Google
 * green, Azure blue). Same thing, different cloud. Defined once here and used
 * by the header, favicon, Apple icon, OG images and README (scripts/logo.ts).
 */
export const LOGO_COLORS = { aws: "#FF9900", gcp: "#34A853", azure: "#0078D4" } as const;

/** Square viewBox that frames the cloud. */
export const MARK_VIEWBOX = "2.5 2 28 28";

export const CLOUD = {
  circles: [
    { cx: 9.5, cy: 20, r: 5 },
    { cx: 16, cy: 14, r: 7 },
    { cx: 23.5, cy: 18.5, r: 5.5 },
  ],
  rect: { x: 9.5, y: 17, width: 14, height: 8 },
};

export const STRIPES = [
  { x: 0, width: 11.75, fill: LOGO_COLORS.aws },
  { x: 12.95, width: 7.1, fill: LOGO_COLORS.gcp },
  { x: 21.25, width: 12, fill: LOGO_COLORS.azure },
];

const TILE_BG = "#16161b";

function markBody(clipId: string) {
  const clip = [
    ...CLOUD.circles.map((c) => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}"/>`),
    `<rect x="${CLOUD.rect.x}" y="${CLOUD.rect.y}" width="${CLOUD.rect.width}" height="${CLOUD.rect.height}"/>`,
  ].join("");
  const stripes = STRIPES.map((s) => `<rect x="${s.x}" y="0" width="${s.width}" height="32" fill="${s.fill}"/>`).join("");
  return `<defs><clipPath id="${clipId}">${clip}</clipPath></defs><g clip-path="url(#${clipId})">${stripes}</g>`;
}

/** Standalone SVG of the mark. `tile` puts it on a dark rounded square (favicons, app icons). */
export function markSvg({ size = 32, tile = false } = {}) {
  if (!tile)
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${MARK_VIEWBOX}">${markBody("sb-cloud")}</svg>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${TILE_BG}"/><svg x="3" y="3" width="26" height="26" viewBox="${MARK_VIEWBOX}">${markBody("sb-cloud")}</svg></svg>`;
}

/** Mark plus "samebut" wordmark ("but" muted), for the README. */
export function lockupSvg(theme: "light" | "dark") {
  const ink = theme === "dark" ? "#f2f2f4" : "#1a1a1c";
  const muted = theme === "dark" ? "#8b8b96" : "#8a8a93";
  const font = "Geist, Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="72" viewBox="0 0 300 72"><svg x="0" y="6" width="60" height="60" viewBox="${MARK_VIEWBOX}">${markBody("sb-cloud")}</svg><text x="72" y="50" font-family="${font}" font-size="44" font-weight="650" letter-spacing="-1.5" fill="${ink}">same<tspan fill="${muted}" font-weight="500">but</tspan></text></svg>`;
}

export const svgDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
