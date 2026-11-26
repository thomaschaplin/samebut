import { Explorer } from "@/components/Explorer";
import { MAPPINGS } from "@/content/services";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: siteUrl,
  description: SITE_DESCRIPTION,
  potentialAction: { "@type": "SearchAction", target: `${siteUrl}/?q={search_term_string}`, "query-input": "required name=search_term_string" },
  hasPart: MAPPINGS.map((m) => ({ "@type": "WebPage", name: m.concept, url: `${siteUrl}/${m.id}` })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Explorer />
    </>
  );
}
