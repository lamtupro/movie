// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

const STRAPI_API_URL = process.env.STRAPI_API_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (!query) {
    return NextResponse.json(
      { data: [], total: 0 },
      { status: 200 }
    );
  }

  const strapiUrl = `${STRAPI_API_URL}/api/movies?populate=*&filters[name][$containsi]=${encodeURIComponent(query)}&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`;

  try {
    const res = await fetch(strapiUrl, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Strapi fetch failed' },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      data: data.data || [],
      total: data.meta?.pagination?.total || 0,
    });
  } catch (err) {
    console.error('❌ Lỗi từ API route:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
