import { CompareIcon } from "./CompareIcon";
import { LogoMark, Wordmark } from "./Logo";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2" aria-label="samebut home">
          <LogoMark size={28} />
          <Wordmark />
        </a>
        <nav className="flex items-center gap-0.5 text-sm text-ink-2 sm:gap-1">
          <a href="/compare" aria-label="Compare" className="flex items-center rounded-full px-2 py-1.5 transition hover:bg-surface-2 hover:text-ink sm:px-3">
            <CompareIcon size={18} className="min-[370px]:hidden" />
            <span className="hidden min-[370px]:inline">Compare</span>
          </a>
          <a
            href="https://github.com/thomaschaplin/samebut"
            aria-label="GitHub"
            className="flex items-center rounded-full px-2 py-1.5 transition hover:bg-surface-2 hover:text-ink sm:px-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="min-[370px]:hidden">
              <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            <span className="hidden min-[370px]:inline">GitHub</span>
          </a>
          <ThemeToggle />
          <MobileNav />
        </nav>
      </div>
    </header>
  );
}
