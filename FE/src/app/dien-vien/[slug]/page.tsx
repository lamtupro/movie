// app/dien-vien/[slug]/page.tsx

import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

interface Movie {
  id: number
  name: string
  slug: string
}

interface Actress {
  id: number
  name: string
  description?: string
  movies: Movie[]
}

export const metadata:Metadata = {
    title: 'Tuyển tập các idol phim sex Mới Nhất | Xem Phim Online HD',
    description: 'Tổng hợp idol phim sex xinh đẹp hay nhất, cập nhật mới liên tục. Xem phim sex miễn phí, chất lượng cao không quảng cáo.',
    }

async function getActress(slug: string): Promise<Actress | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/actresses?filters[slug][$eq]=${slug}&populate=movies`,
      { cache: 'no-store' }
    )

    if (!res.ok) throw new Error('Lỗi khi fetch data diễn viên')

    const json = await res.json()
    const item = json.data?.[0]

    if (!item) return null

    return {
      id: item.id,
      name: item.name || 'Không rõ',
      movies: item.movies || [],
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy dữ liệu diễn viên:', error)
    return null
  }
}

export default async function ActressPage({ params }: { params: { slug: string } }) {
  const actress = await getActress(params.slug)

  if (!actress) {
    return (
      <p className="text-white text-center py-10 text-xl">
        Không tìm thấy diễn viên hoặc dữ liệu không tồn tại 😢
      </p>
    )
  }

  return (
    <>
      <div className="text-white text-center mb-6">
        {actress.description && <p className="mt-2 text-sm text-gray-400">{actress.description}</p>}
      </div>
      <MovieSection title={`Phim của ${actress.name}`} movies={actress.movies} />
    </>
  )
}
