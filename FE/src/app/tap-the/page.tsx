import MovieSection from '@/src/components/MovieSection'
import { generateSeoMetadata } from '@/src/lib/seo';

export async function generateMetadata({ searchParams }: { searchParams: { page?: string } }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const canonical =
    page > 1
      ? `https://quoclamtu.live/tap-the?page=${page}`
      : `https://quoclamtu.live/tap-the`;

  return generateSeoMetadata({
    title: 'Phim sex tập thể 2025 | Xem địt nhau tập thể tại quoclamtu',
    description: 'Xem sex đụ nhau tập thể cực phê, some gái xinh bắn nước HD miễn phí tại quoclamtu.live .',
    keywords: ["Phim sex tập thể 2025", "địt nhau tập thể", "vlxx địt tập thể", "sex đụ nhau tập thể"],
    canonical,
    page,
  });
}
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
