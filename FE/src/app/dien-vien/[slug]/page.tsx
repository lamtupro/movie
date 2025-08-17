import MovieSection from '@/src/components/MovieSection';
import { Metadata } from 'next';

const pageSize = 20; // 20 phim mỗi trang
// Hàm fetch thông tin diễn viên
const getActress = async (slug: string) => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/api/actresses?filters[slug][$eq]=${slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        next: { revalidate: 3600 }
      }
    );

    if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu diễn viên');

    const data = await res.json();
    return data.data?.[0] || null; // Trả về diễn viên (nếu có)
  } catch (err) {
    console.error('❌ Lỗi fetch diễn viên:', err);
    return null;
  }
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const resolvedParams = await params; // Đây là điểm mới quan trọng
  const slug = resolvedParams.slug;

  const actress = await getActress(slug);

  const name = actress.name || 'Diễn viên';
  return {
    title: `Phim sex ${name} không che | Phim sex 18+ của diễn viên ${name} hot nhất`,
    description: `Tuyển chọn phim hot nhất của ${name}, chất lượng cao, cập nhật liên tục.`,
    alternates: {
      canonical: `https://quoclamtu.live/dien-vien/${slug}`,
    },
  };
}
// Hàm fetch phim của 1 diễn viên
const getMoviesByActress = async (actressId: number, page: number) => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/api/movies?populate=*&filters[actresses][id][$eq]=${actressId}&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        next: { revalidate: 3600 }
      }
    );

    if (!res.ok) throw new Error('Lỗi khi lấy danh sách phim');

    const data = await res.json();
    return {
      movies: data.data || [],
      total: data.meta?.pagination?.total || 0,
    };
  } catch (err) {
    console.error('❌ Lỗi fetch phim:', err);
    return { movies: [], total: 0 };
  }
};

export default async function ActressPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const paramsResolved = await params;
  const searchParamsResolved = await searchParams;

  const currentPage = parseInt(searchParamsResolved.page || '1', 10) || 1;

  const actress = await getActress(paramsResolved.slug);

  if (!actress) {
    return (
      <p className="text-white text-center py-10 text-xl">
        Không tìm thấy diễn viên hoặc dữ liệu không tồn tại 😢
      </p>
    );
  }


  const actressId = actress.id;
  const { movies, total } = await getMoviesByActress(actressId, currentPage);

  const totalPages = Math.ceil(total / pageSize);

  if (!movies || movies.length === 0) {
    return (
      <p className="text-white text-center py-10 text-xl">
        Không tìm thấy phim nào cho diễn viên này 😢
      </p>
    );
  }

  return (
    <MovieSection
      title={`Phim của ${actress.name || 'Diễn viên'}`}
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath={``}
    />
  );
}
