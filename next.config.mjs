import withBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output optimization for serverless/Vercel deployment
  output: 'standalone',

  // Enable compression by default
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Enable static generation by default
  staticPageGenerationTimeout: 60,

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default withBundleAnalyzerConfig(nextConfig);
