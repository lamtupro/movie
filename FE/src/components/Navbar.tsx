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
    { href: '/', label: 'Trang Chủ'},
    { href: '/phim-hay', label: 'Phim Hay' },
    { href: '/gai_xinh', label: 'Gái Xinh' },
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
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/banners?filters[banner_top][$eq]=true&populate=*`)
      .then(res => res.json())
      .then(data => setBanners(data.data) ?? [])
      .catch(err => console.error(err))
  }, [])


  return (
    <div className="bg-[#0F0F10] text-white py-4">
      <div className=" ml-4 my-4">
        <Link className="inline-block" href='/'><Image
          src="/logo.png"
          alt="Logo"
          width={220}
          height={120} className=""
        /> </Link>
      </div>
      <nav>
        <div className="container mx-auto flex gap-4 items-center justify-between px-4">
          {/* Logo */}

          <div className="flex items-start ">
            <ul className="flex relative flex-wrap gap-x-3 text-sm gap-y-2 md:text-base">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <li
                    className={`cursor-pointer md:p-2 p-1 rounded-lg
              ${pathname === item.href
                        ? 'bg-red-500 ' // ✅ active style
                        : 'bg-zinc-800 hover:text-gray-400' // 🔲 normal style
                      }`}
                  >
                    {item.label}
                  </li>
                </Link>
              ))}
             </ul>

          </div>

          {/* Search Box */}
          <div className="relative md:flex hidden ">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Tìm kiếm..."
              className="bg-[#1C1C1F] text-gray-300 rounded-full py-2 px-4 w-64 focus:outline-none"
            />
            <FiSearch
              className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
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
          const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${banner.image?.url}`;

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
                      src={banner.image_url || ""}
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
      <hr className="border-gray-500 mt-8 " />
    </div>
  )
}

export default Navbar