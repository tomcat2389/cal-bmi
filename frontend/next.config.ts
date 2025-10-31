import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use static export for production builds
  // Remove this line for development to avoid CORS issues
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    // Required by FHEVM
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
  async rewrites() {
    // Proxy API requests to avoid CORS issues in development
    return [
      {
        source: '/api/relayer/:path*',
        destination: 'https://relayer.testnet.zama.cloud/:path*',
      },
    ];
  },
};

export default nextConfig;
