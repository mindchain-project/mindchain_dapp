import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@coinbase/wallet-sdk': false,
      '@metamask/sdk': false,
      '@gemini-wallet/core': false,
      '@walletconnect/ethereum-provider': false,
      porto: false,
      'porto/internal': false,
    };
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config;
  },
  experimental: {
      serverActions: {
        bodySizeLimit: '2mb',
      },
    },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'aqua-biological-trout-497.mypinata.cloud',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'dweb.link',
        pathname: '/ipfs/**',
      },
    ],
  },
};

export default nextConfig;
