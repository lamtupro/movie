import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

// Cấu hình SEO cho trang Vietsub
export const metadata: Metadata = {
  title: 'Phim sex tập thể mới nhất | Xem phim sex tập thể tại quoclamtu',
  description: 'Tổng hợp các bộ phim sex tập thể chất lượng cao, cập nhật liên tục, lưu ý các video chỉ là hư cấu và được dàn đựng, không được học và làm theo dưới bất kì hình thức nào. Xem phim sex tập thể HD miễn phí tại quoclamtu.live .',
  keywords: ["Phim sex tập thể 2025", "địt nhau tập thể", "vlxx địt tập thể", "sex đụ nhau tập thể"],
};

const pageSize = 20; // Số phim mỗi trang

const getMovies = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/api/movies?populate=*&filters[tap_the][$eq]=true&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        next: { revalidate: 3600 }
      }
    );

    if (!res.ok) throw new Error('Fetch failed');

    const data = await res.json();
    return {
      movies: data.data || [],
      total: data.meta?.pagination?.total || 0,
    };
  } catch (err) {
    console.error('❌ Lỗi fetch phim tập thể:', err);
    return { movies: [], total: 0 };
  }
};

export default async function TapThePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
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
      title="Xem Phim Sex Tập Thể"
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/tap-the"
    />
  );
}
