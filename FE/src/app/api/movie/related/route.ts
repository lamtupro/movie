import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const movie = body.movie

    const categories = ['vietsub', 'han_quoc', 'nhat_ban', 'us', 'trung_quoc']
    let selectedCategory = ''

    for (const category of categories) {
      if (movie[category]) {
        selectedCategory = category
        break
      }
    }

    if (!selectedCategory) {
      return NextResponse.json({ data: [] }, { status: 200 })
    }

    const strapiRes = await fetch(
      `${process.env.STRAPI_API_URL}/api/movies?populate=*&filters[${selectedCategory}][$eq]=true&filters[documentId][$ne]=${movie.documentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    )

    const result = await strapiRes.json()
    const relatedMovies = result.data || []

    // Trộn và lấy 6 phim ngẫu nhiên
    const shuffled = relatedMovies.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 6)

    return NextResponse.json({ data: selected })
  } catch (err) {
    console.error('Error in related movies API:', err)
    return NextResponse.json({ error: 'Failed to fetch related movies' }, { status: 500 })
  }
}
