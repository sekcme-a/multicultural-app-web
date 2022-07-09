/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
}

module.exports = nextConfig
