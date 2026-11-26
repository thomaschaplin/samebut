import { MAPPINGS, PROVIDERS, type Mapping } from "./services";

export const getMapping = (id: string) => MAPPINGS.find((m) => m.id === id);

const label = (m: Mapping, p: (typeof PROVIDERS)[number]["id"]) => (m[p].none ? null : m[p].name);

/** "AWS Lambda vs Cloud Run functions vs Azure Functions" (skips providers with no equivalent). */
export function versusTitle(m: Mapping) {
  return PROVIDERS.map((p) => label(m, p.id)).filter(Boolean).join(" vs ");
}

/** Plain-English answers, used on the page and as FAQ structured data. */
export function quickAnswers(m: Mapping) {
  const out: { q: string; a: string }[] = [];
  for (const from of PROVIDERS) {
    const name = label(m, from.id);
    if (!name) continue;
    const others = PROVIDERS.filter((p) => p.id !== from.id);
    for (const to of others) {
      const svc = m[to.id];
      out.push({
        q: `What is the ${to.name} equivalent of ${name}?`,
        a: svc.none
          ? `${to.name} has no direct equivalent of ${name}. ${svc.desc}`
          : `The closest ${to.name} equivalent of ${name} is ${svc.name}. ${svc.desc}`,
      });
    }
  }
  return out;
}
