/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["@/components/ui"],
  },

  // Configure images domain for external images
  images: {
    domains: ["localhost", "api.dicebear.com"],
    unoptimized: true,
  },

  // Configure headers for CORS and security
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ]
  },

  // Configure rewrites for API proxy (optional)
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://localhost:5001/api/:path*",
      },
    ]
  },

  // Optimize bundle
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size
    config.optimization.splitChunks = {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    }

    return config
  },

  // Configure TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configure ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Configure output
  output: "standalone",

  // Configure compression
  compress: true,

  // Configure trailing slash
  trailingSlash: false,

  // Configure redirects
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
