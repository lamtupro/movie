/* 'use client'; ảnh hưởng client side */ 

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { IoEye } from 'react-icons/io5';
import { BiLike } from 'react-icons/bi';
import Link from 'next/link';
import Image from 'next/image';
import formatNumber from '../regret/formatNumber';

const MovieSection = ({
  title,
  movies,
  currentPage,
  totalPages,
  basePath,
}: {
  title: string;
  movies: any[];
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
        <h1 className="md:text-2xl text-xl text-white my-4">{title}</h1>

        {/* List phim */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-y-4 md:gap-y-8 gap-x-4">
          {movies.map((movie) => {
            const imgUrl = movie.image?.url;
            const srcImg = imgUrl.startsWith('http') ? imgUrl : process.env.NEXT_PUBLIC_STRAPI_API_URL + imgUrl;
            return (
              <Link href={`/${movie.slug}`} key={movie.id} title={movie.name}>
                <div className="relative group overflow-hidden rounded-lg text-sm">
                  <Image
                    src={srcImg}
                    alt={movie.name}
                    width={300}
                    height={200}
                    loading="lazy"
                    className="w-full h-40 md:h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
                  />

                  {movie.title && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {movie.title}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 bg-black bg-opacity-50 text-white text-sm p-2">
                    <div className="flex items-center gap-1">
                      {formatNumber(Number(movie.views) || 0)} <IoEye />
                    </div>
                    <div className="flex items-center gap-1">
                      {formatNumber(Number(movie.likes) || 0)} <BiLike />
                    </div>
                  </div>
                </div>
                <h2 className="text-white text-sm p-2 truncate">
                  {movie.name}
                </h2>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            {renderPageNumbers()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSection;
