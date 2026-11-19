import nodemailer from 'nodemailer';

export interface LeadPayload {
  name: string;
  phone: string;
  serviceName: string;
  cityName: string;
  sourcePath?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface RoutingLog {
  channel: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  detail?: string;
  timestamp: string;
}

export async function routeLead(
  lead: LeadPayload & { id?: number },
  settings: {
    enableTelegram?: boolean;
    telegramBotToken?: string | null;
    telegramChatId?: string | null;
    enableGoogleSheet?: boolean;
    googleSheetWebhookUrl?: string | null;
    enableEmail?: boolean;
    notificationEmail?: string | null;
    enableWhatsappWebhook?: boolean;
    whatsappWebhookUrl?: string | null;
  },
  overrides?: {
    overrideTelegramChatId?: string | null;
    overrideGoogleSheetUrl?: string | null;
  }
): Promise<RoutingLog[]> {
  const logs: RoutingLog[] = [];
  const now = new Date().toISOString();

  // 1. Telegram Bot Notification
  const tgToken = settings.telegramBotToken?.trim();
  const tgChatId = overrides?.overrideTelegramChatId?.trim() || settings.telegramChatId?.trim();

  if (settings.enableTelegram && tgToken && tgChatId) {
    try {
      const message = `🚨 <b>طلب خدمة جديد — شركة مسك</b> 🚨\n\n` +
        `👤 <b>الاسم:</b> ${lead.name}\n` +
        `📱 <b>الجوال:</b> <code>${lead.phone}</code>\n` +
        `🛠 <b>الخدمة:</b> ${lead.serviceName}\n` +
        `📍 <b>المدينة:</b> ${lead.cityName}\n` +
        `🔗 <b>الصفحة:</b> ${lead.sourcePath || '/'}\n` +
        `🎯 <b>المصدر:</b> ${lead.utmSource || 'مباشر'}\n` +
        `🏷 <b>الحملة:</b> ${lead.utmCampaign || '-'}\n` +
        `⏰ <b>الوقت:</b> ${new Date().toLocaleString('ar')}`;

      const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.ok) {
        logs.push({ channel: 'Telegram', status: 'SUCCESS', detail: 'Message delivered', timestamp: now });
      } else {
        logs.push({ channel: 'Telegram', status: 'FAILED', detail: resData.description || 'API Error', timestamp: now });
      }
    } catch (err) {
      logs.push({ channel: 'Telegram', status: 'FAILED', detail: (err as Error).message, timestamp: now });
    }
  } else {
    logs.push({ channel: 'Telegram', status: 'SKIPPED', detail: 'Not enabled or missing credentials', timestamp: now });
  }

  // 2. Google Sheet Webhook
  const sheetUrl = overrides?.overrideGoogleSheetUrl?.trim() || settings.googleSheetWebhookUrl?.trim();
  if (settings.enableGoogleSheet && sheetUrl) {
    try {
      const res = await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          name: lead.name,
          phone: lead.phone,
          service: lead.serviceName,
          city: lead.cityName,
          sourcePath: lead.sourcePath || '/',
          utmSource: lead.utmSource || '',
          utmMedium: lead.utmMedium || '',
          utmCampaign: lead.utmCampaign || '',
          createdAt: now,
        }),
      });

      if (res.ok) {
        logs.push({ channel: 'GoogleSheet', status: 'SUCCESS', detail: 'Row appended via webhook', timestamp: now });
      } else {
        logs.push({ channel: 'GoogleSheet', status: 'FAILED', detail: `HTTP ${res.status}`, timestamp: now });
      }
    } catch (err) {
      logs.push({ channel: 'GoogleSheet', status: 'FAILED', detail: (err as Error).message, timestamp: now });
    }
  } else {
    logs.push({ channel: 'GoogleSheet', status: 'SKIPPED', detail: 'Not enabled or missing URL', timestamp: now });
  }

  // 3. Email Notification via SMTP
  const targetEmail = settings.notificationEmail?.trim();
  if (settings.enableEmail && targetEmail) {
    try {
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = parseInt(process.env.SMTP_PORT || '587');
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpFrom = process.env.SMTP_FROM || `"شركة مسك للخدمات المنزلية" <no-reply@meskco.com>`;

      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: targetEmail,
          subject: `طلب خدمة جديد من العميل: ${lead.name} (${lead.serviceName})`,
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #0B192C;">
              <h2 style="color: #00A8E8; border-bottom: 2px solid #F26419; padding-bottom: 8px;">طلب خدمة جديد — شركة مسك للخدمات المنزلية</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8fafc;">الاسم:</td><td style="padding: 8px; border: 1px solid #ddd;">${lead.name}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8fafc;">رقم الجوال:</td><td style="padding: 8px; border: 1px solid #ddd;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8fafc;">الخدمة المطلوبة:</td><td style="padding: 8px; border: 1px solid #ddd;">${lead.serviceName}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8fafc;">المدينة:</td><td style="padding: 8px; border: 1px solid #ddd;">${lead.cityName}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8fafc;">مسار الصفحة:</td><td style="padding: 8px; border: 1px solid #ddd;">${lead.sourcePath || '/'}</td></tr>
                <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f8fafc;">مصدر الإعلان (UTM):</td><td style="padding: 8px; border: 1px solid #ddd;">${lead.utmSource || 'مباشر'} / ${lead.utmCampaign || '-'}</td></tr>
              </table>
              <p style="margin-top: 20px; font-size: 13px; color: #64748b;">هذا الإشعار مرسل آلياً من نظام شركة مسك للخدمات المنزلية (https://meskco.com).</p>
            </div>
          `,
        });
        logs.push({ channel: 'Email', status: 'SUCCESS', detail: `Sent to ${targetEmail}`, timestamp: now });
      } else {
        logs.push({ channel: 'Email', status: 'SKIPPED', detail: 'SMTP environment variables not configured', timestamp: now });
      }
    } catch (err) {
      logs.push({ channel: 'Email', status: 'FAILED', detail: (err as Error).message, timestamp: now });
    }
  } else {
    logs.push({ channel: 'Email', status: 'SKIPPED', detail: 'Email notifications disabled or missing address', timestamp: now });
  }

  // 4. WhatsApp Webhook (optional 3rd party API)
  const waUrl = settings.whatsappWebhookUrl?.trim();
  if (settings.enableWhatsappWebhook && waUrl) {
    try {
      const res = await fetch(waUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, createdAt: now }),
      });
      if (res.ok) {
        logs.push({ channel: 'WhatsAppWebhook', status: 'SUCCESS', detail: 'Webhook triggered', timestamp: now });
      } else {
        logs.push({ channel: 'WhatsAppWebhook', status: 'FAILED', detail: `HTTP ${res.status}`, timestamp: now });
      }
    } catch (err) {
      logs.push({ channel: 'WhatsAppWebhook', status: 'FAILED', detail: (err as Error).message, timestamp: now });
    }
  }

  return logs;
}
