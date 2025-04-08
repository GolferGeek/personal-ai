/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@personal-ai/models",
    "@personal-ai/ui",
    "@personal-ai/utils",
  ],
  output: 'standalone',
};

module.exports = nextConfig; 