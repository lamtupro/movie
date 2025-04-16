import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },

    ],
    domains: ["localhost"],
  },
  async rewrites() {
    return [
      {
        source: "/phim-hay",
        destination: "/phimHay",
      },
      {
        source: "/viet-nam",
        destination: "/vietNam",
      },
      {
        source: "/chau-a",
        destination: "/asia",
      },
      {
        source: "/chau-au",
        destination: "/europan",
      },
      {
        source: "/khong-che",
        destination: "/noOpacity",
      },
      {
        source: "/viet-sub",
        destination: "/vietSub",
      },
    ];
  },
};

export default nextConfig;
