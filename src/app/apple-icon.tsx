import { ImageResponse } from "next/og";
import { markSvg, svgDataUri } from "@/lib/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#16161b" }}>
        <img src={svgDataUri(markSvg({ size: 132 }))} width={132} height={132} />
      </div>
    ),
    size,
  );
}
