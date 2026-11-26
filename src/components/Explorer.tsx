"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, CATEGORY_LABEL, MAPPINGS, PROVIDERS, type CategoryId } from "@/content/services";
import { search } from "@/lib/search";
import { MappingCard } from "./MappingCard";
import { ProviderLogo } from "./ProviderLogo";

type Cat = CategoryId | "all";

const EXAMPLES = ["Lambda", "Cloud Run", "DynamoDB", "Cosmos DB", "BigQuery", "S3"];

export function Explorer() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("all");
  const [allDetails, setAllDetails] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const input = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);

  // Read ?q= and ?c= once on load so searches can be shared as links.
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const qp = p.get("q");
    const cp = p.get("c");
    if (qp) setQ(qp);
    if (cp && CATEGORIES.some((c) => c.id === cp)) setCat(cp as CategoryId);
    const hash = location.hash.slice(1);
    if (hash && MAPPINGS.some((m) => m.id === hash)) {
      setOpen(new Set([hash]));
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: "start" }));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (cat !== "all") p.set("c", cat);
    const qs = p.toString();
    history.replaceState(null, "", `${location.pathname}${qs ? `?${qs}` : ""}${location.hash}`);
  }, [q, cat, ready]);

  // "/" focuses search, Escape clears it.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        input.current?.focus();
      }
    }
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  // On phones the chip row scrolls sideways: keep the selected chip in view.
  useEffect(() => {
    const chip = document.querySelector<HTMLElement>("[data-active-chip]");
    const row = chip?.parentElement;
    if (chip && row && row.scrollWidth > row.clientWidth)
    {
      const offset = chip.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft;
      row.scrollTo({ left: offset - row.clientWidth / 2 + chip.clientWidth / 2, behavior: ready ? "smooth" : "auto" });
    }
  }, [cat, ready]);

  const results = useMemo(() => search(MAPPINGS, q, cat), [q, cat]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0 };
    for (const r of search(MAPPINGS, q, "all")) {
      c.all++;
      c[r.mapping.category] = (c[r.mapping.category] ?? 0) + 1;
    }
    return c;
  }, [q]);

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="pt-12 pb-8 sm:pt-16">
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Know one cloud? <span className="text-muted">Find the other two.</span>
        </h1>
        <p className="mt-4 max-w-xl text-ink-2 text-pretty">
          Every major service on AWS, Google Cloud and Azure, lined up side by side. Search for the one you know and see
          what it&rsquo;s called everywhere else, with what each is good and bad at.
        </p>
      </section>

      {/* Toolbar */}
      <div className="sticky top-14 z-20 -mx-4 border-b border-line bg-bg/90 px-4 pt-3 pb-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <label className="relative flex-1">
            <span className="sr-only">Search services</span>
            <svg
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
              width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              ref={input}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQ("")}
              placeholder="Search: Lambda, Cloud Run, Cosmos DB…"
              className="h-11 w-full rounded-full border border-line-strong bg-surface pr-12 pl-10 text-[15px] outline-none transition placeholder:text-muted focus:border-ink-2"
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className="pointer-events-none absolute top-1/2 right-3.5 hidden -translate-y-1/2 rounded-md border border-line px-1.5 font-mono text-xs text-muted sm:block">
              /
            </kbd>
          </label>
          <button
            type="button"
            onClick={() => setAllDetails((v) => !v)}
            aria-pressed={allDetails}
            className={`h-11 shrink-0 rounded-full border px-3.5 text-sm font-medium transition sm:px-4 ${
              allDetails ? "border-ink bg-ink text-bg" : "border-line-strong bg-surface text-ink-2 hover:text-ink"
            }`}
          >
            <span className="sm:hidden">Pros &amp; cons</span>
            <span className="hidden sm:inline">{allDetails ? "Hide" : "Show"} all pros &amp; cons</span>
          </button>
        </div>

        <div className="-mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <Chip active={cat === "all"} onClick={() => setCat("all")} label="All" count={counts.all} />
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} label={c.label} count={counts[c.id] ?? 0} />
          ))}
        </div>

        {/* Column headers: AWS · Google Cloud · Azure */}
        <div className="mt-3 hidden grid-cols-3 gap-px px-px md:grid" aria-hidden>
          {PROVIDERS.map((p) => (
            <div key={p.id} className="flex items-center gap-2.5 px-5 text-sm font-medium text-ink-2">
              <span className="grid h-6 place-items-center text-ink">
                <ProviderLogo id={p.id} size={20} />
              </span>
              {p.name}
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      <section className="mt-6 space-y-4" aria-live="polite">
        <p className="text-sm text-muted">
          {results.length === MAPPINGS.length
            ? `${MAPPINGS.length} services, mapped across three clouds`
            : `${results.length} of ${MAPPINGS.length} services`}
        </p>

        {results.length === 0 && (
          <div className="rounded-[var(--radius)] border border-dashed border-line-strong px-6 py-12 text-center">
            <p className="font-medium">Nothing matches &ldquo;{q}&rdquo;{cat !== "all" && ` in ${CATEGORY_LABEL[cat]}`}.</p>
            <p className="mt-2 text-sm text-ink-2">Try one of these:</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    setQ(e);
                    setCat("all");
                  }}
                  className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink-2 transition hover:text-ink"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}

        {results.map(({ mapping, hits }) => (
          <MappingCard
            key={mapping.id}
            m={mapping}
            hits={hits}
            expanded={allDetails || open.has(mapping.id)}
            onToggle={() => toggle(mapping.id)}
            showCategory={cat === "all"}
          />
        ))}
      </section>
    </div>
  );
}

function Chip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-active-chip={active || undefined}
      disabled={!count && !active}
      className={`shrink-0 rounded-full border px-3 py-1 text-sm whitespace-nowrap transition disabled:opacity-40 ${
        active ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink"
      }`}
    >
      {label}
      <span className={`ml-1.5 tabular-nums ${active ? "opacity-70" : "text-muted"}`}>{count}</span>
    </button>
  );
}
