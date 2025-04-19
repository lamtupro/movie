'use client'

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const Navbar = () => {

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [banners, setBanners] = useState([])
  const [showGenres, setShowGenres] = useState(false);

  const genres = [
    { id: 1, name: 'Vietsub', slug: 'viet-sub' },
    /*  { id: 2, name: 'Không Che', slug: 'khong-che' },
     { id: 3, name: 'Quay lén', slug: 'quay-len' },
     { id: 4, name: 'Loạn Luân', slug: 'loan-luan' },
     { id: 5, name: 'Thủ Dâm', slug: 'thu-dam' },
     { id: 6, name: 'Tự Quay', slug: 'tu-quay' },
     { id: 7, name: 'Gái Xinh', slug: 'gai-xinh' },
     { id: 8, name: 'Gái Gọi', slug: 'gai-goi' } */
  ];

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
    <div>
      <nav className="bg-[#0F0F10] text-white py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center ">
            <div className="min-w-[45px]">
              <Link href='/'><Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={40} className="bg-black"
              /> </Link>
            </div>

            <ul className="flex relative flex-wrap gap-x-3 text-sm ml-10 gap-y-2 md:text-lg">
              <Link href='/'><li className="hover:text-gray-400 cursor-pointer bg-zinc-800 md:p-2 p-1 rounded-lg">Trang chủ</li></Link>
              <Link href='/phim-hay'><li className="hover:text-gray-400 cursor-pointer bg-zinc-800 md:p-2 p-1 rounded-lg">Sex Hay</li></Link>
              <Link href='/nhat-ban'><li className="hover:text-gray-400 cursor-pointer bg-zinc-800 md:p-2 p-1 rounded-lg">Nhật Bản</li></Link>
              <Link href='/trung-quoc'><li className="hover:text-gray-400 cursor-pointer bg-zinc-800 md:p-2 p-1 rounded-lg">Trung Quốc</li></Link>
              <Link href='/han-quoc'> <li className="hover:text-gray-400 cursor-pointer bg-zinc-800 md:p-2 p-1 rounded-lg">Hàn Quốc</li></Link>              
              <Link href='/au-my'><li className="hover:text-gray-400 cursor-pointer bg-zinc-800 md:p-2 p-1 rounded-lg">Âu Mỹ</li></Link>
              <Link href='/khong-che'> <li className="hover:text-gray-400 cursor-pointer bg-zinc-800 md:p-2 p-1 rounded-lg">Không Che</li></Link>
              <Link href='/viet-sub'> <li className="hover:text-gray-400 cursor-pointer bg-zinc-800 md:p-2 p-1 rounded-lg">Vietsub</li></Link>
              <Link href='/tap-the'> <li className="hover:text-gray-400 cursor-pointer bg-zinc-800 md:p-2 p-1 rounded-lg">Tập thể</li></Link>
              <Link href='/vung-trom'> <li className="hover:text-gray-400 cursor-pointer bg-zinc-800 md:p-2 p-1 rounded-lg">Vụng trộm</li></Link>
              <Link href='/hiep-dam'> <li className="hover:text-gray-400 cursor-pointer bg-zinc-800 md:p-2 p-1 rounded-lg">Hiếp dâm</li></Link>
              {/*  <li className="hover:text-gray-400 cursor-pointer bg-zinc-800 md:p-2 p-1 rounded-lg list-none" onClick={() => setShowGenres(!showGenres)}>Thể Loại</li>
             {showGenres && (
                <div className="absolute top-full mt-2 right-0 w-full md:w-8/12 z-50 md:text-xl bg-zinc-900 border border-gray-700 rounded-lg shadow-lg md:p-4 p-1">
                  <ul className="grid grid-cols-2 md:grid-cols-2 text-center">
                    {genres.map((genre, index) => (
                      <li
                        key={index}
                        className="text-white hover:text-gray-300 cursor-pointer py-1"
                        onClick={() => {

                          setShowGenres(false); // đóng menu sau khi chọn
                        }}
                      >
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
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
    </div>
  )
}

export default Navbar