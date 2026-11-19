import { MetadataRoute } from 'next';
import { getActiveServices, getActiveCities } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://meskco.com';

  const [services, cities] = await Promise.all([
    getActiveServices(),
    getActiveCities(),
  ]);

  const now = new Date();

  // 1. Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // 2. Service Pages (/services/[serviceSlug])
  for (const s of services) {
    routes.push({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // 3. City x Service Matrix Pages (/[citySlug]/[serviceSlug])
  for (const c of cities) {
    for (const s of services) {
      routes.push({
        url: `${baseUrl}/${c.slug}/${s.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return routes;
}
