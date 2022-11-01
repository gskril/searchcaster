const { withPlausibleProxy } = require('next-plausible')

/** @type {import('next').NextConfig} */
module.exports = withPlausibleProxy()({
  async redirects() {
    return [
      {
        source: '/api',
        destination: '/docs',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/u/:path*',
        destination: '/search?username=:path*',
      },
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
})
