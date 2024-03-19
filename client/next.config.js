/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "besocial-images.s3.eu-central-1.amazonaws.com",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
