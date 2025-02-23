/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: [
      'img.youtube.com',
      'i.ytimg.com',
      'i.scdn.co',
      'lastfm.freetls.fastly.net'
    ],
  },
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Mained-web-app' : '',
  reactStrictMode: true,
  swcMinify: true
}

module.exports = nextConfig 