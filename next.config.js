/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['img.youtube.com', 'lastfm.freetls.fastly.net'],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Mained-web-app' : '',
}

module.exports = nextConfig 