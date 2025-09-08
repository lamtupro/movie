import MovieSection from '@/src/components/MovieSection'
import { generateSeoMetadata } from '@/src/lib/seo';

export async function generateMetadata({ searchParams }: { searchParams: { page?: string } }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const canonical =
    page > 1
      ? `https://quoclamtu.live/viet-sub?page=${page}`
      : `https://quoclamtu.live/viet-sub`;

  return generateSeoMetadata({
    title: 'Phim sex Vietsub hay | Xem phim sex có phụ đề tiếng Việt miễn phí',
    description: 'Tổng hợp các bộ phim sex Vietsub chất lượng cao, phụ đề rõ nét, cập nhật liên tục. Xem phim online nhanh, không quảng cáo tại quoclamtu.live .',
    keywords: ["xem phim sex vietsub", "sex vietsub không che", "phim sex vietsub sextop1", "phim sex vietsub vlxx hay"],
    canonical,
    page,
    ogImage: "https://ab.quoclamtu.live/uploads/Hau_cung_cua_Karen_Kaede_va_Arata_Arina_Cap_doi_manh_nhat_du_suc_vat_kiet_moi_thanh_nien_664e199481.jpg",
  });
}

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
