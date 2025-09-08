import MovieSection from '@/src/components/MovieSection'
import { generateSeoMetadata } from '@/src/lib/seo';

export async function generateMetadata({ searchParams }: { searchParams: { page?: string } }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const canonical =
    page > 1
      ? `https://quoclamtu.live/han-quoc?page=${page}`
      : `https://quoclamtu.live/han-quoc`;

  return generateSeoMetadata({
    title: 'Phim sex Hàn Quốc không che | Tổng hợp phim sex gái xinh Hàn Quốc',
    description: 'Tuyển chọn phim sex Hàn Quốc hot nhất, phụ đề tiếng Việt chuẩn, cập nhật liên tục. Thưởng thức phim Hàn sex HD chất lượng cao tại quoclamtu.live .',
    keywords: ["sex hàn quốc", "phim sex idol kpop", "sex diễn viên hàn quốc", "sex gái xinh hàn quốc không che"],
    canonical,
    page,
  });
}

const pageSize = 20; // Số phim mỗi trang

const getMovies = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/api/movies?populate=*&filters[han_quoc][$eq]=true&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
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
      title="Xem Phim Sex Hàn Quốc"
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/han-quoc"
    />
  );
}
