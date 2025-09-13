"use client"
import React, { useEffect, useRef, useState } from 'react';
import { event as gaEvent } from '@/src/lib/gtag';

interface VideoPlayerProps {
    url: string;
    title: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title }) => {
    const [isStarted, setIsStarted] = useState(false);
    const [showMainVideo, setShowMainVideo] = useState(false);
    const [canSkip, setCanSkip] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [watchTime, setWatchTime] = useState(0); // Thời gian xem quảng cáo
    const [videoAds, setVideoAds] = useState<any[]>([]); // cái này chưa chuẩn typescript
    const [isLinkActive, setIsLinkActive] = useState(true); // Trạng thái link còn hiệu lực

    const adRef = useRef<HTMLVideoElement>(null);

    /*  useEffect(() => {
         fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/banners?populate=*&filters[video][$eq]=true`)
             .then(res => res.json())
             .then(data => setVideoAds(data?.data ?? []))
             .catch(err => console.error(err));
     }, []); */

    // Lấy video quảng cáo từ Strapi
    const videoUrl = videoAds.length > 0 ? videoAds[0]?.video_url : ''; // Sửa lại đoạn này
    const adLink = videoAds.length > 0 ? videoAds[0]?.link : ''; // Link quảng cáo

    /*   useEffect(() => {
          let skipTimer: NodeJS.Timeout;
          let watchTimer: NodeJS.Timeout;
  
          if (isStarted && !showMainVideo) {
              // Bắt đầu đếm thời gian xem
              watchTimer = setInterval(() => {
                  setWatchTime((prev) => prev + 1);
              }, 1000);
  
              // Đếm ngược nút skip
              if (!canSkip && countdown > 0) {
                  skipTimer = setTimeout(() => {
                      setCountdown((prev) => prev - 1);
                  }, 1000);
              }
  
              // Sau 5s thì có thể skip
              if (countdown === 0 && !canSkip) {
                  setCanSkip(true);
              }
          }
  
          return () => {
              clearTimeout(skipTimer);
              clearInterval(watchTimer);
          };
      }, [isStarted, countdown, canSkip, showMainVideo]);
  */
    const handleStart = () => {
        if (!isStarted) {
            setIsStarted(true);
        }
    };

    const handleSkipAd = () => {
        setIsLinkActive(false); // Vô hiệu hóa link khi người dùng bỏ qua
        sendWatchTime(); // Gửi thời gian xem khi skip
        setShowMainVideo(true);
        adRef.current?.pause();
    };

    const handleAdEnded = () => {
        setIsLinkActive(false); // Vô hiệu hóa link khi quảng cáo kết thúc
        sendWatchTime(); // Gửi khi xem hết
        setShowMainVideo(true);
    };

    const handleAdClick = (e: React.MouseEvent) => {
        if (isLinkActive) { // Kiểm tra nếu link vẫn còn hiệu lực
            e.stopPropagation();

            // Gửi sự kiện GA khi click vào quảng cáo
            gaEvent({
                action: 'click_videoQC',
                params: {
                    ad_url: videoUrl,
                    ad_redirect: adLink,
                    watch_time: watchTime,
                },
            });

            window.open(adLink, '_blank');
        }
    };

    const sendWatchTime = () => {
        gaEvent({
            action: 'tg_xemQC_video',
            params: {
                ad_url: videoUrl,
                watch_time: watchTime,
            },
        });
    };

    return (
        <div
            className="w-full rounded-lg shadow-lg relative bg-black flex items-center justify-center cursor-pointer"
        /* onClick={handleStart} */
        >
            {/* Trạng thái chờ bắt đầu */}
            {/*  {!isStarted && !showMainVideo && (
                <div className="text-white text-sm opacity-50">
                    <FaPlay className="text-white w-6 h-6" />
                </div>
            )} 

           Quảng cáo 
            {isStarted && !showMainVideo && (
                <div className="absolute inset-0" onClick={handleAdClick}>
                    <video
                        ref={adRef}
                        src={videoUrl} // Sử dụng video URL từ Strapi
                        className="w-full h-full object-cover rounded-lg"
                        autoPlay
                        playsInline
                        muted
                        onEnded={handleAdEnded}
                        controls={false}
                    />
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                        {!canSkip ? (
                            `Tắt quảng cáo trong ${countdown}s`
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSkipAd();
                                }}
                                className="hover:underline"
                            >
                                Bỏ qua quảng cáo
                            </button>
                        )}
                    </div>
                </div>
            )}  */}


            {/* Video chính */}
            {/*  {showMainVideo && ( */}
            <div className="w-full aspect-video rounded-lg shadow-lg relative bg-black overflow-hidden">
                <iframe
                    src={url}
                    title={title}
                    className="inset-0 w-full h-full border-none"
                    allowFullScreen
                ></iframe>
            </div>


            {/* )} */}


        </div>
    );
};

export default VideoPlayer;
