'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MovieSection from '@/src/components/MovieSection';

type Movie = {
  id: number;
  name: string;
  title?: string;
  slug: string;
  image?: string;
  views?: number;
  likes?: number;
};

const pageSize = 20; // Số phim mỗi trang

export default function SearchClient() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const queryParam = searchParams.get('query') || '';
    const pageParam = searchParams.get('page') || '1';
    const page = parseInt(pageParam, 10) || 1;

    setQuery(queryParam);
    setCurrentPage(page);

    if (!queryParam) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies?populate=*&filters[name][$containsi]=${encodeURIComponent(queryParam)}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        setResults(data.data || []);
        setTotalResults(data.meta?.pagination?.total || 0);
      } catch (err) {
        console.error('❌ Lỗi tìm kiếm:', err);
      }
    };

    fetchResults();
  }, [searchParams]); // 🔥 Dependency chuẩn

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <div className="text-white">
      {results.length > 0 ? (
        <MovieSection
          title={`Kết quả cho: "${query}"`}
          movies={results}
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/search?query=${encodeURIComponent(query)}`}
        />
      ) : (
        <p className="text-center my-4 text-2xl">Không tìm thấy kết quả.</p>
      )}
    </div>
  );
}
