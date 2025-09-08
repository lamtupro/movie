import { Metadata } from "next";

interface SeoOptions {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    page?: number;
    ogImage?: string;
}

export function generateSeoMetadata({
    title,
    description,
    keywords = [],
    canonical,
    page,
    ogImage,
}: SeoOptions): Metadata {
    const finalTitle =
        page && page > 1 ? `${title} - Trang ${page}` : title;

    return {
        title: finalTitle,
        description,
        keywords,
        alternates: {
            canonical: canonical,
        },
        openGraph: {
            title: finalTitle,
            description,
            url: canonical,
            type: "website",
            images: [
                {
                    url: ogImage || "https://ab.quoclamtu.live/uploads/Asset_16_2d17f6737b.png",
                    width: 1200,
                    height: 630,
                    alt: finalTitle,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: finalTitle,
            description,
        },
    };
}
