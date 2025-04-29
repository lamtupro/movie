import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

const pageSize = 20;

const getMovies = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies?populate=*&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        cache: 'no-store',  // Không lưu cache, luôn lấy dữ liệu mới
      }
    );
    

    if (!res.ok) throw new Error('Fetch failed');

    const data = await res.json();
    return {
      movies: data.data || [],
      total: data.meta?.pagination?.total || 0,
    };
  } catch (err) {
    console.error('❌ Lỗi fetch phim Home:', err);
    return { movies: [], total: 0 };
  }
};

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const searchParamsResolved = await searchParams;
  const currentPage = parseInt(searchParamsResolved.page || '1', 10) || 1;
  const { movies, total } = await getMovies(currentPage);
  const totalPages = Math.ceil(total / pageSize);

  if (!movies || movies.length === 0) {
    return (
      <p className="text-white text-center py-10 text-xl">
        Không tìm thấy phim nào 😢
      </p>
    );
  }

  return (
    <MovieSection
      title="Danh sách phim mới nhất"
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/"
    />
  );
}
