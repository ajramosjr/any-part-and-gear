/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // IMPORTANT:
  // Do NOT use `output: "export"`
  // This app requires server rendering (Stripe, Supabase, API routes)

  experimental: {
    serverActions: true
  }
};

module.exports = nextConfig;
