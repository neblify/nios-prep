import type { NextConfig } from 'next';

const nextConfig = {
  serverExternalPackages: ['pdf-parse'],
  serverActions: {
    bodySizeLimit: '5mb',
  },
} satisfies NextConfig;

export default nextConfig;
