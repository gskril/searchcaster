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
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'origins', value: '*' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Request-Methods',
            value: 'GET',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Authorization, Content-Type',
          },
        ],
      },
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
})
