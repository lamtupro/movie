'use client';

import { IoEye } from 'react-icons/io5';
import { BiLike } from 'react-icons/bi';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import formatNumber from '../regret/formatNumber';

interface Movie {
  id: number | string;
  name: string;
  slug: string;
  image?: { url: string };
  views?: number | string;
  likes?: number | string;
  title?: string;
}

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  basePath: string;
}

// ======================= MovieSection =======================
const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  movies,
  currentPage,
  totalPages,
  basePath,
}) => {
  const buildPageUrl = (page: number) =>
    basePath.includes('?') ? `${basePath}&page=${page}` : `${basePath}?page=${page}`;

  const getPagination = () => {
    const delta = 1;
    const range: number[] = [];
    const pages: (number | string)[] = [];
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    let lastPage = 0;
    for (const page of range) {
      if (lastPage !== 0 && page - lastPage > 1) {
        pages.push('...');
      }
      pages.push(page);
      lastPage = page;
    }

    return pages;
  };

  return (
    <div className="bg-[#0F0F10] py-2">
      <div className="container mx-auto px-2 md:px-4">
        <h1 className="md:text-2xl text-xl text-white my-4">{title}</h1>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-y-4 md:gap-y-8 gap-x-4">
          {movies.map((movie) => {
            const imgUrl = movie.image?.url || '';
            const srcImg = imgUrl.startsWith('http')
              ? imgUrl
              : process.env.NEXT_PUBLIC_STRAPI_API_URL + imgUrl;

            return <MovieCard key={movie.id} movie={movie} srcImg={srcImg} />;
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2 flex-wrap">
            {getPagination().map((page, idx) =>
              typeof page === 'number' ? (
                <Link
                  key={idx}
                  href={buildPageUrl(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'
                  }`}
                >
                  {page}
                </Link>
              ) : (
                <span key={idx} className="px-3 py-1 text-white">
                  {page}
                </span>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ======================= MovieCard =======================
interface MovieCardProps {
  movie: Movie;
  srcImg: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, srcImg }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link href={`/${movie.slug}`} title={movie.name}>
      <div className="relative group overflow-hidden rounded-lg text-sm">
        <div className="relative">
          {/* Skeleton shimmer chỉ che ảnh */}
          {!loaded && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
          )}

          <Image
            src={srcImg}
            alt={movie.name}
            width={300}
            height={200}
            loading="lazy"
            className={`w-full h-40 md:h-48 object-cover rounded-lg transition-transform duration-500 ${
              loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } group-hover:scale-105`}
            onLoadingComplete={() => setLoaded(true)}
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
      </div>
    </Link>
  );
};

export default MovieSection;
