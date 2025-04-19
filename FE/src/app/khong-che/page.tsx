'use client'

import MovieSection from '@/src/components/MovieSection'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [movies, setMovies] = useState([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

 
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies?populate=*&filters[khong_che][$eq]=true&sort=createdAt:desc`)

        if (!res.ok) throw new Error("Fetch failed")

        const data = await res.json()

        if (!data || !data.data || data.data.length === 0) {
          setError(true)
        } else {
          setMovies(data.data)
        }
      } catch (err) {
        console.error("❌ Lỗi fetch phim Không Che:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) return <p className="text-white text-center py-10">Đang tải dữ liệu...</p>

  if (error) return <p className="text-white text-center py-10 text-xl">Không tìm thấy trang hoặc dữ liệu không tồn tại 😢</p>

  
  return (
    <MovieSection title='List Phim Không Che' movies={movies}/>
  )
}

export default page