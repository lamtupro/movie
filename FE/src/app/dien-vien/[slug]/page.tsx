'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MovieSection from '@/src/components/MovieSection'

const Slug = () => {
  const { slug } = useParams()
  const [actress, setActress] = useState<any>(null)  // Chỉ lưu 1 diễn viên thay vì mảng

  const fetchActress = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/actresses?filters[slug][$eq]=${slug}&populate[movies][populate]=*`
      )
      const data = await res.json()
      const actressData = data.data?.[0] || null  // Lấy đối tượng diễn viên đầu tiên
      setActress(actressData)  // Lưu diễn viên vào state

    } catch (err) {
      console.error("Error fetching actress:", err)
    }
  }

  useEffect(() => {
    fetchActress()
  }, [slug])

  // Kiểm tra nếu không có dữ liệu
  if (!actress) {
    return <p className="text-white text-center py-10 text-xl">Không tìm thấy diễn viên hoặc dữ liệu không tồn tại 😢</p>
  }

  return (
    <>
  
      <MovieSection title={`Phim của ${actress.name}`} movies={actress.movies || []} />
    </>
  )
}

export default Slug
