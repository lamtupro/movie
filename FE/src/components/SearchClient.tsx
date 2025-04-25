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

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState<Movie[]>([]);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies?populate=*&filters[name][$containsi]=${query}`);
        const data = await res.json();
        setResults(data.data || []);
      } catch (err) {
        console.error('❌ Lỗi tìm kiếm:', err);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="text-white">
      {results.length > 0 ? (
        <MovieSection title={`Kết quả cho: ${query}`} movies={results} />
      ) : (
        <p className='text-center my-4 text-2xl'>Không tìm thấy kết quả.</p>
      )}
    </div>
  );
}
