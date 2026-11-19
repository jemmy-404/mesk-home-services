import { NextRequest, NextResponse } from 'next/server';
import { prisma, getGlobalSettings, getPageOverride } from '@/lib/prisma';
import { routeLead } from '@/lib/lead-router';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      serviceName,
      cityName,
      sourcePath = '/',
      utmSource = '',
      utmMedium = '',
      utmCampaign = '',
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'الرجاء إدخال الاسم ورقم الجوال للتواصل' },
        { status: 400 }
      );
    }

    // Clean and validate phone
    const cleanPhone = phone.trim().replace(/\s+/g, '');

    // Get settings and potential page override for routing
    const settings = await getGlobalSettings();
    const override = await getPageOverride(sourcePath);

    // Save Lead to DB
    let createdLead = null;
    try {
      createdLead = await prisma.lead.create({
        data: {
          name: name.trim(),
          phone: cleanPhone,
          serviceName: serviceName || 'خدمة عامة',
          cityName: cityName || 'المركز الرئيسي',
          sourcePath: sourcePath || '/',
          utmSource: utmSource || null,
          utmMedium: utmMedium || null,
          utmCampaign: utmCampaign || null,
          status: 'NEW',
        },
      });
    } catch (dbErr) {
      console.warn('[Leads API] Database save failed, continuing with notifications:', (dbErr as Error).message);
    }

    // Lead routing triggers (Telegram, Google Sheet, Email, WhatsApp webhook)
    const routingLogs = await routeLead(
      {
        id: createdLead?.id,
        name: name.trim(),
        phone: cleanPhone,
        serviceName: serviceName || 'خدمة عامة',
        cityName: cityName || 'المركز الرئيسي',
        sourcePath,
        utmSource,
        utmMedium,
        utmCampaign,
      },
      settings,
      {
        overrideTelegramChatId: override?.overrideTelegramChatId,
        overrideGoogleSheetUrl: override?.overrideGoogleSheetUrl,
      }
    );

    // Update lead with logs if DB record exists
    if (createdLead) {
      try {
        await prisma.lead.update({
          where: { id: createdLead.id },
          data: { routingLogsJson: JSON.stringify(routingLogs) },
        });
      } catch (err) {
        console.warn('[Leads API] Failed to update routing logs in DB:', (err as Error).message);
      }
    }

    // Determine WhatsApp number to contact
    const targetWhatsapp = override?.overrideWhatsapp?.trim() || settings.defaultWhatsapp;
    const cleanWhatsapp = targetWhatsapp.replace(/\+/g, '').replace(/\s+/g, '');

    // Pre-filled WhatsApp message
    const waText = `السلام عليكم ورحمة الله، أود تأكيد طلبي لخدمة ${serviceName || 'الخدمات المنزلية'} في مدينة ${cityName || 'موقعي'}.\nالاسم: ${name.trim()}\nالجوال: ${cleanPhone}`;
    const whatsappRedirectUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(waText)}`;

    return NextResponse.json({
      success: true,
      leadId: createdLead?.id || 1,
      whatsappRedirectUrl,
      enableWhatsappRedirect: settings.enableWhatsappRedirect,
    });
  } catch (err) {
    console.error('[Leads API] Error processing lead submission:', err);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الطلب، يرجى الاتصال بنا مباشرة' },
      { status: 500 }
    );
  }
}
