import { defineRouting } from "next-intl/routing";

export const locales = ["en"] as const;

export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "never", // Clean URLs — no /en/ prefix. Add more locales later.
});
