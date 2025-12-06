import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Disabled to prevent double API calls in dev
  // Removed output: "export" to enable API routes for War Tracker
  images: {
    unoptimized: true, // Important for Cloudflare Pages compatibility
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;
