// next-i18next.config.ts
import type { UserConfig } from "next-i18next";

const config: UserConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "vi"],
    localeDetection: false,
  },
  reloadOnPrerender: process.env.DEV === "development",
};

export default config;
