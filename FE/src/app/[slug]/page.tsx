'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { IoEye } from 'react-icons/io5'
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike } from "react-icons/bi"
import formatNumber from '@/src/regret/formatNumber'
import VideoPlayer from '@/src/components/VideoPlayer'
import Link from 'next/link'
import Head from 'next/head'
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Image from 'next/image'


const Slug = () => {
  const { slug } = useParams()
  const [movies, setMovies] = useState<any[]>([])
  const [activeLinks, setActiveLinks] = useState<{ [key: number]: string }>({})
  const [reactionStatus, setReactionStatus] = useState<{ [key: number]: 'like' | 'dislike' | null }>({})
  const [relatedMovies, setRelatedMovies] = useState<any[]>([])
  const [banners, setBanners] = useState([])

  const fetchMovie = async () => {
    try {
      const res = await fetch(`/api/movie/${slug}`)
      const data = await res.json()
      const movieList = data.data || []
      setMovies(movieList)

      if (movieList.length > 0) {
        const movie = movieList[0]
        const movieId = movie.documentId  // ✅ Sử dụng ID từ Strapi
        const currentViews = Number(movie.views || 0)

        await axios.put('/api/movie/reactions', {
          movieId,
          views: currentViews + 1,
        })
        fetchRelatedMovies(movie)
      }

    } catch (err) {
      console.error("Error fetching movie or updating views:", err)
    }
  }

  const fetchRelatedMovies = async (movie: any) => {
    try {
      const res = await fetch('/api/movie/related', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie }),
        next: { revalidate: 3600 }
      })

      const data = await res.json()
      const related = data.data || []

      setRelatedMovies(related)
    } catch (err) {
      console.error('Error fetching related movies:', err)
    }
  }
  useEffect(() => {
  const fetchData = async () => {
    await fetchMovie();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/banners?filters[banner_below_video][$eq]=true&populate=*`);
      const data = await res.json();

      if (Array.isArray(data?.data)) {
        setBanners(data.data);
      } else {
        setBanners([]);
      }
    } catch (err) {
      console.error('Lỗi fetch banner:', err);
      setBanners([]);
    }
  };

  fetchData();
}, [slug]);

  const handleLinkChange = (id: number, link: string) => {
    setActiveLinks(prev => ({ ...prev, [id]: link }))
  }

  const handleReaction = async (type: 'like' | 'dislike', movieDocId: number) => {
    const targetMovie = movies.find(m => m.documentId === movieDocId)
    if (!targetMovie) return

    const currentReaction = reactionStatus[movieDocId] || null
    if (currentReaction === type) return

    const currentLikes = targetMovie.likes || 0
    const currentDislikes = targetMovie.dislikes || 0

    let newLikes = currentLikes
    let newDislikes = currentDislikes
    let newReaction: 'like' | 'dislike' | null = currentReaction

    if (type === 'like') {
      newLikes += 1
      if (currentReaction === 'dislike') newDislikes = Math.max(currentDislikes - 1, 0)
      newReaction = 'like'
    } else {
      newDislikes += 1
      if (currentReaction === 'like') newLikes = Math.max(currentLikes - 1, 0)
      newReaction = 'dislike'
    }

    setMovies(prev =>
      prev.map(movie =>
        movie.documentId === movieDocId
          ? { ...movie, likes: newLikes, dislikes: newDislikes }
          : movie
      )
    )
    setReactionStatus(prev => ({ ...prev, [movieDocId]: newReaction }))

    try {
      await axios.put('/api/movie/reactions', {
        movieId: movieDocId,
        likes: newLikes,
        dislikes: newDislikes,
      })
    } catch (err) {
      console.error("Lỗi cập nhật like/dislike:", err)
    }
  }


  if (!movies.length) return <p className="text-white text-center my-16">Loading...</p>

  const movie = movies[0]


  return (
    <>
      <Head>
        <link rel="canonical" href={`https://quoclamtu.live/${slug}`} />
        <title>{movie.name} | Xem phim chất lượng cao</title>
        <meta name="description" content={movie.description || "Xem phim sex VLXX chất lượng, tốc độ cao, không quảng cáo"} />
        <meta property="og:title" content={movie.name} />
        <meta property="og:description" content={movie.description || "Phim hấp dẫn, nội dung lôi cuốn"} />
        {movie.image?.url && <meta property="og:image" content={movie.image.url} />}
      </Head>

      <main className="text-white mt-16 w-full container mx-auto my-4 px-2">
        <h1 className="my-8 text-xl font-semibold">{movie.name}</h1>

        {movie.link_1 || movie.link_2 ? (
          <VideoPlayer
            key={activeLinks[movie.documentId] || movie.link_1 || movie.link_2}
            url={activeLinks[movie.documentId] || movie.link_1 || movie.link_2}
          />
        ) : (
          <p>Không có video</p>
        )}

        <div className='flex flex-wrap gap-4 justify-between'>
          <div className="flex items-center space-x-2  mt-4">
            <button
              className={`p-2 rounded  ${activeLinks[movie.documentId] === movie.link_1 ? 'bg-gray-700' : 'bg-gray-700'} text-white`}
              onClick={() => handleLinkChange(movie.documentId, movie.link_1)}
            >
              #1
            </button>
            {movie.link_2 && (
              <button
                className={`p-2 rounded ${activeLinks[movie.documentId] === movie.link_2 ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
                onClick={() => handleLinkChange(movie.documentId, movie.link_2)}
              >
                #2
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-white">
              <IoEye className='w-6 h-6 mr-1' />
              <span>{formatNumber(Number(movie.views) || 0)}</span>
            </div>

            <button onClick={() => handleReaction('like', movie.documentId)} className="flex items-center">
              {reactionStatus[movie.documentId] === 'like' ? (
                <BiSolidLike className="w-6 h-6 mr-1 text-white" />
              ) : (
                <BiLike className="w-6 h-6 mr-1 " />
              )}
              <span className="text-white">
                {formatNumber(Number(movie.likes) || 0)}
              </span>

            </button>

            <button onClick={() => handleReaction('dislike', movie.documentId)} className="flex items-center">
              {reactionStatus[movie.documentId] === 'dislike' ? (
                <BiSolidDislike className="w-6 h-6 mr-1 text-white" />
              ) : (
                <BiDislike className="w-6 h-6 mr-1 " />
              )}
              <span className="text-white">{formatNumber(Number(movie.dislikes) || 0)}</span>
            </button>
          </div>
        </div>

        <div className="container relative mx-auto flex flex-col gap-4 my-4">
          {banners.map((banner: any, index) => {
            const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${banner.image_url?.url}`;
            return (
              <div key={index} className="relative w-full md:h-32 h-16 flex flex-col gap-2 rounded-lg">
                <div className="relative w-full h-32 rounded-lg hover:scale-105 transition-transform duration-300">
                  {banner.image_url && (
                    <a href={`${banner.link}`} target="_blank" rel="noopener noreferrer"
                    >
                      <Image
                        src={imageUrl || ""}    /* src={banner.image_url.url || ""} */
                        alt={banner.name}
                        layout="fill"
                        className="rounded-lg"
                        unoptimized
                      />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div> 
        {movie.code && (
          <div className="my-4">
            <h2 className="text-lg font-semibold text-[#FEA016]">Code:</h2>
            <span className="inline-block bg-[#58585c] text-white px-4 py-2 rounded-full text-sm tracking-wide shadow">
              {movie.code}
            </span>
          </div>
        )}
        {movie.actresses && movie.actresses.length > 0 && (
          <div className="my-4">
            <h2 className="text-lg font-semibold text-[#FEA016] mb-2">Diễn viên:</h2>
            <ul className="flex flex-wrap gap-2">

              {movie.actresses.map((actress: any) => (
                <Link href={`/dien-vien/${actress.slug}`} key={actress.documentId}>
                  <li>
                    <span className="inline-block bg-[#58585c] text-white font-serif px-3 py-1 rounded-full text-sm hover:bg-red-5 00 transition">
                      {actress.name}
                    </span>
                  </li>
                </Link>
              ))}


            </ul>
          </div>
        )}


        {movie.description && (
          <div className="my-8">
            <h2 className="text-lg font-semibold mb-2 text-[#FEA016]">Nội dung phim</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">{movie.description}</p>
          </div>
        )}

      </main>
      <div className="my-16 container w-full md:mx-auto px-2">
        <h2 className="text-white text-base md:text-xl mb-4">Các Phim Với Nội Dung Tương Tự:</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedMovies.map((relatedMovie: any) => {
            const imgUrl = relatedMovie.image?.url;
            const srcImg = imgUrl.startsWith('http') ? imgUrl : process.env.NEXT_PUBLIC_STRAPI_API_URL + imgUrl;
            return (

              <Link href={`/${relatedMovie.slug}`} key={relatedMovie.documentId}>
                <div className="relative group overflow-hidden rounded-lg text-sm">
                  <img
                    src={srcImg}
                    alt={relatedMovie.title}
                    width={300}
                    height={200}
                    className="w-full md:h-48 sm:40 h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
                  />
                  {relatedMovie.title && (
                    <span className="absolute top-2 left-2 bg-red-600  text-white text-xs px-2 py-1 rounded-xl">
                      {relatedMovie.title || ''}
                    </span>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 md:gap-4 bg-black bg-opacity-50 text-white text-sm p-2 truncate whitespace-nowrap overflow-hidden">
                    <div className='flex items-center gap-1'>
                      {formatNumber(Number(relatedMovie.views) || 0)} <IoEye />
                    </div>
                    <div className='flex items-center gap-1'>
                      {formatNumber(Number(relatedMovie.likes) || 0)} <BiLike />
                    </div>

                  </div>
                </div>
                <div className="bg-opacity-50 text-white text-sm p-2 truncate whitespace-nowrap overflow-hidden">
                  {relatedMovie.name}

                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="flex justify-center my-6">
        <Link
          href="/"
          className="flex items-center gap-2  bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-3xl shadow-md transition duration-300 tracking-wide"
        >
          <IoArrowBackCircleOutline className='w-6 h-6' /> Trang chủ
        </Link>
      </div>

    </>
  )
}

export default Slug