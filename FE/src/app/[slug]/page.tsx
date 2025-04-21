'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { IoEye } from 'react-icons/io5'
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike } from "react-icons/bi"
import formatNumber from '@/src/regret/formatNumber'
import VideoPlayer from '@/src/components/VideoPlayer'
import Link from 'next/link'


const Slug = () => {
  const { slug } = useParams()
  const [movies, setMovies] = useState<any[]>([])
  const [activeLinks, setActiveLinks] = useState<{ [key: number]: string }>({})
  const [reactionStatus, setReactionStatus] = useState<{ [key: number]: 'like' | 'dislike' | null }>({})
  const [relatedMovies, setRelatedMovies] = useState<any[]>([])

  const fetchMovie = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies?populate=*&filters[slug][$eq]=${slug}&`)
      const data = await res.json()
      const movieList = data.data || []
      setMovies(movieList)


      if (movieList.length > 0) {
        const movie = movieList[0]
        const movieId = movie.documentId
        const currentViews = Number(movie.views) || 0;

        await axios.put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies/${movieId}`, {
          data: { views: currentViews + 1 },
        })
        fetchRelatedMovies(movie)
      }
    } catch (err) {
      console.error("Error fetching movie or updating views:", err)
    }
  }
  const fetchRelatedMovies = async (movie: any) => {
    try {
      // Get category from the movie object, if it exists
      const categories = ['han_quoc', 'nhat_ban', 'us', 'japan']
      let selectedCategory = ''

      for (const category of categories) {
        if (movie[category]) {
          selectedCategory = category
          break
        }
      }

      if (!selectedCategory) return // Return if no category is found

      // Fetch movies with the same category
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies?populate=*&filters[${selectedCategory}]$eq=true`)
      const data = await res.json()
      const categoryMovies = data.data || []

      // Shuffle the movies and pick 6 random movies
      const shuffledMovies = categoryMovies.sort(() => 0.5 - Math.random())
      const randomSixMovies = shuffledMovies.slice(0, 6)

      setRelatedMovies(randomSixMovies)
    } catch (err) {
      console.error("Error fetching related movies:", err)
    }
  }
  useEffect(() => {
    fetchMovie()
  }, [slug])

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
      await axios.put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/movies/${movieDocId}`, {
        data: {
          likes: newLikes,
          dislikes: newDislikes,
        },
      })
    } catch (err) {
      console.error("Lỗi cập nhật like/dislike:", err)
    }
  }

  if (!movies.length) return <p className="text-white text-center my-16">Loading...</p>

  return (
    <div>
      {movies.map((movie: any) => (
        <div key={movie.documentId} className='text-white mt-16 w-full max-w-4xl mx-auto my-4'>
          <p className='my-8 text-xl '>{movie.name}</p>

          {movie.link_1 || movie.link_2 ? (
            <VideoPlayer
              key={activeLinks[movie.documentId] || movie.link_1 || movie.link_2}
              url={activeLinks[movie.documentId] || movie.link_1 || movie.link_2}
            />
          ) : (
            <p>Không có video</p>
          )}
          {/* {movie.link_1 ? (
            <iframe
              width="420"
              height="315"
              src={activeLinks[movie.documentId] || movie.link_1}
              allowFullScreen
              className="w-full aspect-video rounded-lg shadow-lg"
            />
          ) : (
            <p>Không có video</p>
          )}
 */}
          <div className='flex flex-col md:flex-row gap-4 justify-between'>
            <div className="flex space-x-2 mt-4">
              <button
                className={`p-2 rounded ${activeLinks[movie.documentId] === movie.link_1 ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
                onClick={() => handleLinkChange(movie.documentId, movie.link_1)}
              >
                Link #1
              </button>
              {movie.link_2 && (
                <button
                  className={`p-2 rounded ${activeLinks[movie.documentId] === movie.link_2 ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
                  onClick={() => handleLinkChange(movie.documentId, movie.link_2)}
                >
                  Link #2
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-white">
                <IoEye className='w-6 h-6 mr-1' />
                <span>{formatNumber(movie.views || 0)}</span>
              </div>

              <button onClick={() => handleReaction('like', movie.documentId)} className="flex items-center">
                {reactionStatus[movie.documentId] === 'like' ? (
                  <BiSolidLike className="w-6 h-6 mr-1 text-white" />
                ) : (
                  <BiLike className="w-6 h-6 mr-1 " />
                )}
                <span className="text-white">
                  {formatNumber(movie.likes || 0)}
                </span>

              </button>

              <button onClick={() => handleReaction('dislike', movie.documentId)} className="flex items-center">
                {reactionStatus[movie.documentId] === 'dislike' ? (
                  <BiSolidDislike className="w-6 h-6 mr-1 text-white" />
                ) : (
                  <BiDislike className="w-6 h-6 mr-1 " />
                )}
                <span className="text-white">{formatNumber(movie.dislikes || 0)}</span>
              </button>
            </div>
          </div>

          <br />
          {movie.code && (
            <span className='rounded-lg bg-zinc-700 p-3 mt-1'>{movie.code}</span>
          )}

          <p className="my-8">{movie.description || "Video không có nội dung"}</p>
        </div>
      ))}  <div className="my-16">
        <h2 className="text-white text-base md:text-xl mb-4">Các Phim Với Nội Dung Tương Tự:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {relatedMovies.map((relatedMovie: any) => (

              <Link href={`/${relatedMovie.slug}`} key={relatedMovie.documentId}>
                <div className="relative group overflow-hidden rounded-lg text-sm">
                  <img
                    src={relatedMovie.image?.url}
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
                      {formatNumber(relatedMovie.views || 0)}<IoEye />
                    </div>
                    <div className='flex items-center gap-1'>
                      {formatNumber(relatedMovie.likes || 0)} <BiLike />
                    </div>

                  </div>
                </div>
                <div className="bg-opacity-50 text-white text-sm p-2 truncate whitespace-nowrap overflow-hidden">
                  {relatedMovie.name}

                </div>
              </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Slug
