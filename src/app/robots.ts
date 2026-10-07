import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /go/* and /qr/* are served with an X-Robots-Tag: noindex header instead of
      // being blocked here, so crawlers can see the noindex and drop them.
      disallow: ['/dashboard', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
