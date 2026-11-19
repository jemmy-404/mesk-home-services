import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { INITIAL_CITIES, INITIAL_GLOBAL_SETTINGS, INITIAL_SERVICES } from '../lib/initial-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Mesk Home Services Database Seed...');

  // 1. Seed Global Settings
  const settings = await prisma.globalSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      defaultPhone: INITIAL_GLOBAL_SETTINGS.defaultPhone,
      defaultWhatsapp: INITIAL_GLOBAL_SETTINGS.defaultWhatsapp,
      metaPixelId: INITIAL_GLOBAL_SETTINGS.metaPixelId,
      tiktokPixelId: INITIAL_GLOBAL_SETTINGS.tiktokPixelId,
      snapchatPixelId: INITIAL_GLOBAL_SETTINGS.snapchatPixelId,
      googleAdsId: INITIAL_GLOBAL_SETTINGS.googleAdsId,
      gtmId: INITIAL_GLOBAL_SETTINGS.gtmId,
      enableTelegram: false,
      enableWhatsappRedirect: true,
      enableWhatsappWebhook: false,
      enableGoogleSheet: false,
      enableEmail: false,
      businessAddress: INITIAL_GLOBAL_SETTINGS.businessAddress,
      workingHours: INITIAL_GLOBAL_SETTINGS.workingHours,
    },
  });
  console.log('✅ Global Settings seeded:', settings.id);

  // 2. Seed Services
  for (const s of INITIAL_SERVICES) {
    const service = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        nameAr: s.nameAr,
        shortDesc: s.shortDesc,
        fullContent: s.fullContent,
        iconName: s.iconName,
        featuresJson: JSON.stringify(s.features),
        faqsJson: JSON.stringify(s.faqs),
        metaTitle: s.metaTitle,
        metaDescription: s.metaDescription,
        sortOrder: s.sortOrder,
        isActive: true,
      },
      create: {
        slug: s.slug,
        nameAr: s.nameAr,
        shortDesc: s.shortDesc,
        fullContent: s.fullContent,
        iconName: s.iconName,
        featuresJson: JSON.stringify(s.features),
        faqsJson: JSON.stringify(s.faqs),
        metaTitle: s.metaTitle,
        metaDescription: s.metaDescription,
        sortOrder: s.sortOrder,
        isActive: true,
      },
    });
    console.log(`✅ Service seeded: ${service.nameAr} (${service.slug})`);
  }

  // 3. Seed Cities
  for (const c of INITIAL_CITIES) {
    const city = await prisma.city.upsert({
      where: { slug: c.slug },
      update: {
        nameAr: c.nameAr,
        sortOrder: c.sortOrder,
        isActive: true,
      },
      create: {
        slug: c.slug,
        nameAr: c.nameAr,
        sortOrder: c.sortOrder,
        isActive: true,
      },
    });
    console.log(`✅ City seeded: ${city.nameAr} (${city.slug})`);
  }

  // 4. Seed Admin User
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'MeskAdmin2025!#';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: { passwordHash },
    create: {
      username: adminUsername,
      passwordHash,
      name: 'مدير النظام',
    },
  });
  console.log(`✅ Admin User seeded: ${admin.username}`);

  // 5. Seed Example Page Override for Media Buying
  const sampleOverride = await prisma.pageOverride.upsert({
    where: { routePath: '/alahsa/painting-gypsum' },
    update: {},
    create: {
      routePath: '/alahsa/painting-gypsum',
      label: 'حملة معلم دهانات وجبس بورد الأحساء',
      overridePhone: '0571319638',
      overrideWhatsapp: '966571319638',
      customHeadline: 'أفضل مقاول دهانات وجبس بورد بالأحساء - خصم 25% مع الضمان',
      customOfferBadge: 'عرض خاص لسكان الأحساء والهفوف والمبرز',
      isActive: true,
    },
  });
  console.log(`✅ Sample Page Override seeded: ${sampleOverride.routePath}`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
