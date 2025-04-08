/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@personal-ai/models",
    "@personal-ai/ui",
    "@personal-ai/utils",
  ],
  output: "standalone",
  // Add custom webpack config for handling packages in the monorepo
  webpack: (config, { isServer }) => {
    // Enable handling of .tsx files in dependencies
    config.resolve.extensions.push(".tsx");

    // Return the modified config
    return config;
  },
  // Environment variable configuration
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  },
  // Add experimental features if needed
  experimental: {
    // Enable server components
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

module.exports = nextConfig;
