// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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

}

module.exports = nextConfig