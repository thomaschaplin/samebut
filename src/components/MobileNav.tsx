"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CATEGORIES, MAPPINGS } from "@/content/services";

const COUNTS = MAPPINGS.reduce<Record<string, number>>((acc, m) => ((acc[m.category] = (acc[m.category] ?? 0) + 1), acc), {});

/**
 * Phone-sized menu: site links plus every category. Rendered into <body> via a
 * portal because the header's backdrop-filter would otherwise trap a fixed panel
 * inside the header box.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<{ path: string; cat: string | null }>({ path: "", cat: null });

  useEffect(() => {
    if (!open) return;
    setCurrent({ path: location.pathname, cat: new URLSearchParams(location.search).get("c") });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => matchMedia("(min-width: 768px)").matches && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    addEventListener("keydown", onKey);
    addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      removeEventListener("keydown", onKey);
      removeEventListener("resize", onResize);
    };
  }, [open]);

  const onHome = current.path === "/";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid size-9 place-items-center rounded-full text-ink-2 transition hover:bg-surface-2 hover:text-ink md:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open &&
        createPortal(
          <nav
            id="mobile-nav"
            aria-label="Site"
            className="fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto border-t border-line bg-bg px-4 pt-4 pb-10 md:hidden"
          >
            <ul className="space-y-1">
              <NavItem href="/" active={onHome && !current.cat} onClick={() => setOpen(false)}>
                All services <span className="text-muted tabular-nums">{MAPPINGS.length}</span>
              </NavItem>
              <NavItem href="/compare" active={current.path === "/compare"} onClick={() => setOpen(false)}>
                Compare side by side
              </NavItem>
              <NavItem href="https://github.com/thomaschaplin/samebut" onClick={() => setOpen(false)}>
                GitHub
              </NavItem>
            </ul>

            <p className="mt-6 mb-2 px-3 text-xs font-medium tracking-wide text-muted uppercase">Categories</p>
            <ul className="space-y-1">
              {CATEGORIES.map((c) => (
                <NavItem key={c.id} href={`/?c=${c.id}`} active={onHome && current.cat === c.id} onClick={() => setOpen(false)}>
                  {c.label} <span className="text-muted tabular-nums">{COUNTS[c.id] ?? 0}</span>
                </NavItem>
              ))}
            </ul>
          </nav>,
          document.body,
        )}
    </>
  );
}

function NavItem({ href, active, onClick, children }: { href: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className={`flex items-center justify-between rounded-xl px-3 py-3 text-[15px] transition ${
          active ? "bg-surface-2 font-medium text-ink" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
        }`}
      >
        {children}
      </a>
    </li>
  );
}
