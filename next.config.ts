import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://zentry-649036872480.asia-south1.run.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
