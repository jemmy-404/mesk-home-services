import { NextRequest, NextResponse } from 'next/server';
import { prisma, getGlobalSettings } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getGlobalSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error('[Admin Settings GET] Error:', err);
    return NextResponse.json({ error: 'فشل جلب الإعدادات العامة' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      defaultPhone,
      defaultWhatsapp,
      metaPixelId,
      tiktokPixelId,
      snapchatPixelId,
      googleAdsId,
      gtmId,
      enableTelegram,
      telegramBotToken,
      telegramChatId,
      enableWhatsappRedirect,
      enableWhatsappWebhook,
      whatsappWebhookUrl,
      enableGoogleSheet,
      googleSheetWebhookUrl,
      enableEmail,
      notificationEmail,
      businessAddress,
      googleMapsEmbedUrl,
      googleBusinessProfileUrl,
      workingHours,
    } = body;

    const updated = await prisma.globalSettings.upsert({
      where: { id: 1 },
      update: {
        defaultPhone: defaultPhone?.trim() || '0571319638',
        defaultWhatsapp: defaultWhatsapp?.trim() || '966571319638',
        metaPixelId: metaPixelId?.trim() || null,
        tiktokPixelId: tiktokPixelId?.trim() || null,
        snapchatPixelId: snapchatPixelId?.trim() || null,
        googleAdsId: googleAdsId?.trim() || null,
        gtmId: gtmId?.trim() || null,
        enableTelegram: Boolean(enableTelegram),
        telegramBotToken: telegramBotToken?.trim() || null,
        telegramChatId: telegramChatId?.trim() || null,
        enableWhatsappRedirect: Boolean(enableWhatsappRedirect),
        enableWhatsappWebhook: Boolean(enableWhatsappWebhook),
        whatsappWebhookUrl: whatsappWebhookUrl?.trim() || null,
        enableGoogleSheet: Boolean(enableGoogleSheet),
        googleSheetWebhookUrl: googleSheetWebhookUrl?.trim() || null,
        enableEmail: Boolean(enableEmail),
        notificationEmail: notificationEmail?.trim() || null,
        businessAddress: businessAddress?.trim() || null,
        googleMapsEmbedUrl: googleMapsEmbedUrl?.trim() || null,
        googleBusinessProfileUrl: googleBusinessProfileUrl?.trim() || null,
        workingHours: workingHours?.trim() || 'على مدار 24 ساعة طوال أيام الأسبوع',
      },
      create: {
        id: 1,
        defaultPhone: defaultPhone?.trim() || '0571319638',
        defaultWhatsapp: defaultWhatsapp?.trim() || '966571319638',
        metaPixelId: metaPixelId?.trim() || null,
        tiktokPixelId: tiktokPixelId?.trim() || null,
        snapchatPixelId: snapchatPixelId?.trim() || null,
        googleAdsId: googleAdsId?.trim() || null,
        gtmId: gtmId?.trim() || null,
        enableTelegram: Boolean(enableTelegram),
        telegramBotToken: telegramBotToken?.trim() || null,
        telegramChatId: telegramChatId?.trim() || null,
        enableWhatsappRedirect: Boolean(enableWhatsappRedirect),
        enableWhatsappWebhook: Boolean(enableWhatsappWebhook),
        whatsappWebhookUrl: whatsappWebhookUrl?.trim() || null,
        enableGoogleSheet: Boolean(enableGoogleSheet),
        googleSheetWebhookUrl: googleSheetWebhookUrl?.trim() || null,
        enableEmail: Boolean(enableEmail),
        notificationEmail: notificationEmail?.trim() || null,
        businessAddress: businessAddress?.trim() || null,
        googleMapsEmbedUrl: googleMapsEmbedUrl?.trim() || null,
        googleBusinessProfileUrl: googleBusinessProfileUrl?.trim() || null,
        workingHours: workingHours?.trim() || 'على مدار 24 ساعة طوال أيام الأسبوع',
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    console.error('[Admin Settings PUT] Error:', err);
    return NextResponse.json({ error: 'فشل حفظ الإعدادات' }, { status: 500 });
  }
}
