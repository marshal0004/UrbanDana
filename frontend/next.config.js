/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "4000" },
      { protocol: "http", hostname: "127.0.0.1", port: "4000" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "http://localhost:4000"}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${process.env.BACKEND_URL || "http://localhost:4000"}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
