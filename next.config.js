/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        "@": path.resolve(__dirname, "./"),
      };
    }
    return config;
  },
  env: {
    NEXTAUTH_SECRET: "jH1iIfTSlzIdmzxsCRTbV5J9dj4lNIwpzBOcYbcwMdw=",
  },
  // images:{
  //     domains:[
  //         // "lh3.googleusercontent.com",
  //         // "firebasestorage.googleapis.com"
  //         *
  //     ]
  // },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
