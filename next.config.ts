import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Static HTML export for better Netlify compatibility
  images: {
    unoptimized: true, // Needed for static export
  },
  trailingSlash: true, // Add trailing slashes for better routing on Netlify
};

export default nextConfig;
