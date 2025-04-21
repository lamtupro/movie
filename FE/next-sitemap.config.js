/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://quoclamtu.live',
    generateRobotsTxt: true, // Tự tạo robots.txt
    changefreq: 'weekly', // Tần suất cập nhật
    priority: 0.7,         // Độ ưu tiên các trang
    sitemapSize: 5000,     // Tối đa số URL mỗi file sitemap
  }
  