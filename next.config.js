/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 👈 Required for static export (to use drag & drop on Netlify)

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
