/** A panel split down the middle with "text" on each side: two things, side by side. */
export function CompareIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <path d="M12 4v16M5.5 9h3.5M5.5 12.5h3.5M15 9h3.5M15 12.5h3.5" />
    </svg>
  );
}
