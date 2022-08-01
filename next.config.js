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
  reactStrictMode: true,
  swcMinify: true,
})
