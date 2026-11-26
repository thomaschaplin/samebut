import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MappingCard } from "@/components/MappingCard";
import { getMapping, quickAnswers, versusTitle } from "@/content/lookup";
import { CATEGORY_LABEL, MAPPINGS } from "@/content/services";
import { SITE_NAME, siteUrl } from "@/lib/site";

export const dynamicParams = false;

/** Link to /compare with the first two providers that have this service. */
function compareHref(m: NonNullable<ReturnType<typeof getMapping>>) {
  const have = (["aws", "gcp", "azure"] as const).filter((p) => !m[p].none);
  return have.length >= 2 ? `/compare?a=${have[0]}:${m.id}&b=${have[1]}:${m.id}` : null;
}

export function generateStaticParams() {
  return MAPPINGS.map((m) => ({ id: m.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = getMapping((await params).id);
  if (!m) return {};
  const title = versusTitle(m);
  const description = `${m.concept} on AWS, Google Cloud and Azure: ${title}. What each one is, how they differ, and the pros and cons of each.`;
  return {
    title,
    description,
    alternates: { canonical: `/${m.id}` },
    openGraph: { title: `${title} · ${SITE_NAME}`, description, url: `/${m.id}`, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: Props) {
  const m = getMapping((await params).id);
  if (!m) notFound();

  const answers = quickAnswers(m);
  const related = MAPPINGS.filter((x) => x.category === m.category && x.id !== m.id);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: answers.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: siteUrl },
        { "@type": "ListItem", position: 2, name: CATEGORY_LABEL[m.category], item: `${siteUrl}/?c=${m.category}` },
        { "@type": "ListItem", position: 3, name: m.concept, item: `${siteUrl}/${m.id}` },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className="pt-10 text-sm text-muted">
        <a href="/" className="transition hover:text-ink">All services</a>
        <span className="mx-2">/</span>
        <a href={`/?c=${m.category}`} className="transition hover:text-ink">{CATEGORY_LABEL[m.category]}</a>
      </nav>

      <header className="pt-4 pb-8">
        <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{versusTitle(m)}</h1>
        <p className="mt-3 max-w-2xl text-ink-2 text-pretty">
          {m.concept} across the three big clouds: what each one is called, what it does, and where it&rsquo;s strong or weak.
        </p>
      </header>

      <MappingCard m={m} hits={[]} expanded labels />

      {compareHref(m) && (
        <p className="mt-4 text-sm">
          <a href={compareHref(m)!} className="text-ink-2 underline decoration-line-strong underline-offset-4 transition hover:text-ink">
            Compare two of these side by side →
          </a>
        </p>
      )}

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">Quick answers</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2">
          {answers.map((x) => (
            <div key={x.q}>
              <dt className="font-medium">{x.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-2">{x.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight">More in {CATEGORY_LABEL[m.category]}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.id}>
                <a href={`/${r.id}`} className="block rounded-xl border border-line bg-surface px-4 py-3 transition hover:border-line-strong">
                  <span className="block font-medium">{r.concept}</span>
                  <span className="mt-0.5 block truncate text-sm text-muted">{versusTitle(r)}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
