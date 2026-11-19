import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const overrides = await prisma.pageOverride.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ overrides });
  } catch (err) {
    console.error('[Admin Overrides GET] Error:', err);
    return NextResponse.json({ error: 'فشل جلب تخصيصات الصفحات', overrides: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      routePath,
      label,
      overridePhone,
      overrideWhatsapp,
      overrideMetaPixelId,
      overrideTiktokPixelId,
      overrideSnapchatPixelId,
      overrideGoogleAdsId,
      overrideGtmId,
      overrideTelegramChatId,
      overrideGoogleSheetUrl,
      customHeadline,
      customOfferBadge,
      isActive = true,
    } = body;

    if (!routePath || !label) {
      return NextResponse.json({ error: 'مسار الصفحة والاسم التعريفي مطلوبان' }, { status: 400 });
    }

    // Ensure route starts with /
    const cleanPath = routePath.trim().startsWith('/') ? routePath.trim() : `/${routePath.trim()}`;

    const created = await prisma.pageOverride.create({
      data: {
        routePath: cleanPath,
        label: label.trim(),
        overridePhone: overridePhone?.trim() || null,
        overrideWhatsapp: overrideWhatsapp?.trim() || null,
        overrideMetaPixelId: overrideMetaPixelId?.trim() || null,
        overrideTiktokPixelId: overrideTiktokPixelId?.trim() || null,
        overrideSnapchatPixelId: overrideSnapchatPixelId?.trim() || null,
        overrideGoogleAdsId: overrideGoogleAdsId?.trim() || null,
        overrideGtmId: overrideGtmId?.trim() || null,
        overrideTelegramChatId: overrideTelegramChatId?.trim() || null,
        overrideGoogleSheetUrl: overrideGoogleSheetUrl?.trim() || null,
        customHeadline: customHeadline?.trim() || null,
        customOfferBadge: customOfferBadge?.trim() || null,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ success: true, override: created });
  } catch (err) {
    console.error('[Admin Overrides POST] Error:', err);
    return NextResponse.json({ error: 'فشل إنشاء تخصيص الصفحة' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      routePath,
      label,
      overridePhone,
      overrideWhatsapp,
      overrideMetaPixelId,
      overrideTiktokPixelId,
      overrideSnapchatPixelId,
      overrideGoogleAdsId,
      overrideGtmId,
      overrideTelegramChatId,
      overrideGoogleSheetUrl,
      customHeadline,
      customOfferBadge,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    }

    const cleanPath = routePath ? (routePath.trim().startsWith('/') ? routePath.trim() : `/${routePath.trim()}`) : undefined;

    const updated = await prisma.pageOverride.update({
      where: { id: Number(id) },
      data: {
        routePath: cleanPath,
        label: label?.trim(),
        overridePhone: overridePhone !== undefined ? (overridePhone?.trim() || null) : undefined,
        overrideWhatsapp: overrideWhatsapp !== undefined ? (overrideWhatsapp?.trim() || null) : undefined,
        overrideMetaPixelId: overrideMetaPixelId !== undefined ? (overrideMetaPixelId?.trim() || null) : undefined,
        overrideTiktokPixelId: overrideTiktokPixelId !== undefined ? (overrideTiktokPixelId?.trim() || null) : undefined,
        overrideSnapchatPixelId: overrideSnapchatPixelId !== undefined ? (overrideSnapchatPixelId?.trim() || null) : undefined,
        overrideGoogleAdsId: overrideGoogleAdsId !== undefined ? (overrideGoogleAdsId?.trim() || null) : undefined,
        overrideGtmId: overrideGtmId !== undefined ? (overrideGtmId?.trim() || null) : undefined,
        overrideTelegramChatId: overrideTelegramChatId !== undefined ? (overrideTelegramChatId?.trim() || null) : undefined,
        overrideGoogleSheetUrl: overrideGoogleSheetUrl !== undefined ? (overrideGoogleSheetUrl?.trim() || null) : undefined,
        customHeadline: customHeadline !== undefined ? (customHeadline?.trim() || null) : undefined,
        customOfferBadge: customOfferBadge !== undefined ? (customOfferBadge?.trim() || null) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    return NextResponse.json({ success: true, override: updated });
  } catch (err) {
    console.error('[Admin Overrides PUT] Error:', err);
    return NextResponse.json({ error: 'فشل تحديث تخصيص الصفحة' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    }

    await prisma.pageOverride.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin Overrides DELETE] Error:', err);
    return NextResponse.json({ error: 'فشل حذف التخصيص' }, { status: 500 });
  }
}
