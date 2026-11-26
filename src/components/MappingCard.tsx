import { ICONS } from "@/content/icons";
import { CATEGORY_LABEL, PROVIDERS, type Mapping, type ProviderId, type Service } from "@/content/services";
import { ProviderLogo } from "./ProviderLogo";

export function MappingCard({
  m,
  hits,
  expanded,
  onToggle,
  showCategory,
  labels = false,
}: {
  m: Mapping;
  hits: ProviderId[];
  expanded: boolean;
  onToggle?: () => void;
  showCategory?: boolean;
  /** Always show the provider name above each cell (pages without the sticky column header). */
  labels?: boolean;
}) {
  return (
    <article id={m.id} className="scroll-mt-64 overflow-hidden rounded-[var(--radius)] border border-line bg-surface">
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="font-semibold tracking-tight">
            <a href={`/${m.id}`} className="hover:underline hover:decoration-line-strong hover:underline-offset-4">
              {m.concept}
            </a>
          </h2>
          {showCategory && <span className="pill">{CATEGORY_LABEL[m.category]}</span>}
        </div>
        {onToggle && (
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
        )}
      </header>

      <div id={`${m.id}-cells`} className="grid gap-px bg-line md:grid-cols-3">
        {PROVIDERS.map((p) => (
          <Cell key={p.id} id={m.id} provider={p} svc={m[p.id]} hit={hits.includes(p.id)} expanded={expanded} labels={labels} />
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
  id,
  provider,
  svc,
  hit,
  expanded,
  labels,
}: {
  id: string;
  provider: (typeof PROVIDERS)[number];
  svc: Service;
  hit: boolean;
  expanded: boolean;
  labels: boolean;
}) {
  return (
    <div className={`relative bg-surface px-5 py-4 ${hit ? "match" : ""}`} data-provider={provider.id}>
      {/* Provider label: always on mobile (stacked), hidden on desktop where the sticky header shows it */}
      <div className={`mb-3 flex items-center gap-2 text-xs font-medium text-muted ${labels ? "" : "md:hidden"}`}>
        <span className="text-ink">
          <ProviderLogo id={provider.id} size={16} />
        </span>
        {provider.name}
      </div>
      {hit && <span className="absolute top-3 right-3 rounded-full bg-[var(--match)] px-2 py-0.5 text-[11px] font-medium text-[var(--match-ink)]">Match</span>}

      <div className={`flex items-center gap-3 ${hit ? "pr-14" : ""}`}>
        {!svc.none && <ServiceIcon id={id} provider={provider.id} />}
        <h3 className={`font-semibold leading-snug tracking-tight ${svc.none ? "text-muted italic" : ""}`}>{svc.name}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{svc.desc}</p>

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

/** The provider's official service icon, or the provider logo when the pack has no fitting icon. */
function ServiceIcon({ id, provider }: { id: string; provider: ProviderId }) {
  if (ICONS[id]?.includes(provider))
    return <img src={`/icons/${provider}/${id}.svg`} alt="" width={32} height={32} loading="lazy" className="size-8 shrink-0" />;
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-ink">
      <ProviderLogo id={provider} size={14} />
    </span>
  );
}
