/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ritual.net",
      },
    ],
  },
};

export default nextConfig;

