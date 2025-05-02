// app/api/movie/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }  // ✅ KHÔNG phải Promise
) {
  const slugResolve = await params
  const slug = slugResolve.slug

  const apiUrl = `${process.env.STRAPI_API_URL}/api/movies?filters[slug][$eq]=${slug}&populate=*`

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Lỗi từ Strapi:", errorText)
      return NextResponse.json({ error: "Failed to fetch movie" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Error fetching movie:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
