import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

// Cấu hình SEO cho trang Vietsub
export const metadata: Metadata = {
  title: 'Top 100 phim sex hay nhất | Xem phim hot miễn phí chất lượng cao',
  description: 'Tổng hợp 100 bộ phim sex hay nhất được xem nhiều nhất, cập nhật liên tục. Xem phim sex HD miễn phí nhanh, mượt tại quoclamtu.live .',
};

const pageSize = 20; // Số phim mỗi trang
const maxPages = 5; // Chỉ lấy tối đa 5 trang => 100 phim

const getMovies = async (page: number) => {
  // Giới hạn số trang tối đa
  if (page > maxPages) {
    return { movies: [], total: pageSize * maxPages };
  }

  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/api/movies?populate=*&sort=views:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error('Fetch failed');

    const data = await res.json();
    return {
      movies: data.data || [],
      total: Math.min(data.meta?.pagination?.total || 0, pageSize * maxPages), // giới hạn tối đa 100 phim
    };
  } catch (err) {
    console.error('❌ Lỗi fetch phim hay:', err);
    return { movies: [], total: 0 };
  }
};

export default async function PhimHayPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParamsResolved = await searchParams;
  const currentPage = Math.min(parseInt(searchParamsResolved.page || '1', 10) || 1, maxPages); // không cho vượt trang 5

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
      title="Top 100 Phim Sex Hay Theo Lượt Xem"
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/phim-hay"
    />
  );
}


