"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IoEye } from "react-icons/io5";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import formatNumber from "@/src/regret/formatNumber";

export default function ReactionsClient({ movie }: { movie: any }) {
  const [views, setViews] = useState(movie.views || 0);
  const [likes, setLikes] = useState(movie.likes || 0);
  const [dislikes, setDislikes] = useState(movie.dislikes || 0);
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);

  // tăng views khi load page
  useEffect(() => {
    const updateViews = async () => {
      try {
        const newViews = views + 1;
        setViews(newViews);
        await axios.put("/api/movie/reactions", {
          movieId: movie.documentId,
          views: newViews,
        });
      } catch (err) {
        console.error("Lỗi cập nhật views:", err);
      }
    };
    updateViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReaction = async (type: "like" | "dislike") => {
    if (reaction === type) return;

    let newLikes = likes;
    let newDislikes = dislikes;

    if (type === "like") {
      newLikes += 1;
      if (reaction === "dislike") newDislikes = Math.max(dislikes - 1, 0);
    } else {
      newDislikes += 1;
      if (reaction === "like") newLikes = Math.max(likes - 1, 0);
    }

    setLikes(newLikes);
    setDislikes(newDislikes);
    setReaction(type);

    try {
      await axios.put("/api/movie/reactions", {
        movieId: movie.documentId,
        likes: newLikes,
        dislikes: newDislikes,
      });
    } catch (err) {
      console.error("Lỗi cập nhật reactions:", err);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <div className="flex items-center text-white">
        <IoEye className="w-6 h-6 mr-1" />
        <span>{formatNumber(views)}</span>
      </div>

      <button onClick={() => handleReaction("like")} className="flex items-center">
        {reaction === "like" ? (
          <BiSolidLike className="w-6 h-6 mr-1 text-white" />
        ) : (
          <BiLike className="w-6 h-6 mr-1" />
        )}
        <span className="text-white">{formatNumber(likes)}</span>
      </button>

      <button onClick={() => handleReaction("dislike")} className="flex items-center">
        {reaction === "dislike" ? (
          <BiSolidDislike className="w-6 h-6 mr-1 text-white" />
        ) : (
          <BiDislike className="w-6 h-6 mr-1" />
        )}
        <span className="text-white">{formatNumber(dislikes)}</span>
      </button>
    </div>
  );
}
