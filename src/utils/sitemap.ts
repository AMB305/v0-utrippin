export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (entries: SitemapEntry[]): string => {
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
};

export const getStaticPages = (): SitemapEntry[] => {
  const baseUrl = 'https://utrippin.ai';
  const lastmod = new Date().toISOString().split('T')[0];

  return [
    // Homepage
    {
      url: baseUrl,
      lastmod,
      changefreq: 'daily',
      priority: 1.0
    },
    // Main service pages
    {
      url: `${baseUrl}/flights`,
      lastmod,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/hotels`,
      lastmod,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/cars`,
      lastmod,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/packages`,
      lastmod,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/experiences`,
      lastmod,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/cruises`,
      lastmod,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/deals`,
      lastmod,
      changefreq: 'daily',
      priority: 0.9
    },
    // AI and premium features
    {
      url: `${baseUrl}/ai-travel`,
      lastmod,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/premium`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.7
    },
    // User features
    {
      url: `${baseUrl}/travel-buddies`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/trips`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.7
    },
    // Content pages
    {
      url: `${baseUrl}/blog`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/events`,
      lastmod,
      changefreq: 'daily',
      priority: 0.6
    },
    // Utility pages
    {
      url: `${baseUrl}/widgets`,
      lastmod,
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/legal`,
      lastmod,
      changefreq: 'yearly',
      priority: 0.4
    },
    {
      url: `${baseUrl}/auth`,
      lastmod,
      changefreq: 'monthly',
      priority: 0.5
    }
  ];
};