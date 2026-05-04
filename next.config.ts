import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://72.61.120.249:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;