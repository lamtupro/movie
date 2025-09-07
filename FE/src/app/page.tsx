import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Tổng hợp phim sex 2025 mới nhất | Xem VLXX, Hay Nhất 2025 – quoclamtu.live',
  description: 'Trang web xem phim sex VLXX online chất lượng cao, cập nhật phim mới mỗi ngày. Không Che, Vietsub, Âu Mỹ, Hàn Quốc, Nhật Bản đầy đủ – xem nhanh, không quảng cáo tại quoclamtu.live .',
  openGraph: {
    title: "xem phim sex chất lượng nhất 2025",
    description: "Kho phim sex mới nhất, xem miễn phí online.",
    url: "https://quoclamtu.live",
    images: [
      {
        url: "https://ab.quoclamtu.live/uploads/Hom_nay_hay_quen_vo_anh_di_Kana_Momonogi_bf00fbc714.jpg",
        alt: "Phim sex hay nhất 2025",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  keywords: ["phim sex hay", "phim sex không che 2025", "phim sex VLXX mới nhất","sex Việt Nam","xem sex buomxinh"],
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
