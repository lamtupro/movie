'use client'

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { usePathname } from 'next/navigation'


const Navbar = () => {

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [banners, setBanners] = useState([])

  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Trang Chủ' },
    { href: '/phim-hay', label: 'Phim Hay' },
    { href: '/gai-xinh', label: 'Gái Xinh' },
    { href: '/nhat-ban', label: 'Nhật Bản' },
    { href: '/trung-quoc', label: 'Trung Quốc' },
    { href: '/han-quoc', label: 'Hàn Quốc' },
    { href: '/au-my', label: 'Âu Mỹ' },
    { href: '/khong-che', label: 'Không Che' },
    { href: '/viet-sub', label: 'Vietsub' },
    { href: '/tap-the', label: 'Tập Thể' },
    { href: '/vung-trom', label: 'Vụng Trộm' },
    { href: '/hiep-dam', label: 'Hiếp Dâm' },
  ]

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(search.trim())}`);
    }
  };
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/banners?filters[banner_top][$eq]=true&populate=*`,)
      .then(res => res.json())
      .then(data => {
        // Nếu trả về đúng định dạng và có mảng data
        if (Array.isArray(data?.data)) {
          setBanners(data.data);
        } else {
          console.warn('Không có banner top hoặc lỗi định dạng:', data);
          setBanners([]); // fallback an toàn
        }
      })
      .catch(err => {
        console.error('Lỗi fetch banner:', err);
        setBanners([]); // fallback nếu lỗi mạng, v.v.
      });
  }, []);


  return (
    <div className="bg-[#0F0F10] text-white py-4">
      <div className=" ml-4 my-4">
        <Link className="inline-block" href='/'><Image
          src="/logo.png"
          alt="logo"
          width={220}
          height={120}
        /></Link>
      </div>
      <nav className=" py-3">
  <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    {/* Nav Menu */}
    <ul className="flex flex-wrap gap-x-3 gap-y-2 text-sm md:text-base">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <li
            className={`cursor-pointer px-3 py-1 md:px-4 md:py-2 rounded-lg 
              ${pathname === item.href
                ? 'bg-red-500'
                : 'bg-zinc-800 hover:text-gray-400'}
            `}
          >
            {item.label}
          </li>
        </Link>
      ))}
    </ul>

    {/* Search Box */}
    <div className="relative md:mt-1 mt-4 w-full md:w-auto">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
        placeholder="Tìm kiếm theo tên..."
        className="bg-[#1C1C1F] text-gray-300 rounded-full py-2 px-4 w-full md:w-64 focus:outline-none"
      />
      <FiSearch
        className="absolute right-4 top-2.5 text-gray-400 cursor-pointer"
        onClick={() => {
          if (search.trim() !== "") {
            router.push(`/search?query=${encodeURIComponent(search.trim())}`);
          }
        }}
      />
    </div>
  </div>
</nav>


      {/* -------------------------------BANNER----------------------------------- */}
      <div className="container relative mx-auto flex flex-col gap-4 px-4 my-4">
        {banners.map((banner: any, index) => {
          const imageUrl = `${process.env.STRAPI_API_URL}${banner.image?.url}`;

          return (
            <div key={index} className="relative w-full md:h-32 h-16 flex flex-col gap-2 rounded-lg">
              <div className="relative w-full h-32 rounded-lg hover:scale-105 transition-transform duration-300">
                {banner.image_url && (
                  <Link href={`${banner.link}`} target="_blank" onClick={() => {
                    if (typeof window !== "undefined" && window.gtag) {
                      window.gtag('event', 'click_QC_tren', {
                        event_category: 'Ads',
                        banner_id: banner.documentId,
                        ten_NC: banner.name || 'Unnamed Banner',
                        value: 1,
                        banner_link: banner.link
                      });
                    }
                  }}>
                    <Image
                      src={banner.image_url.url || ""}
                      alt={banner.name}
                      layout="fill"
                      className="rounded-lg"
                    />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <hr className="border-gray-500 " />
    </div>
  )
}

export default Navbar