/** @type {import('next').NextConfig} */
module.exports = {
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
}
