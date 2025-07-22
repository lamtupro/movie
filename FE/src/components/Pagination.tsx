'use client';

import Link from 'next/link';

const Pagenation = ({
    title,
    actresses,
    currentPage,
    totalPages,
    basePath,
}: {
    title: string;
    actresses: any[];
    currentPage: number;
    totalPages: number;
    basePath: string;
}) => {

    const buildPageUrl = (page: number) => {
        if (basePath.includes('?')) {
            return `${basePath}&page=${page}`;
        }
        return `${basePath}?page=${page}`;
    };

    const getPagination = () => {
        const delta = 1;
        const pages: (number | string)[] = [];

        const left = currentPage - delta;
        const right = currentPage + delta;

        const range = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= left && i <= right)) {
                range.push(i);
            }
        }

        let lastPage = 0;
        for (const page of range) {
            if (lastPage !== 0 && (page as number) - lastPage > 1) {
                pages.push('...');
            }
            pages.push(page);
            lastPage = page as number;
        }

        return pages;
    };

    const renderPageNumbers = () => {
        const pages = getPagination();

        return (
            <div className="flex justify-center space-x-2 flex-wrap">
                {pages.map((page, index) => (
                    typeof page === 'number' ? (
                        <Link
                            key={index}
                            href={buildPageUrl(page)}
                            className={`px-3 py-1 rounded ${currentPage === page ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}
                        >
                            {page}
                        </Link>
                    ) : (
                        <span key={index} className="px-3 py-1 text-white">
                            {page}
                        </span>
                    )
                ))}
            </div>
        );
    };

    return (
        <div className="bg-[#0F0F10] py-2">
            <div className="container mx-auto px-2 md:px-4">
                <h2 className="md:text-2xl text-xl text-white my-4">{title}</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-y-4 md:gap-y-8 gap-x-4">
                    {actresses.map((actress: any) => {
                        const imgUrl = actress.avatar?.url;
                        const srcImg = imgUrl
                            ? imgUrl.startsWith('http')
                                ? imgUrl
                                : process.env.NEXT_PUBLIC_STRAPI_API_URL + imgUrl
                            : '/no-image.jpeg';
                        return (
                            <Link href={`/dien-vien/${actress.slug}`} key={actress.id} title={actress.name}>
                                <div className="relative group overflow-hidden rounded-lg text-sm">
                                    <img
                                        src={srcImg}
                                        alt={actress.name}
                                        width={300}
                                        height={200}
                                        loading="lazy"
                                        className="w-full h-40 md:h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
                                    />

                                </div>
                                <h1 className="text-white text-sm text-center p-2 truncate">
                                    {actress.name}
                                </h1>
                            </Link>
                        );
                    })}
                </div>
                {totalPages > 1 && (
                    <div className="mt-6">
                        {renderPageNumbers()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pagenation;
