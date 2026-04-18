import { MetadataRoute } from 'next'

// 🔥 dominio dinámico (PRO)
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://tu-dominio.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',

        // 🔥 LO IMPORTANTE: permitir contenido indexable
        allow: [
          '/',
          '/cars/',
          '/compare/',
          '/best-cars/',
        ],

        disallow: [
          // 🔥 APIs (correcto)
          '/api/',

          // 🔥 sistema interno
          '/_next/',
          '/admin',

          // 🔥 páginas sin valor SEO
          '/search',
        ],
      },

      // 🔥 bots específicos (opcional pero pro)
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],

    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}