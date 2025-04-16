"use client"

import React, { useState } from 'react'
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { BiLike } from "react-icons/bi"
import { IoEye } from 'react-icons/io5'
import Link from 'next/link';
import formatNumber from '../regret/formatNumber';

const MovieSection = ({ title, movies }: {
  title: string;
  movies: any[];
}) => {

const [currentPage, setCurrentPage] = useState<number>(1);
  const moviesPerPage: number = 15;
  const totalPages: number = Math.ceil(movies.length / moviesPerPage);

  // Pagination Logic
  const indexOfLastMovie: number = currentPage * moviesPerPage;
  const indexOfFirstMovie: number = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((page, index) =>
      typeof page === 'number' ? (
        <button
          key={index}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 rounded ${currentPage === page ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}
        >
          {page}
        </button>
      ) : (
        <span key={index} className="px-3 py-1 text-gray-500">...</span>
      )
    );
  };
  return (
    <div className="bg-[#0F0F10] py-8">
    <div className="container mx-auto px-2 md:px-4">
      <h2 className='text-2xl text-white my-4'>{title}</h2>
      {/* List Phim */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-y-10 gap-x-4">
        {currentMovies.map((movie) => (
          <Link href={`/${movie.slug}`} key={movie.id}>
            <div className="relative group overflow-hidden rounded-lg text-sm">
              <img
                src={movie.image}
                alt={movie.title}
                width={300}
                height={200}
                className="w-full md:h-48 sm:40 h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
              />
              {movie.title && (
                <span className="absolute top-2 left-2 bg-stone-900 bg-opacity-40 text-white text-xs px-2 py-1 rounded">
                  {movie.title || ''}
                </span>
              )}

              <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 md:gap-4 bg-black bg-opacity-50 text-white text-sm p-2 truncate whitespace-nowrap overflow-hidden">
                <div className='flex items-center gap-1'>
                  {formatNumber(movie.views || 0)}<IoEye />
                </div>
                <div className='flex items-center gap-1'>
                  {formatNumber(movie.likes || 0)} <BiLike />
                </div>

              </div>
            </div>
            <div className="  bg-opacity-50 text-white text-sm p-2 truncate whitespace-nowrap overflow-hidden">
              {movie.name}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      < div className="mt-6 flex justify-center space-x-2" >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded bg-gray-700 text-white"
          disabled={currentPage === 1}
        >
          <HiChevronLeft />
        </button>

        {renderPageNumbers()}

        < button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded bg-gray-700 text-white"
          disabled={currentPage === totalPages}
        >
          <HiChevronRight />
        </button>
      </div>
    </div>
  </div >
  )
}

export default MovieSection