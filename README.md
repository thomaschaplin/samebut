# samebut: same service, different cloud

Know one cloud? Find the other two. Every common cloud service is shown in three columns, always in the order **AWS · Google Cloud · Azure**. Each one has a short description, pros and cons, and a "good to know" note where the services differ in ways that matter.

- Search by any provider's service name ("Cloud Run", "Cosmos DB", "Lambda") or by an alias ("k8s", "s3", "redis"). The cell you searched for is highlighted.
- Filter by category, expand pros and cons per row or for all rows, and switch between light and dark themes.
- Searches can be shared: `?q=cloud+run&c=serverless`.
- Every mapping also has its own page (e.g. `/serverless-containers`) titled "X vs Y vs Z", with quick answers ("What is the Azure equivalent of Cloud Run?"), FAQ and breadcrumb structured data, and its own social share image.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # content checks and search tests
npm run build   # static production build
```

## Editing content

Everything lives in [`src/content/services.ts`](src/content/services.ts). Add a row to `MAPPINGS`. Use `none("…")` when a provider has no equivalent. The tests check that ids are unique and that every service has a description and pros and cons.

To rename the site, change `SITE_NAME` in [`src/lib/site.ts`](src/lib/site.ts).

## Service icons

`public/icons/<provider>/<mapping-id>.svg` are taken from each provider's official architecture icon set ([AWS](https://aws.amazon.com/architecture/icons/), [Google Cloud](https://cloud.google.com/icons), [Azure](https://learn.microsoft.com/azure/architecture/icons/)). The icon for each cell is chosen in [`scripts/icons.py`](scripts/icons.py). When a set has no fitting icon, the card shows the provider logo instead.

To refresh them, download and unzip the packs into one folder (`aws/`, `azure/`, `gcp-core/`, `gcp-legacy/`), then run:

```bash
python3 -I scripts/icons.py /path/to/packs
```

The script also regenerates `src/content/icons.ts`. The tests check that every listed icon exists.

## SEO

- `sitemap.xml` and `robots.txt` are generated in `src/app/`.
- Open Graph and Twitter images are drawn with `next/og` (`opengraph-image.tsx` for the home page and for each service page).
- Canonical URLs always point at `https://samebut.thomaschaplin.me` (set in `src/lib/site.ts`).

## Deploy

It's a plain Next.js app, statically generated, so importing the repo into Vercel works with no configuration. Add the custom domain (`samebut.thomaschaplin.me`) in the project's Domains settings, then add the CNAME record Vercel shows you.
