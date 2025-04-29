// app/api/movies/[slug]/route.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { slug: string } }) {
    const slug = params.slug;
   
    console.log("Slug nhận được:", slug)
  
    const apiUrl = `${process.env.STRAPI_API_URL}/api/movies?filters[slug][$eq]=${slug}&populate[actresses][populate]=*`
  
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      }
    })
  
    if (!res.ok) {
      console.error("Lỗi từ Strapi:", await res.text())
      return NextResponse.json({ error: "Failed to fetch movie" }, { status: res.status })
    }
  
    const data = await res.json()
    return NextResponse.json(data)
  }
  