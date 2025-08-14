/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack config to handle face-api.esm.js warning
  webpack: (config) => {
    config.module.rules.push({
      test: /face-api.esm.js/,
      type: "javascript/esm",
    });
    return config;
  },
};

export default nextConfig;
