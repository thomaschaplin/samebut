/** Rename the site here and everything (header, metadata, footer) follows. */
export const SITE_NAME = "samebut";
export const SITE_TAGLINE = "Same service, different cloud";
export const SITE_DESCRIPTION =
  "Know AWS? Find the Google Cloud and Azure equivalent of every service, side by side, with a short description and pros and cons of each.";

const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl = prod ? `https://${prod}` : "http://localhost:3000";
