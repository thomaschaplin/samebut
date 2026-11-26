import type { MetadataRoute } from "next";
import { MAPPINGS } from "@/content/services";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/compare`, changeFrequency: "monthly", priority: 0.7 },
    ...MAPPINGS.map((m) => ({ url: `${siteUrl}/${m.id}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
