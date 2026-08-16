/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allows local /gallery/ images + any future CDN domains
    remotePatterns: [],
    // Serve optimised images in WebP/AVIF automatically
    formats: ["image/avif", "image/webp"],
  },
  // Compress responses
  compress: true,
};

module.exports = nextConfig;