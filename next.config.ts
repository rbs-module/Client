import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        // pathname: "/*",
        search: "",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/v1/dashboard",
        permanent: true,
      },
      {
        source: "/v1",
        destination: "/v1/dashboard",
        permanent: true,
      },
    ];
  },
  // output: "export",
  /* config options here */
  output: "standalone",
};

export default nextConfig;
