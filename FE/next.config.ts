import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ab.quoclamtu.live",
      },

    ],
    domains: [
       'ab.quoclamtu.live', // Các domain khác nếu có , KHAI BÁO ĐỂ KO BỊ CHẶN
    ],
  },
};

export default nextConfig;
