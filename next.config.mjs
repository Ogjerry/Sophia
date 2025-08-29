/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "sophiaspathbackend-production.up.railway.app",
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
