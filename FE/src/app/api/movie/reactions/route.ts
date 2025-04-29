// app/api/movies/reactions/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { movieId, views, likes, dislikes } = body

   
    if (!movieId) {
      return NextResponse.json({ error: 'Missing movieId' }, { status: 400 })
    }

    const updateData: any = {}
    if (views !== undefined) updateData.views = views
    if (likes !== undefined) updateData.likes = likes
    if (dislikes !== undefined) updateData.dislikes = dislikes

    const res = await fetch(`${process.env.STRAPI_API_URL}/api/movies/${movieId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({ data: updateData }),
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Error updating movie:', err)
    return NextResponse.json({ error: 'Failed to update movie' }, { status: 500 })
  }
}
