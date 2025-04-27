import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

// Cấu hình SEO cho trang Vietsub
export const metadata: Metadata = {
  title: 'Phim sex âu mỹ mới nhất | Xem phim sex âu mỹ miễn phí',
  description: 'Tổng hợp các bộ phim sex âu mỹ chất lượng cao, cập nhật liên tục. Xem phim sex âu mỹ HD miễn phí tại quoclamtu.live .',
};

const pageSize = 20; // Số phim mỗi trang

const getMovies = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies?populate=*&filters[us][$eq]=true&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      { cache: 'no-store' }
    );

    if (!res.ok) throw new Error('Fetch failed');

    const data = await res.json();
    return {
      movies: data.data || [],
      total: data.meta?.pagination?.total || 0,
    };
  } catch (err) {
    console.error('❌ Lỗi fetch phim âu mỹ:', err);
    return { movies: [], total: 0 };
  }
};

export default async function AuMyPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const searchParamsResolved = await searchParams;
  const currentPage = parseInt(searchParamsResolved.page || '1', 10) || 1;
  const { movies, total } = await getMovies(currentPage);
  const totalPages = Math.ceil(total / pageSize);

  if (!movies || movies.length === 0) {
    return (
      <p className="text-white text-center py-10 text-xl">
        Không tìm thấy trang hoặc dữ liệu không tồn tại 😢
      </p>
    );
  }

  return (
    <MovieSection
      title="List Phim Âu Mỹ"
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/au-my"
    />
  );
}
