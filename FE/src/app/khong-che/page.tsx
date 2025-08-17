import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

// Cấu hình SEO cho trang Vietsub
export const metadata: Metadata = {
  title: 'Xem phim sex không che vietsub | Kho phim sex không che chất lượng cao - quoclamtu',
  description: 'Tổng hợp các bộ phim sex không che của diễn viên xinh đẹp nổi tiếng. càng xem càng cuốn với chất lượng HD và miễn phí tại quoclamtu.live .',
};

const pageSize = 20; // Số phim mỗi trang

const getMovies = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/api/movies?populate=*&filters[khong_che][$eq]=true&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      {  headers: {
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
    console.error('❌ Lỗi fetch phim không che:', err);
    return { movies: [], total: 0 };
  }
};

export default async function KhongChePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
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
      title="Xem Phim Sex Không Che"
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/khong-che"
    />
  );
}
