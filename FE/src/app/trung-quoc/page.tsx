import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

// Cấu hình SEO cho trang Vietsub
export const metadata: Metadata = {
  title: 'Phim sex Trung Quốc mới nhất | Xem phim sex Trung bộ hấp dẫn miễn phí',
  description: 'Cập nhật các bộ phim sex Trung Quốc đặc sắc, nhiều thể loại. Xem phim sex Trung Quốc phụ đề tiếng Việt, chất lượng HD tại  quoclamtu.live .',
};

const pageSize = 20; // Số phim mỗi trang

const getMovies = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/api/movies?populate=*&filters[trung_quoc][$eq]=true&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,  // Thêm dòng này
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
    console.error('❌ Lỗi fetch phim trung quốc:', err);
    return { movies: [], total: 0 };
  }
};

export default async function TrungQuocPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
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
      title="List Phim Sex Trung Quốc"
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/trung-quoc"
    />
  );
}
