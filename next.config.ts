/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  turbopack: {
    root: process.cwd(),
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
