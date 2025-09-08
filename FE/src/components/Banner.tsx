'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Banner = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [hiddenBanners, setHiddenBanners] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/banners?populate=*&filters[banner_bot][$eq]=true`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data?.data)) {
          setBanners(data.data);
        } else {
          console.warn('Không có banner bot hoặc lỗi định dạng:', data);
          setBanners([]);
        }
      })
      .catch(err => {
        console.error('Lỗi fetch banner:', err);
        setBanners([]);
      });
  }, []);

  const handleClose = (id: string) => {
    setHiddenBanners(prev => ({
      ...prev,
      [id]: true,   // đánh dấu banner này đã tắt
    }));
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-10/12">
      {banners.map((banner: any, index) => {
        const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${banner.image_url?.url}`;
        if (hiddenBanners[banner.documentId]) return null; // ẩn riêng banner nào đã tắt

        return (
          <div
            key={banner.documentId || index}
            className="relative w-full lg:h-20 md:h-16 h-12 bg-white shadow-lg border rounded-lg overflow-hidden"
          >
            {/* Hình ảnh quảng cáo */}
            <a
              href={banner.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag('event', 'click_QC_duoi', {
                    event_category: 'Ads',
                    banner_id: banner.documentId,
                    ten_doi_tac: banner.name || 'Unnamed Banner',
                    value: 1,
                    banner_link: banner.link,
                  });
                }
              }}
            >
              <Image
                src={imageUrl || ''}
                alt={banner.name}
                layout="fill"
                priority
                fetchPriority="high"
                className="rounded-lg"
                unoptimized
              />
            </a>

            {/* ❌ Nút tắt riêng cho từng banner */}
            <button
              onClick={() => handleClose(banner.documentId)}
              className="absolute right-[-2px] top-[-2px] bg-white text-black border p-1 rounded-full shadow-md hover:bg-gray-200 transition"
            >
              ❌
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Banner;
