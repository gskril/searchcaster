const { withPlausibleProxy } = require('next-plausible')

/** @type {import('next').NextConfig} */
module.exports = withPlausibleProxy()({
  async redirects() {
    return [
      {
        source: '/api',
        destination: '/',
        permanent: false,
      },
      {
        source: '/search',
        destination: '/',
        permanent: false,
      },
      {
        source: '/profiles',
        destination: '/',
        permanent: false,
      },
      {
        source: '/docs',
        destination: '/',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/deprecated',
      },
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
})
