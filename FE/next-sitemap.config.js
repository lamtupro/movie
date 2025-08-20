// next-sitemap.config.js
const STRAPI_API_URL = process.env.STRAPI_API_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

module.exports = {
  siteUrl: 'https://quoclamtu.live',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/search', '/bao-tri'],

  // 🔑 Tất cả logic build path + image để ở đây
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },

  additionalPaths: async (config) => {
    const paths = [];

    // ✅ Trang chủ
    paths.push(await config.transform(config, '/'));

    // ✅ Các trang tĩnh
    const staticPages = [
      '/phim-hay',
      '/au-my',
      '/viet-sub',
      '/gai-xinh',
      '/han-quoc',
      '/nhat-ban',
      '/vung-trom',
      '/hiep-dam',
      '/khong-che',
      '/tap-the',
      '/trung-quoc',
    ];
    for (const page of staticPages) {
      paths.push(await config.transform(config, page));
    }
 const pageSize = 100; // an toàn, nhỏ hơn 700
    let page = 1;
    let totalPages = 1;

    do {
      const res = await fetch(
        `${STRAPI_API_URL}/api/movies?populate=image&sort=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
        }
      );

      const data = await res.json();
      const movies = data.data || [];
      totalPages = Math.ceil((data.meta?.pagination?.total || 0) / pageSize);

      for (const movie of movies) {
        const slug = movie.slug;
        const name = movie.name;
        const desc = movie.description;

        const imgUrl =
          movie.image?.formats?.medium?.url ||
          movie.image?.formats?.small?.url ||
          movie.image?.url;

        const srcImg = imgUrl?.startsWith('http')
          ? imgUrl
          : `${STRAPI_API_URL}${imgUrl}`;

        paths.push({
          loc: `/${slug}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: new Date().toISOString(),
          images: srcImg
            ? [
                {
                  loc: {href: srcImg }, // ✅ string, không object
                  title: name || '',
                  caption: desc ? desc.slice(0, 150) : '',
                },
              ]
            : [],
        });
      }

      page++;
    } while (page <= totalPages);

    return paths;
  },

  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'black-listed-bot', disallow: ['/bao-tri'] },
    ],
  },
};
