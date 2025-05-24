// next-sitemap.config.js
const STRAPI_API_URL = process.env.STRAPI_API_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

module.exports = {
  siteUrl: 'https://quoclamtu.live',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
   additionalPaths: async (config) => {
    const paths = [];

    // ✅ Trang chủ
    paths.push({
      loc: '/',
      changefreq: 'daily',
      priority: 1.0,
    });

    const staticPages = [
      '/phim-hay',
      '/au-my',
      '/viet-sub',
      '/vung-trom',
      '/gai-xinh',
      '/han-quoc',
      '/hiep-dam',
      '/khong-che',
      '/nhat-ban',
      '/tap-the',
      '/trung-quoc',
    ];

    staticPages.forEach((page) => {
      paths.push({
        loc: page,
        changefreq: 'weekly',
        priority: 0.9,
      });
    });

    // ✅ Fetch phim từ API
    const pageSize = 100; // Tùy số lượng bạn muốn lấy
    const res = await fetch(`${STRAPI_API_URL}/api/movies?pagination[pageSize]=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    });

    const data = await res.json();
    const movies = data.data || [];

    movies.forEach((movie) => {
      const slug = movie.slug; // hoặc dùng `id` nếu không có slug

      paths.push({
        loc: `/${slug}`,
        changefreq: 'weekly',
        priority: 0.8,
      });
    });

    return paths;
  },
  sitemapSize: 5000,
  exclude: ['/search','/bao-tri'],
}
