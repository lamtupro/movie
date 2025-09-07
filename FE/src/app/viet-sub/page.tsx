import MovieSection from '@/src/components/MovieSection'
import { Metadata } from 'next'

// Cấu hình SEO cho trang Vietsub
export const metadata: Metadata = {
  title: 'Phim sex Vietsub hay | Xem phim sex có phụ đề tiếng Việt miễn phí',
  description: 'Tổng hợp các bộ phim sex Vietsub chất lượng cao, phụ đề rõ nét, cập nhật liên tục. Xem phim online nhanh, không quảng cáo tại quoclamtu.live .',
  openGraph: {
    title: "xem phim sex vietsub hay nhất 2025",
    description: "Kho phim sex mới nhất, xem miễn phí online.",
    url: "https://quoclamtu.live/viet-sub?page=1",
    images: [
      {
        url: "https://ab.quoclamtu.live/uploads/Co_giao_day_boi_nong_bong_va_cau_hoc_tro_may_man_Yua_Mikami_2565540ff2.webp",
        alt: "Phim sex vietsub hay nhất 2025",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  keywords: ["xem phim sex vietsub", "sex vietsub không che", "phim sex vietsub sextop1", "phim sex vietsub vlxx hay"],
};

const pageSize = 20; // Số phim mỗi trang

const getMovies = async (page: number) => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_API_URL}/api/movies?populate=*&filters[vietsub][$eq]=true&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
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
    console.error('❌ Lỗi fetch phim Viet Sub:', err);
    return { movies: [], total: 0 };
  }
};

export default async function VietSubPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
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
      title="Xem Phim Sex Vietsub"
      movies={movies}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/viet-sub"
    />
  );
}
