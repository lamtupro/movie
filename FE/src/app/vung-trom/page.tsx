// app/vietsub/page.tsx

import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Phim Sex Vụng Trộm Mới Nhất | Xem Phim Online HD',
  description: 'Tổng hợp phim sex Vụng Trộm hay nhất, cập nhật mới liên tục. Xem phim sex Vụng Trộm miễn phí, chất lượng cao không quảng cáo.',
}

const getMovies = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies?populate=*&filters[vung_trom][$eq]=true&sort=createdAt:desc`)

    if (!res.ok) throw new Error('Fetch failed')

    const data = await res.json()
    return data.data
  } catch (err) {
    console.error('❌ Lỗi fetch phim Vụng Trộm:', err)
    return null
  }
}

export default async function VungTromPage() {
  const movies = await getMovies()

  if (!movies || movies.length === 0) {
    return (
      <p className="text-white text-center py-10 text-xl">
        Không tìm thấy trang hoặc dữ liệu không tồn tại 😢
      </p>
    )
  }

  return (
    <MovieSection title="List Phim Vụng Trộm" movies={movies} />
  )
}
