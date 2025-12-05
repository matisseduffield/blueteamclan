import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "export", // Static export for Cloudflare Pages
  images: {
    unoptimized: true, // Important for Cloudflare Pages compatibility
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;
