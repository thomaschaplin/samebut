import { SITE_NAME } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <Logo />
          <span>{SITE_NAME}</span>
        </a>
        <nav className="flex items-center gap-1 text-sm text-ink-2">
          <a
            href="https://github.com/thomaschaplin"
            className="rounded-full px-3 py-1.5 transition hover:bg-surface-2 hover:text-ink"
          >
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <rect x="1" y="4" width="5.5" height="14" rx="2" fill="var(--aws)" />
      <rect x="8.25" y="4" width="5.5" height="14" rx="2" fill="var(--gcp)" />
      <rect x="15.5" y="4" width="5.5" height="14" rx="2" fill="var(--azure)" />
    </svg>
  );
}
