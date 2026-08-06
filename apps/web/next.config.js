/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hidden-eats/shared", "@hidden-eats/supabase-client"],
  reactStrictMode: true,
};

module.exports = nextConfig;
