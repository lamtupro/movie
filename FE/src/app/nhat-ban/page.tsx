import MovieSection from '@/src/components/MovieSection'
import { generateSeoMetadata } from '@/src/lib/seo';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const canonical =
    page > 1
      ? `https://quoclamtu.live/nhat-ban?page=${page}`
      : `https://quoclamtu.live/nhat-ban`;

  return generateSeoMetadata({
    title: 'Phim sex Nhật Bản loạn luân đặc sắc | Xem phim sex Nhật Bản hay nhất hiện nay',
    description: 'Khám phá kho phim Nhật Bản đa dạng thể loại: Vụng Trộm, Hiếp Dâm, Tập Thể. Cập nhật phim sex Nhật mới nhanh nhất, chất lượng HD',
    keywords: ["xem phim sex Nhật loạn luân", "xem phim sex vlxx", "phim sex nhật bản hay nhất", "phim sex không che missav hay"],
    canonical,
    page,
  });
}

const pageSize = 20; // Số phim mỗi trang

const getMovies = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/api/movies?populate=*&filters[nhat_ban][$eq]=true&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
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
    console.error('❌ Lỗi fetch phim nhật bản:', err);
    return { movies: [], total: 0 };
  }
};

export default async function NhatBanPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
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
      title="Xem Phim Sex Nhật Bản"
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/nhat-ban"
    />
  );
}
