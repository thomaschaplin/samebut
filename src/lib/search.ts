import { CATEGORY_LABEL, type CategoryId, type Mapping, type ProviderId } from "@/content/services";

export function normalise(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
}

export type Match = { mapping: Mapping; score: number; hits: ProviderId[] };

const PROVIDER_IDS: ProviderId[] = ["aws", "gcp", "azure"];

/**
 * Ranks mappings against a query. A service-name hit scores highest and marks
 * which provider cell matched, so the UI can highlight "the one you typed".
 */
export function search(mappings: Mapping[], query: string, category: CategoryId | "all" = "all"): Match[] {
  const q = normalise(query);
  const terms = q ? q.split(" ") : [];
  const out: Match[] = [];

  for (const m of mappings) {
    if (category !== "all" && m.category !== category) continue;
    if (!terms.length) {
      out.push({ mapping: m, score: 0, hits: [] });
      continue;
    }

    const hits: ProviderId[] = [];
    let score = 0;
    for (const p of PROVIDER_IDS) {
      const name = normalise(m[p].none ? "" : m[p].name);
      if (!name) continue;
      if (name === q || name.replace(/^(amazon|aws|azure|google|microsoft) /, "") === q) {
        score += 100;
        hits.push(p);
      } else if (name.includes(q)) {
        score += 60;
        hits.push(p);
      }
    }

    const concept = normalise(m.concept);
    const aliases = (m.aliases ?? []).map(normalise);
    if (concept.includes(q)) score += 50;
    if (aliases.some((a) => a === q)) score += 45;
    else if (aliases.some((a) => a.includes(q) || q.includes(a))) score += 25;

    // Fallback: every term appears somewhere in the row's text.
    if (score === 0) {
      const hay = normalise(
        [m.concept, CATEGORY_LABEL[m.category], ...(m.aliases ?? []), m.note ?? "",
          ...PROVIDER_IDS.flatMap((p) => [m[p].name, m[p].desc])].join(" "),
      );
      if (terms.every((t) => hay.includes(t))) score = 10;
    }

    if (score > 0) out.push({ mapping: m, score, hits });
  }

  out.sort((a, b) => b.score - a.score);
  // If anything matched by name, concept or alias, drop the loose text-only matches.
  return out.length && out[0].score > 10 ? out.filter((r) => r.score > 10) : out;
}
