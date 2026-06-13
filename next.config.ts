import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['gsap'],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default withNextIntl(nextConfig);
