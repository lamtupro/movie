

import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'Phim Sex Top Mới Nhất | Xem Phim Online HD',
  description: 'Tổng hợp phim sex Top hay nhất, cập nhật mới liên tục. Xem phim sex Top miễn phí, chất lượng cao không quảng cáo.',
  }

const getMovies = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies?sort=views:desc&pagination[limit]=100`, {
      cache: 'force-cache', // hoặc 'no-store' nếu muốn fetch mỗi lần
    })

    if (!res.ok) throw new Error('Fetch failed')

    const data = await res.json()
    return data.data
  } catch (err) {
    console.error('❌ Lỗi fetch phim Nhật Bản:', err)
    return null
  }
}

export default async function NhatPage() {
  const movies = await getMovies()

  if (!movies || movies.length === 0) {
    return (
      <p className="text-white text-center py-10 text-xl">
        Không tìm thấy trang hoặc dữ liệu không tồn tại 😢
      </p>
    )
  }

  return (
    <MovieSection title="List Phim Nhật Bản" movies={movies} />
  )
}
const categories = ['khong_che', 'vietsub','vung_trom','tap_the','han_quoc', 'nhat_ban', 'us', 'hiep_dam', 'trung_quoc' ]
