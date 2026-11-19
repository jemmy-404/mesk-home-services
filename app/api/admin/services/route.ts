import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_SERVICES } from '@/lib/initial-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    if (services && services.length > 0) {
      return NextResponse.json({ services });
    }
  } catch (err) {
    console.error('[Admin Services GET] Error:', err);
  }

  // Graceful fallback to initial default services
  const fallbackServices = INITIAL_SERVICES.map((s, index) => ({
    id: index + 1,
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
  }));
  return NextResponse.json({ services: fallbackServices });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      nameAr,
      shortDesc,
      fullContent,
      iconName = 'Sparkles',
      features = [],
      faqs = [],
      metaTitle,
      metaDescription,
      isActive = true,
      sortOrder = 0,
    } = body;

    if (!slug || !nameAr) {
      return NextResponse.json({ error: 'الاسم والرابط التعريفي مطلوبان' }, { status: 400 });
    }

    const created = await prisma.service.create({
      data: {
        slug: slug.trim().toLowerCase(),
        nameAr: nameAr.trim(),
        shortDesc: shortDesc || '',
        fullContent: fullContent || '',
        iconName: iconName || 'Sparkles',
        featuresJson: JSON.stringify(features),
        faqsJson: JSON.stringify(faqs),
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, service: created });
  } catch (err) {
    console.error('[Admin Services POST] Error:', err);
    return NextResponse.json({ error: 'فشل إنشاء الخدمة' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      slug,
      nameAr,
      shortDesc,
      fullContent,
      iconName,
      features = [],
      faqs = [],
      metaTitle,
      metaDescription,
      isActive,
      sortOrder,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرف الخدمة مطلوب' }, { status: 400 });
    }

    const updated = await prisma.service.update({
      where: { id: Number(id) },
      data: {
        slug: slug?.trim()?.toLowerCase(),
        nameAr: nameAr?.trim(),
        shortDesc,
        fullContent,
        iconName,
        featuresJson: JSON.stringify(features),
        faqsJson: JSON.stringify(faqs),
        metaTitle,
        metaDescription,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (err) {
    console.error('[Admin Services PUT] Error:', err);
    return NextResponse.json({ error: 'فشل تحديث الخدمة' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف الخدمة مطلوب' }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin Services DELETE] Error:', err);
    return NextResponse.json({ error: 'فشل حذف الخدمة' }, { status: 500 });
  }
}
