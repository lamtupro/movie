import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

// Cấu hình SEO cho trang Vietsub
export const metadata: Metadata = {
  title: 'Phim sex Hàn Quốc hot | Xem phim sex gái xinh Hàn Quốc',
  description: 'Tuyển chọn phim sex Hàn Quốc hot nhất, phụ đề tiếng Việt chuẩn, cập nhật liên tục. Thưởng thức phim Hàn sex HD chất lượng cao tại quoclamtu.live .',
};

const pageSize = 20; // Số phim mỗi trang

const getMovies = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/api/movies?populate=*&filters[han_quoc][$eq]=true&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
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
    console.error('❌ Lỗi fetch phim hàn quốc:', err);
    return { movies: [], total: 0 };
  }
};

export default async function HanQuocPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
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
      title="List Phim Sex Hàn Quốc"
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/han-quoc"
    />
  );
}
