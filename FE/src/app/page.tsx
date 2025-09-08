import MovieSection from '@/src/components/MovieSection'
import { generateSeoMetadata } from '@/src/lib/seo';

export async function generateMetadata({ searchParams }: { searchParams: { page?: string } }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const canonical =
    page > 1
      ? `https://quoclamtu.live?page=${page}`
      : `https://quoclamtu.live`;

  return generateSeoMetadata({
    title: 'Tổng hợp phim sex 2025 mới nhất | Xem VLXX, Hay Nhất 2025 – quoclamtu.live',
    description: 'Trang web xem phim sex VLXX siêu nét, cập nhật phim mới mỗi ngày. Không Che, Vietsub,... đầy đủ không quảng cáo tại quoclamtu.live .',
    keywords: ["phim sex hay", "phim sex không che 2025", "phim sex VLXX mới nhất", "sex Việt Nam", "xem sex buomxinh"],
    canonical,
    page,
    ogImage: "https://ab.quoclamtu.live/uploads/Hom_nay_hay_quen_vo_anh_di_Kana_Momonogi_bf00fbc714.jpg",
  });
}


const pageSize = 20;

const getMovies = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/api/movies?populate=*&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,  // Thêm dòng này
        },
        /*  next: { revalidate: 3600 } */
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
      title="Danh Sách Phim Sex Mới Nhất"
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/"
    />
  );
}
