import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloudflare Tunnel origin in dev to avoid dev-origin warnings.
  // (This is only relevant for `next dev`.)
  allowedDevOrigins: [".trycloudflare.com"],
};

export default nextConfig;
