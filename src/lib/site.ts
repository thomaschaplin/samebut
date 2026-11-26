/** Rename the site here and everything (header, metadata, footer) follows. */
export const SITE_NAME = "samebut";
export const SITE_TAGLINE = "Same service, different cloud";
export const SITE_DESCRIPTION =
  "Know AWS? Find the Google Cloud and Azure equivalent of every service, side by side, with a short description and the pros and cons of each.";

/** Canonical origin. Every Vercel build (production and preview) points canonicals at the real domain. */
export const siteUrl = process.env.VERCEL ? "https://samebut.thomaschaplin.me" : "http://localhost:3000";
