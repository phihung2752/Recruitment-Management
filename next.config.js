/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  },
  // Enable Fast Refresh
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}

module.exports = nextConfig
