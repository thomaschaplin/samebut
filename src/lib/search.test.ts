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

import { existsSync } from "node:fs";
import { ICONS } from "@/content/icons";

describe("icons", () => {
  it("covers every mapping, and every listed icon exists", () => {
    for (const m of MAPPINGS) {
      expect(ICONS[m.id], m.id).toBeDefined();
      for (const p of ICONS[m.id]) {
        expect(m[p as "aws"].none, `${m.id}/${p} has an icon but no service`).not.toBe(true);
        expect(existsSync(`public/icons/${p}/${m.id}.svg`), `${m.id}/${p}`).toBe(true);
      }
    }
  });
});

import { readFileSync } from "node:fs";
import { lockupSvg, markSvg } from "@/lib/logo";

describe("logo files", () => {
  it("match src/lib/logo.ts (run `node scripts/logo.ts` after changing it)", () => {
    expect(readFileSync("src/app/icon.svg", "utf8").trim()).toBe(markSvg({ tile: true }));
    expect(readFileSync("public/logo.svg", "utf8").trim()).toBe(markSvg({ size: 128 }));
    expect(readFileSync("public/logo-light.svg", "utf8").trim()).toBe(lockupSvg("light"));
    expect(readFileSync("public/logo-dark.svg", "utf8").trim()).toBe(lockupSvg("dark"));
  });
});

describe("alias matching", () => {
  it("doesn't match short aliases inside other words", () => {
    const ids = search(MAPPINGS, "rabbitmq").map((r) => r.mapping.id);
    expect(ids[0]).toBe("rabbitmq");
    expect(ids).not.toContain("bi");
  });

  it("finds the second wave of services", () => {
    expect(search(MAPPINGS, "cloud scheduler")[0].mapping.id).toBe("scheduler");
    expect(search(MAPPINGS, "sentinel")[0].mapping.id).toBe("siem");
    expect(search(MAPPINGS, "nat gateway")[0].mapping.id).toBe("nat");
  });
});

import { DEFAULT_PAIR, getPick, PICKS, SUGGESTED } from "@/content/compare";

describe("compare", () => {
  it("has a pick for every real service and valid suggestions", () => {
    const real = MAPPINGS.reduce((n, m) => n + PROVIDERS.filter((p) => !m[p.id].none).length, 0);
    expect(PICKS.length).toBe(real);
    for (const k of [...DEFAULT_PAIR, ...SUGGESTED.flat()]) expect(getPick(k), k).toBeDefined();
  });

  it("no mapping id collides with a fixed route", () => {
    for (const reserved of ["compare", "icons", "sitemap.xml", "robots.txt"]) expect(MAPPINGS.some((m) => m.id === reserved)).toBe(false);
  });
});
