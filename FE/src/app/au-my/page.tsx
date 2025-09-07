import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

// Cấu hình SEO cho trang Âu Mỹ
export const metadata: Metadata = {
  title: 'Phim sex âu mỹ vietsub | Xem phim sex Châu Âu, Mỹ series chất lượng',
  description: 'Tổng hợp các bộ phim sex Âu Mỹ với nhiều diễn viên nổi tiếng Eva Elife, Melody Mark.  Cập nhật phim mới nhanh chóng, xem miễn phí tại quoclamtu.live .',
keywords: ["sex âu mỹ", "phim sex âu mỹ vietsub", "sex Melody Mark", "sex gái tây không che"],
};

const pageSize = 20; // Số phim mỗi trang

const getMovies = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/api/movies?populate=*&filters[us][$eq]=true&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      { headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 3600 } }
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
      title="Xem Phim Sex Âu Mỹ"
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/au-my"
    />
  );
}
