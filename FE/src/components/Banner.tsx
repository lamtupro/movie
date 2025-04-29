'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const [banners, setBanners] = useState([])
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/banners?populate=*&filters[banner_bot][$eq]=true`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        // Nếu trả về đúng định dạng và có mảng data
        if (Array.isArray(data?.data)) {
          setBanners(data.data);
        } else {
          console.warn('Không có banner bot hoặc lỗi định dạng:', data);
          setBanners([]); // fallback an toàn
        }
      })
      .catch(err => {
        console.error('Lỗi fetch banner:', err);
        setBanners([]); // fallback nếu lỗi mạng, v.v.
      });
  }, []);
  

  if (!isVisible) return null;
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2  w-10/12 ">

      {banners.map((banner: any, index) => {/* 
        const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${banner.image?.url}`; */

        return (
          <div
            key={index}
            className="relative w-full lg:h-20 md:h-16 h-12 bg-white shadow-lg border rounded-lg overflow-hidden">

            {/* Hình ảnh quảng cáo */}
            <a href={banner.link} target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag('event', 'click_QC_duoi', {
                    event_category: 'Ads',
                    banner_id: banner.documentId,
                    ten_NC: banner.name || 'Unnamed Banner',
                    value: 1,
                    banner_link: banner.link
                  });
                }
              }}
            >
              <Image
                src={banner.image_url || ''}
                alt={banner.name}
                layout="fill"
                className="rounded-lg"
              />
            </a>

          </div>
        );
      })}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-[-2px] bg-white text-black border p-1 rounded-full shadow-md hover:bg-gray-200 transition"
      >
        ❌
      </button>
    </div>
  );
};

export default Banner
