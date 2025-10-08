/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable type checking for Docker build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint for Docker build
  eslint: {
    ignoreDuringBuilds: true,
  },

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




