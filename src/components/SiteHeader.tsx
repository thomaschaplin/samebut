import { LogoMark, Wordmark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2" aria-label="samebut home">
          <LogoMark size={28} />
          <Wordmark />
        </a>
        <nav className="flex items-center gap-1 text-sm text-ink-2">
          <a href="/compare" className="rounded-full px-3 py-1.5 transition hover:bg-surface-2 hover:text-ink">
            Compare
          </a>
          <a
            href="https://github.com/thomaschaplin/samebut"
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
