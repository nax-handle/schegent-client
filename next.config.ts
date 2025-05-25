// next.config.ts
import type { NextConfig } from "next";
import nextI18NextConfig from "./next-i18next.config";

const nextConfig: NextConfig = {
  ...nextI18NextConfig,
  reactStrictMode: true,
  env: {
    DEV: process.env.DEV,
  },
};

export default nextConfig;
