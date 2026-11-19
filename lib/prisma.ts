import { PrismaClient } from '@prisma/client';
import { INITIAL_CITIES, INITIAL_GLOBAL_SETTINGS, INITIAL_SERVICES } from './initial-data';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Resilient data accessors that fallback safely if database is offline/unreachable
export async function getGlobalSettings() {
  try {
    const settings = await prisma.globalSettings.findFirst({
      where: { id: 1 },
    });
    if (settings) return settings;
  } catch (error) {
    console.warn('[Database] Using fallback GlobalSettings due to DB connection:', (error as Error).message);
  }
  return {
    ...INITIAL_GLOBAL_SETTINGS,
    updatedAt: new Date(),
  };
}

export async function getActiveServices() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    if (services && services.length > 0) {
      return services.map(s => ({
        ...s,
        features: JSON.parse(s.featuresJson || '[]') as string[],
        faqs: JSON.parse(s.faqsJson || '[]') as { question: string; answer: string }[],
      }));
    }
  } catch (error) {
    console.warn('[Database] Using fallback Services due to DB connection:', (error as Error).message);
  }
  return INITIAL_SERVICES.map(s => ({
    id: s.sortOrder,
    slug: s.slug,
    nameAr: s.nameAr,
    shortDesc: s.shortDesc,
    fullContent: s.fullContent,
    iconName: s.iconName,
    featuresJson: JSON.stringify(s.features),
    features: s.features,
    faqsJson: JSON.stringify(s.faqs),
    faqs: s.faqs,
    metaTitle: s.metaTitle,
    metaDescription: s.metaDescription,
    isActive: true,
    sortOrder: s.sortOrder,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function getServiceBySlug(slug: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
    });
    if (service) {
      return {
        ...service,
        features: JSON.parse(service.featuresJson || '[]') as string[],
        faqs: JSON.parse(service.faqsJson || '[]') as { question: string; answer: string }[],
      };
    }
  } catch (error) {
    console.warn('[Database] Using fallback Service due to DB connection:', (error as Error).message);
  }
  const found = INITIAL_SERVICES.find(s => s.slug === slug);
  if (!found) return null;
  return {
    id: found.sortOrder,
    slug: found.slug,
    nameAr: found.nameAr,
    shortDesc: found.shortDesc,
    fullContent: found.fullContent,
    iconName: found.iconName,
    featuresJson: JSON.stringify(found.features),
    features: found.features,
    faqsJson: JSON.stringify(found.faqs),
    faqs: found.faqs,
    metaTitle: found.metaTitle,
    metaDescription: found.metaDescription,
    isActive: true,
    sortOrder: found.sortOrder,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getActiveCities() {
  try {
    const cities = await prisma.city.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    if (cities && cities.length > 0) return cities;
  } catch (error) {
    console.warn('[Database] Using fallback Cities due to DB connection:', (error as Error).message);
  }
  return INITIAL_CITIES.map(c => ({
    id: c.sortOrder,
    slug: c.slug,
    nameAr: c.nameAr,
    isActive: true,
    sortOrder: c.sortOrder,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function getCityBySlug(slug: string) {
  try {
    const city = await prisma.city.findUnique({
      where: { slug },
    });
    if (city) return city;
  } catch (error) {
    console.warn('[Database] Using fallback City due to DB connection:', (error as Error).message);
  }
  const found = INITIAL_CITIES.find(c => c.slug === slug);
  if (!found) return null;
  return {
    id: found.sortOrder,
    slug: found.slug,
    nameAr: found.nameAr,
    isActive: true,
    sortOrder: found.sortOrder,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getPageOverride(routePath: string) {
  try {
    // Exact match or normalized match without trailing slash
    const normalized = routePath.endsWith('/') && routePath.length > 1 ? routePath.slice(0, -1) : routePath;
    const override = await prisma.pageOverride.findFirst({
      where: {
        routePath: { in: [routePath, normalized, `${normalized}/`] },
        isActive: true,
      },
    });
    return override;
  } catch (error) {
    console.warn('[Database] PageOverride fetch error:', (error as Error).message);
    return null;
  }
}

/**
 * Resolves effective page contact and tracking details by combining
 * PageOverride (if exists for routePath) with GlobalSettings.
 */
export async function resolvePageConfig(routePath: string) {
  const globalSettings = await getGlobalSettings();
  const override = await getPageOverride(routePath);

  return {
    phone: (override?.overridePhone?.trim()) || globalSettings.defaultPhone,
    whatsapp: (override?.overrideWhatsapp?.trim()) || globalSettings.defaultWhatsapp,
    metaPixelId: (override?.overrideMetaPixelId?.trim()) || globalSettings.metaPixelId || '',
    tiktokPixelId: (override?.overrideTiktokPixelId?.trim()) || globalSettings.tiktokPixelId || '',
    snapchatPixelId: (override?.overrideSnapchatPixelId?.trim()) || globalSettings.snapchatPixelId || '',
    googleAdsId: (override?.overrideGoogleAdsId?.trim()) || globalSettings.googleAdsId || '',
    gtmId: (override?.overrideGtmId?.trim()) || globalSettings.gtmId || '',
    customHeadline: override?.customHeadline || null,
    customOfferBadge: override?.customOfferBadge || null,
    override,
    globalSettings,
  };
}
