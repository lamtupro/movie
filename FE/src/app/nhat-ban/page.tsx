// app/vietsub/page.tsx

import MovieSection from '@/src/components/MovieSection'

export const metadata = {
  title: 'Phim Sex Nhật Bản mới nhất',
  description: 'Tổng hợp danh sách phim sex Nhật Bản được cập nhật mới nhất, chất lượng cao.',
}

const getMovies = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies?filters[nhat_ban][$eq]=true&sort=createdAt:desc`, {
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
