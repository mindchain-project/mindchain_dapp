import type { NextConfig } from "next";

/**
 * Hôtes IPFS autorisés pour `next/image`, dérivés de la même variable
 * d'environnement que `src/lib/ipfs.ts`. Ce fichier ne peut pas importer
 * l'alias `@/…` (il est évalué avant la résolution des chemins TypeScript),
 * d'où cette duplication minimale — volontairement limitée à trois lignes.
 */
const PUBLIC_IPFS_GATEWAYS = [
  "https://gateway.pinata.cloud/ipfs",
  "https://dweb.link/ipfs",
];
const configuredGateway =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY?.replace(/\/+$/, "") || PUBLIC_IPFS_GATEWAYS[0];
const ipfsHosts = Array.from(
  new Set(
    [configuredGateway, ...PUBLIC_IPFS_GATEWAYS]
      .map((url) => {
        try {
          return new URL(url).host;
        } catch {
          return "";
        }
      })
      .filter(Boolean),
  ),
);

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
  // Les polices du certificat sont lues sur le disque à l'exécution : sans
  // cette déclaration, le traceur de Next ne les embarquerait pas dans la
  // fonction serverless et la génération du PDF échouerait en production.
  outputFileTracingIncludes: {
    '/api/certificate': ['./src/assets/fonts/**'],
  },
  images: {
    // Dérivé de la même variable que `src/lib/ipfs.ts` : le nom d'une
    // passerelle dédiée change avec le compte Pinata, il n'a pas à être écrit
    // en dur ici. Les passerelles publiques restent autorisées en repli.
    remotePatterns: ipfsHosts.map((hostname) => ({
      protocol: 'https' as const,
      hostname,
      pathname: '/ipfs/**',
    })),
  },
};

export default nextConfig;
