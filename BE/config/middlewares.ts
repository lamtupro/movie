export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'https://quoclamtu.live', 
        'https://www.quoclamtu.live',
        'http://localhost:3000'
      ], // 🔥 Chỉ cho phép domain này
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      headers: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
