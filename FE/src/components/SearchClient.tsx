'use client';

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

const pageSize = 20;

export default function SearchClient() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      try {
        const res = await fetch(
          `/api/movie/search?query=${encodeURIComponent(queryParam)}&page=${page}`,
          
        );

        const data = await res.json();
        setResults(data.data || []);
        setTotalResults(data.total || 0);
      } catch (err) {
        console.error('❌ Lỗi tìm kiếm:', err);
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <div className="text-white">
      {loading ? (
        <p className="text-center my-4 text-lg animate-pulse">Đang tìm kiếm...</p>
      ) : results.length > 0 ? (
        <MovieSection
          title={`Kết quả cho: "${query}"`}
          movies={results}
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/search?query=${encodeURIComponent(query)}`}
        />
      ) : (
        <p className="text-center my-8 text-base md:text-xl">Từ khóa bạn tìm không đúng vui lòng nhập đúng tên phim.😢</p>
      )}
    </div>
  );
}
