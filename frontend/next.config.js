/** @type {import('next').NextConfig} */
const BACKEND_URL = "https://urbandana.onrender.com";

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "urbandana.onrender.com" },
      { protocol: "http", hostname: "localhost", port: "4000" },
    ],
    // Vercel CDN image optimization — big company system design technique
    formats: ["image/avif", "image/webp"],  // serve modern formats (smaller)
    minimumCacheTTL: 86400,  // 24h edge cache
    deviceSizes: [240, 280, 384, 640, 750, 828, 1080, 1200],
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` },
      { source: "/uploads/:path*", destination: `${BACKEND_URL}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
