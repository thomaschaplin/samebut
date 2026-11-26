"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  CATEGORY_LABEL,
  MAPPINGS,
  PROVIDERS,
  type CategoryId,
  type Mapping,
  type ProviderId,
  type Service,
} from "@/content/services";
import { search } from "@/lib/search";
import { ProviderLogo } from "./ProviderLogo";

type Cat = CategoryId | "all";

const EXAMPLES = ["Lambda", "Cloud Run", "DynamoDB", "Cosmos DB", "BigQuery", "S3"];

export function Explorer() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("all");
  const [allDetails, setAllDetails] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const input = useRef<HTMLInputElement>(null);

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
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (cat !== "all") p.set("c", cat);
    const qs = p.toString();
    history.replaceState(null, "", `${location.pathname}${qs ? `?${qs}` : ""}${location.hash}`);
  }, [q, cat]);

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
          <Row
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

function Row({
  m,
  hits,
  expanded,
  onToggle,
  showCategory,
}: {
  m: Mapping;
  hits: ProviderId[];
  expanded: boolean;
  onToggle: () => void;
  showCategory: boolean;
}) {
  return (
    <article id={m.id} className="scroll-mt-64 overflow-hidden rounded-[var(--radius)] border border-line bg-surface">
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="font-semibold tracking-tight">
            <a href={`#${m.id}`} className="hover:underline hover:decoration-line-strong hover:underline-offset-4">
              {m.concept}
            </a>
          </h2>
          {showCategory && <span className="pill">{CATEGORY_LABEL[m.category]}</span>}
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={`${m.id}-cells`}
          className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-sm text-ink-2 transition hover:bg-surface-2 hover:text-ink"
        >
          Pros &amp; cons
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </header>

      <div id={`${m.id}-cells`} className="grid gap-px bg-line md:grid-cols-3">
        {PROVIDERS.map((p) => (
          <Cell key={p.id} provider={p} svc={m[p.id]} hit={hits.includes(p.id)} expanded={expanded} />
        ))}
      </div>

      {m.note && (
        <p className="flex gap-2.5 border-t border-line bg-surface-2/60 px-5 py-3 text-sm text-ink-2">
          <svg className="mt-0.5 shrink-0 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 7.5v.5" />
          </svg>
          <span>
            <span className="font-medium text-ink">Good to know: </span>
            {m.note}
          </span>
        </p>
      )}
    </article>
  );
}

function Cell({
  provider,
  svc,
  hit,
  expanded,
}: {
  provider: (typeof PROVIDERS)[number];
  svc: Service;
  hit: boolean;
  expanded: boolean;
}) {
  return (
    <div className={`relative bg-surface px-5 py-4 ${hit ? "match" : ""}`} data-provider={provider.id}>
      {/* Provider label: always on mobile (stacked), hidden on desktop where the sticky header shows it */}
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted md:hidden">
        <span className="text-ink">
          <ProviderLogo id={provider.id} size={16} />
        </span>
        {provider.name}
      </div>
      {hit && <span className="absolute top-3 right-3 rounded-full bg-[var(--match)] px-2 py-0.5 text-[11px] font-medium text-[var(--match-ink)]">Match</span>}

      <h3 className={`font-semibold tracking-tight ${svc.none ? "text-muted italic" : ""} ${hit ? "pr-14" : ""}`}>{svc.name}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-2">{svc.desc}</p>

      {expanded && !svc.none && (
        <div className="mt-4 space-y-3 text-sm">
          <List kind="pro" items={svc.pros ?? []} />
          <List kind="con" items={svc.cons ?? []} />
        </div>
      )}
    </div>
  );
}

function List({ kind, items }: { kind: "pro" | "con"; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium tracking-wide text-muted uppercase">{kind === "pro" ? "Pros" : "Cons"}</p>
      <ul className="space-y-1.5">
        {items.map((t) => (
          <li key={t} className="flex gap-2 text-ink-2">
            <span className={`mt-[3px] grid size-4 shrink-0 place-items-center rounded-full text-[11px] leading-none font-bold ${kind === "pro" ? "bg-ok-soft text-ok" : "bg-err-soft text-err"}`} aria-hidden>
              {kind === "pro" ? "+" : "−"}
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
