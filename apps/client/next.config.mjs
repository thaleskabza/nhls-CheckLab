/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      externalDir: true
    },
    transpilePackages: ['@infra', '@core', '@api', '@config', '@ui'],
    // transpilePackages: [] // add package names here if you later publish them
  };
  
  export default nextConfig;
  