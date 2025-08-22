import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Remove console.* only in production builds
  compiler: {
    removeConsole: isProd
      ? {
          // Keep important error/warn in case you still want them
          exclude: ["error", "warn"],
        }
      : false,
  },
};

export default nextConfig;
