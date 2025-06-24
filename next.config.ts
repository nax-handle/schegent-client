// next.config.ts
import type { NextConfig } from "next";
import i18nConfig from "./next-i18next.config";

const nextConfig: NextConfig = {
  i18n: i18nConfig.i18n,
  reactStrictMode: true,
  env: {
    DEV: process.env.DEV,
  },
};

export default nextConfig;
