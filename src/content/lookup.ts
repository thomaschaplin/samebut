import { MAPPINGS, PROVIDERS, type Mapping } from "./services";

export const getMapping = (id: string) => MAPPINGS.find((m) => m.id === id);

const label = (m: Mapping, p: (typeof PROVIDERS)[number]["id"]) => (m[p].none ? null : m[p].name);

/** "AWS Lambda vs Cloud Run functions vs Azure Functions" (skips providers with no equivalent). */
export function versusTitle(m: Mapping) {
  return PROVIDERS.map((p) => label(m, p.id)).filter(Boolean).join(" vs ");
}
