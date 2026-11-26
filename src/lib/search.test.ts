import { describe, expect, it } from "vitest";
import { CATEGORIES, MAPPINGS, PROVIDERS } from "@/content/services";
import { search } from "./search";

describe("content", () => {
  it("has unique ids and valid categories", () => {
    const ids = MAPPINGS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    const cats = new Set(CATEGORIES.map((c) => c.id));
    for (const m of MAPPINGS) expect(cats.has(m.category)).toBe(true);
  });

  it("gives every real service a description and pros/cons", () => {
    for (const m of MAPPINGS)
      for (const p of PROVIDERS) {
        const svc = m[p.id];
        expect(svc.desc.length, `${m.id}/${p.id}`).toBeGreaterThan(10);
        if (!svc.none) {
          expect(svc.pros?.length, `${m.id}/${p.id} pros`).toBeGreaterThan(0);
          expect(svc.cons?.length, `${m.id}/${p.id} cons`).toBeGreaterThan(0);
        }
      }
  });
});

describe("search", () => {
  it("finds Cloud Run and flags the GCP cell", () => {
    const [top] = search(MAPPINGS, "cloud run");
    expect(top.mapping.id).toBe("serverless-containers");
    expect(top.hits).toContain("gcp");
  });

  it("maps Lambda to functions", () => {
    expect(search(MAPPINGS, "lambda")[0].mapping.id).toBe("functions");
  });

  it("finds by alias", () => {
    expect(search(MAPPINGS, "k8s")[0].mapping.id).toBe("kubernetes");
    expect(search(MAPPINGS, "s3")[0].mapping.id).toBe("object-storage");
  });

  it("filters by category", () => {
    const r = search(MAPPINGS, "", "database");
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((x) => x.mapping.category === "database")).toBe(true);
  });
});

describe("search precision", () => {
  it("doesn't pad strong matches with loose ones", () => {
    const ids = search(MAPPINGS, "cloud run").map((r) => r.mapping.id);
    expect(ids).toEqual(expect.arrayContaining(["serverless-containers", "functions"]));
    expect(ids.length).toBeLessThanOrEqual(3);
  });
});
