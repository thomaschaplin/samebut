# samebut: same service, different cloud

Know one cloud? Find the other two. Every common cloud service is shown in three columns, always in the order **AWS · Google Cloud · Azure**. Each one has a short description, pros and cons, and a "good to know" note where the services differ in ways that matter.

- Search by any provider's service name ("Cloud Run", "Cosmos DB", "Lambda") or by an alias ("k8s", "s3", "redis"). The cell you searched for is highlighted.
- Filter by category, expand pros and cons per row or for all rows, and switch between light and dark themes.
- Searches can be shared: `?q=cloud+run&c=serverless`, and `#kubernetes` links to a single row.

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

## Deploy

It's a plain Next.js app, statically generated, so importing the repo into Vercel works with no configuration. Add the custom domain (`samebut.thomaschaplin.me`) in the project's Domains settings, then add the CNAME record Vercel shows you.
