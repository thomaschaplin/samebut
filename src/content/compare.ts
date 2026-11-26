import { MAPPINGS, PROVIDERS, type Mapping, type ProviderId, type Service } from "./services";

/** One pickable service: a provider's cell in a mapping. Keyed "aws:functions". */
export type Pick = { key: string; provider: (typeof PROVIDERS)[number]; mapping: Mapping; svc: Service };

export const PICKS: Pick[] = MAPPINGS.flatMap((mapping) =>
  PROVIDERS.filter((p) => !mapping[p.id].none).map((provider) => ({
    key: `${provider.id}:${mapping.id}`,
    provider,
    mapping,
    svc: mapping[provider.id],
  })),
);

const BY_KEY = new Map(PICKS.map((p) => [p.key, p]));
export const getPick = (key: string | null | undefined) => (key ? BY_KEY.get(key) : undefined);
export const pickKey = (provider: ProviderId, mappingId: string) => `${provider}:${mappingId}`;

/** Popular pairings shown as one-click starting points. */
export const SUGGESTED: [string, string][] = [
  ["aws:functions", "gcp:functions"],
  ["aws:serverless-containers", "gcp:serverless-containers"],
  ["aws:key-value", "azure:key-value"],
  ["aws:kubernetes", "gcp:kubernetes"],
  ["gcp:data-warehouse", "aws:data-warehouse"],
  ["aws:genai", "azure:genai"],
];

export const DEFAULT_PAIR: [string, string] = ["aws:functions", "gcp:functions"];

/**
 * Link to /compare for a mapping: starts from `from` (e.g. the provider the user
 * searched for) when it has the service, paired with the next provider that does.
 * Null when fewer than two providers have it.
 */
export function compareHref(m: Mapping, from?: ProviderId) {
  const have = PROVIDERS.map((p) => p.id).filter((p) => !m[p].none);
  if (have.length < 2) return null;
  const first = from && have.includes(from) ? from : have[0];
  const second = have.find((p) => p !== first)!;
  return `/compare?a=${first}:${m.id}&b=${second}:${m.id}`;
}
