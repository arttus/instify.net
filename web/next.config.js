/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  experimental: {
    mdxRs: true,
  },
};

module.exports = nextConfig;
