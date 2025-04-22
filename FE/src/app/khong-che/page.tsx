// app/vietsub/page.tsx

import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'Phim Sex Không Che Mới Nhất | Xem Phim Online HD',
  description: 'Tổng hợp phim sex Không Che hay nhất, cập nhật mới liên tục. Xem phim sex Không Che miễn phí, chất lượng cao không quảng cáo.',
  }

const getMovies = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies?filters[khong_che][$eq]=true&sort=createdAt:desc`)

    if (!res.ok) throw new Error('Fetch failed')

    const data = await res.json()
    return data.data
  } catch (err) {
    console.error('❌ Lỗi fetch phim Không Che', err)
    return null
  }
}

export default async function KhongcPage() {
  const movies = await getMovies()

  if (!movies || movies.length === 0) {
    return (
      <p className="text-white text-center py-10 text-xl">
        Không tìm thấy trang hoặc dữ liệu không tồn tại 😢
      </p>
    )
  }

  return (
    <MovieSection title="List Phim Không Che" movies={movies} />
  )
}
