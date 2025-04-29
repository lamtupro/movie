// app/components/Banner.tsx
import Image from "next/image";
import Link from "next/link";

async function fetchBanners() {
    try {
        const apiUrl = process.env.STRAPI_API_URL;
        const token = process.env.STRAPI_API_TOKEN;

        if (!apiUrl || !token) {
            console.error("Thiếu STRAPI_API_URL hoặc STRAPI_API_TOKEN");
            return [];
        }
        const res = await fetch(`${process.env.STRAPI_API_URL}/api/banners?filters[banner_top][$eq]=true&populate=*`, {
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            },
            cache: 'no-store',
        });
        const data = await res.json();
        if (Array.isArray(data?.data)) {
            return data.data;
        } else {
            console.warn('Không có banner top hoặc lỗi định dạng:', data);
            return [];
        }
    } catch (err) {
        console.error('Lỗi fetch banner:', err);
        return [];
    }
}


const TopBanner = async () => {
    const banners = await fetchBanners();
    if (banners.length === 0) {
        console.log("không có banner")
    }
    return (
        <div className="container relative mx-auto flex flex-col gap-4 px-4 my-4">
            {banners.map((banner: any, index: number) => {
                const imageUrl = `${process.env.STRAPI_API_URL}${banner.image_url.url}`;

                return (
                    <div key={index} className="relative w-full md:h-32 h-16 flex flex-col gap-2 rounded-lg">
                        <div className="relative w-full h-32 rounded-lg hover:scale-105 transition-transform duration-300">
                            {banner.image_url && (
                                <Link href={`${banner.link}`} target="_blank" onClick={() => {
                                    /*  if (typeof window !== "undefined" && window.gtag) {
                                       window.gtag('event', 'click_QC_tren', {
                                         event_category: 'Ads',
                                         banner_id: banner.documentId,
                                         ten_NC: banner.name || 'Unnamed Banner',
                                         value: 1,
                                         banner_link: banner.link
                                       });
                                     } */
                                }}>
                                    <Image
                                        src={imageUrl || ""}
                                        alt={banner.name}
                                        layout="fill"
                                        className="rounded-lg"
                                    />
                                </Link>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TopBanner;
