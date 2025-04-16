import SearchClient from '@/src/components/SearchClient';
import { Suspense } from 'react';

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-white p-6">Đang tìm kiếm...</p>}>
      <SearchClient />
    </Suspense>
  );
}
