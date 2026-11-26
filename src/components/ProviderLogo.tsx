import { useId } from "react";
import type { ProviderId } from "@/content/services";

/**
 * Simplified provider marks drawn inline so they theme cleanly. Swap in the
 * official SVGs from each provider's brand/icon kit if you prefer.
 */
export function ProviderLogo({ id, size = 22 }: { id: ProviderId; size?: number }) {
  // Unique gradient ids per instance: a shared id breaks when the first copy is display:none.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  if (id === "aws")
    return (
      <svg width={size * 1.6} height={size} viewBox="0 0 48 30" aria-hidden>
        <text x="24" y="16" textAnchor="middle" fontSize="17" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif" fill="currentColor" letterSpacing="-0.5">
          aws
        </text>
        <path d="M8 21.5c9.5 5.6 22.5 5.6 31 0" fill="none" stroke="var(--aws)" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M35 19.2l4.6 1.8-1.7 4.4" fill="none" stroke="var(--aws)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (id === "gcp")
    return (
      <svg width={size * 1.25} height={size} viewBox="0 0 30 24" aria-hidden>
        <defs>
          <linearGradient id={`gcp-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#EA4335" />
            <stop offset=".3" stopColor="#EA4335" />
            <stop offset=".3" stopColor="#4285F4" />
            <stop offset=".6" stopColor="#4285F4" />
            <stop offset=".6" stopColor="#34A853" />
            <stop offset=".8" stopColor="#34A853" />
            <stop offset=".8" stopColor="#FBBC04" />
            <stop offset="1" stopColor="#FBBC04" />
          </linearGradient>
        </defs>
        <path
          d="M9 20.5h12.5a5.5 5.5 0 0 0 .9-10.9A7.5 7.5 0 0 0 8.3 8.4 6 6 0 0 0 9 20.5Z"
          fill="none"
          stroke={`url(#gcp-${uid})`}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id={`aza-${uid}`} x1="0" y1="1" x2=".6" y2="0">
          <stop offset="0" stopColor="#114A8B" />
          <stop offset="1" stopColor="#0669BC" />
        </linearGradient>
        <linearGradient id={`azb-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3CCBF4" />
          <stop offset="1" stopColor="#2892DF" />
        </linearGradient>
      </defs>
      <path d="M9.2 2.5h5.4L7 21.5H1.7a.6.6 0 0 1-.55-.8L8.6 3a.7.7 0 0 1 .6-.5Z" fill={`url(#aza-${uid})`} />
      <path d="M16.6 15.2H8.1l5.2 6.3h9.1a.6.6 0 0 0 .5-.8L15.8 3a.7.7 0 0 0-.6-.5h-.6l4.4 11.9Z" fill={`url(#azb-${uid})`} />
    </svg>
  );
}
