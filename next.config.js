/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['img.youtube.com', 'lastfm.freetls.fastly.net'],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/<your-repo-name>' : '',
}

module.exports = nextConfig 