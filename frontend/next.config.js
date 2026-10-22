/** @type {import('next').NextConfig} */
const BACKEND_URL = "https://urbandana.onrender.com";

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "urbandana.onrender.com" },
      { protocol: "http", hostname: "localhost", port: "4000" },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` },
      { source: "/uploads/:path*", destination: `${BACKEND_URL}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
