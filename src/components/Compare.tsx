"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { DEFAULT_PAIR, getPick, PICKS, pickKey, SUGGESTED, type Pick } from "@/content/compare";
import { CATEGORY_LABEL, PROVIDERS } from "@/content/services";
import { normalise } from "@/lib/search";
import { List, ServiceIcon } from "./MappingCard";
import { ProviderLogo } from "./ProviderLogo";

export function Compare() {
  const [a, setA] = useState(DEFAULT_PAIR[0]);
  const [b, setB] = useState(DEFAULT_PAIR[1]);

  const [ready, setReady] = useState(false);

  // Read ?a= and ?b= once so comparisons can be shared as links. The URL is only
  // written after this has run, so the defaults never overwrite a shared link.
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (getPick(p.get("a"))) setA(p.get("a")!);
    if (getPick(p.get("b"))) setB(p.get("b")!);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) history.replaceState(null, "", `${location.pathname}?a=${a}&b=${b}`);
  }, [a, b, ready]);

  const left = getPick(a)!;
  const right = getPick(b)!;
  const same = left.mapping.id === right.mapping.id;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="pt-12 pb-8 sm:pt-16">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Compare <span className="text-muted">side by side.</span>
        </h1>
        <p className="mt-4 max-w-xl text-ink-2 text-pretty">
          Pick any two services from any cloud. Direct equivalents or near neighbours, see what each does and where it&rsquo;s
          strong or weak.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Try:</span>
          {SUGGESTED.map(([x, y]) => (
            <button
              key={`${x}|${y}`}
              type="button"
              onClick={() => {
                setA(x);
                setB(y);
              }}
              className="rounded-full border border-line bg-surface px-3 py-1 text-ink-2 transition hover:border-line-strong hover:text-ink"
            >
              {shortName(getPick(x)!)} vs {shortName(getPick(y)!)}
            </button>
          ))}
        </div>
      </section>

      <div className="grid items-start gap-4 md:grid-cols-[1fr_auto_1fr]">
        <Picker value={a} onChange={setA} label="First service" />
        <button
          type="button"
          onClick={() => {
            setA(b);
            setB(a);
          }}
          aria-label="Swap the two services"
          className="mx-auto grid size-10 place-items-center rounded-full border border-line-strong bg-surface text-ink-2 transition hover:text-ink md:mt-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="rotate-90 md:rotate-0">
            <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
          </svg>
        </button>
        <Picker value={b} onChange={setB} label="Second service" />
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm text-ink-2">
        <span className="pill" style={{ ["--dot" as string]: same ? "var(--ok)" : "var(--muted)" }}>
          {same ? "Direct equivalents" : "Different services"}
        </span>
        {same ? (
          <span>
            Both are the {left.provider.name === right.provider.name ? "same" : "closest"} answer for{" "}
            <a href={`/${left.mapping.id}`} className="font-medium text-ink underline decoration-line-strong underline-offset-4">
              {left.mapping.concept.toLowerCase()}
            </a>
            .
          </span>
        ) : (
          <span>
            {left.mapping.concept} vs {right.mapping.concept.toLowerCase()}. They solve different problems, so read the trade-offs
            with that in mind.
          </span>
        )}
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Side pick={left} onPick={setA} />
        <Side pick={right} onPick={setB} showNote={!same} />
      </div>
    </div>
  );
}

const shortName = (p: Pick) => p.svc.name.replace(/^(Amazon|AWS|Azure|Google Cloud|Microsoft) /, "").replace(/ \(.*\)$/, "");

function Side({ pick, onPick, showNote = true }: { pick: Pick; onPick: (key: string) => void; showNote?: boolean }) {
  const { mapping: m, provider, svc } = pick;
  const others = PROVIDERS.filter((p) => p.id !== provider.id);
  return (
    <article className="overflow-hidden rounded-[var(--radius)] border border-line bg-surface">
      <header className="flex items-start gap-4 border-b border-line px-5 py-5">
        <ServiceIcon id={m.id} provider={provider.id} size={48} />
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-medium text-muted">
            <span className="text-ink">
              <ProviderLogo id={provider.id} size={14} />
            </span>
            {provider.name}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{svc.name}</h2>
          <p className="mt-1 text-sm text-muted">
            <a href={`/${m.id}`} className="transition hover:text-ink">
              {m.concept}
            </a>{" "}
            · {CATEGORY_LABEL[m.category]}
          </p>
        </div>
      </header>

      <div className="space-y-5 px-5 py-5">
        <p className="leading-relaxed text-ink-2">{svc.desc}</p>
        <div className="grid gap-5 text-sm sm:grid-cols-2">
          <List kind="pro" items={svc.pros ?? []} />
          <List kind="con" items={svc.cons ?? []} />
        </div>
        {showNote && m.note && (
          <p className="rounded-xl bg-surface-2 px-4 py-3 text-sm text-ink-2">
            <span className="font-medium text-ink">Good to know: </span>
            {m.note}
          </p>
        )}
      </div>

      <footer className="border-t border-line px-5 py-4 text-sm">
        <p className="mb-2 text-xs font-medium tracking-wide text-muted uppercase">On other clouds</p>
        <ul className="space-y-1.5">
          {others.map((p) => {
            const other = m[p.id];
            return (
              <li key={p.id} className="flex items-center gap-2">
                <span className="w-24 shrink-0 text-muted">{p.name}</span>
                {other.none ? (
                  <span className="text-muted italic">No direct equivalent</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onPick(pickKey(p.id, m.id))}
                    className="truncate text-left text-ink-2 underline decoration-line-strong underline-offset-4 transition hover:text-ink"
                  >
                    {other.name}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </footer>
    </article>
  );
}

/** A searchable list of every service on every cloud. */
function Picker({ value, onChange, label }: { value: string; onChange: (key: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const current = getPick(value)!;

  const options = useMemo(() => {
    const n = normalise(q);
    if (!n) return PICKS;
    const terms = n.split(" ");
    return PICKS.filter((p) => {
      const hay = normalise([p.svc.name, p.provider.name, p.provider.id, p.mapping.concept, ...(p.mapping.aliases ?? [])].join(" "));
      return terms.every((t) => hay.includes(t));
    }).sort((x, y) => Number(normalise(y.svc.name).includes(n)) - Number(normalise(x.svc.name).includes(n)));
  }, [q]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function choose(p: Pick) {
    onChange(p.key);
    setOpen(false);
    setQ("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && options[active]) {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={root} className="relative">
      <p className="mb-1.5 text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
      {open ? (
        <input
          autoFocus
          role="combobox"
          aria-expanded
          aria-controls={`${id}-list`}
          aria-activedescendant={options[active] ? `${id}-${active}` : undefined}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search any service on any cloud…"
          className="h-14 w-full rounded-2xl border border-ink-2 bg-surface px-4 text-[15px] outline-none placeholder:text-muted"
          autoComplete="off"
          spellCheck={false}
        />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="listbox"
          className="flex h-14 w-full items-center gap-3 rounded-2xl border border-line-strong bg-surface px-4 text-left transition hover:border-ink-2"
        >
          <ServiceIcon id={current.mapping.id} provider={current.provider.id} size={28} />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{current.svc.name}</span>
            <span className="block truncate text-xs text-muted">{current.provider.name}</span>
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden className="text-muted">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-line-strong bg-surface p-1.5 shadow-xl"
        >
          {options.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No services match &ldquo;{q}&rdquo;</li>}
          {options.map((p, i) => (
            <li
              key={p.key}
              id={`${id}-${i}`}
              data-index={i}
              role="option"
              aria-selected={p.key === value}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(p)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 ${i === active ? "bg-surface-2" : ""}`}
            >
              <ServiceIcon id={p.mapping.id} provider={p.provider.id} size={24} eager />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{p.svc.name}</span>
                <span className="block truncate text-xs text-muted">
                  {p.provider.name} · {p.mapping.concept}
                </span>
              </span>
              {p.key === value && <span className="text-xs text-muted">Selected</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
