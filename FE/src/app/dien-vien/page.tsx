import Pagenation from '@/src/components/Pagination';
import Link from 'next/link';
import React from 'react'

const pageSize = 20; // Số phim mỗi trang
const maxPages = 5; // Chỉ lấy tối đa 5 trang => 100 phim
const getAcctress = async (page: number) => {
    if (page > maxPages) {
        return { actresses: [], total: pageSize * maxPages };
    }
    try {
        const res = await fetch(
            `${process.env.STRAPI_API_URL}/api/actresses?populate=*&filters[display][$eq]=true&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,  // Thêm dòng này
                },
                /* next: { revalidate: 3600 } */
            }
        );

        if (!res.ok) throw new Error('Fetch failed');

        const data = await res.json();
        return {
            actresses: data.data || [],
            total: Math.min(data.meta?.pagination?.total || 0, pageSize * maxPages), // giới hạn tối đa 100 phim
        };
    } catch (err) {
        console.error('❌ Lỗi fetch phim hay:', err);
        return { actresses: [], total: 0 };
    }
};

export default async function ActressPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const searchParamsResolved = await searchParams;
    const currentPage = Math.min(parseInt(searchParamsResolved.page || '1', 10) || 1, maxPages); // không cho vượt trang 5

    const { actresses, total } = await getAcctress(currentPage);
    const totalPages = Math.ceil(total / pageSize);

    if (!actresses || actresses.length === 0) {
        return (
            <p className="text-white text-center py-10 text-xl">
                Không tìm thấy trang hoặc dữ liệu không tồn tại 😢
            </p>
        );
    }

    return (
        <Pagenation title="Top Diễn Viên Hot Nhật Hiện Nay"
            actresses={actresses}
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/dien-vien"
        />
    )
}
