// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 86400, // 1 day
    // Enable on-demand image optimization
    domains: process.env.IMAGE_DOMAINS?.split(",") || [],
    // Enable remote patterns if using external images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.example.com",
      },
    ],
  },
 
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['pages', 'utils']
  },
  compiler: {
    styledComponents: {
      // Enable better debugging and smaller production bundles
      ssr: true,
      displayName: true,
      fileName: false,
      pure: true,
      minify: true,
    },
    // Enable SWC for faster compilation (replaces Babel)
    emotion: true,
   
  }, 
  experimental: {
   
    webVitalsAttribution: ['CLS', 'LCP'],
    viewTransition: true,
  },
  turbopack: {
    // Example: adding an alias and custom file extension
    resolveAlias: {
      underscore: 'lodash',
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },

}

module.exports = nextConfig