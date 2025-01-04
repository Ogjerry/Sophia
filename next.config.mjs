/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend.sophiaspath.org',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
