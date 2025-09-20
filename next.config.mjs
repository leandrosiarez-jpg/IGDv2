/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/IGDv2.github.io',
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;