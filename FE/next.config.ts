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
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },

    ], 
    domains: [
      'authentic-star-bb10cc4ffe.media.strapiapp.com', // Thêm domain Strapi của bạn vào đây
      'quanly.quoclamtu.live', // Các domain khác nếu có
    ],
  },
};

export default nextConfig;
