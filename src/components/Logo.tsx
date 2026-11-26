import { useId } from "react";
import { CLOUD, MARK_VIEWBOX, STRIPES } from "@/lib/logo";

export function LogoMark({ size = 24, className }: { size?: number; className?: string }) {
  const clip = `sb-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg width={size} height={size} viewBox={MARK_VIEWBOX} className={className} aria-hidden>
      <defs>
        <clipPath id={clip}>
          {CLOUD.circles.map((c) => (
            <circle key={c.cx} {...c} />
          ))}
          <rect {...CLOUD.rect} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {STRIPES.map((s) => (
          <rect key={s.x} x={s.x} y={0} width={s.width} height={32} fill={s.fill} />
        ))}
      </g>
    </svg>
  );
}

/** "samebut" with "but" muted: same thing, but different. */
export function Wordmark() {
  return (
    <span className="text-[17px] font-semibold tracking-[-0.03em]">
      same<span className="font-medium text-muted">but</span>
    </span>
  );
}
