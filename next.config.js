/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Allow Next.js <Image> to load external images from S3
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chattera-files-prod.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;