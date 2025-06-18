/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ignoreDuringBuilds: true,
  },
  // Remove this line:
  // basePath: process.env.NODE_ENV === 'production' ? '/Mained-web-app' : '',
  reactStrictMode: true,
}

module.exports = nextConfig
