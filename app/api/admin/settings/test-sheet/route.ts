import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl } = await request.json();

    if (!webhookUrl) {
      return NextResponse.json({ error: 'رابط Webhook مطلوب' }, { status: 400 });
    }

    const testPayload = {
      isTest: true,
      leadId: 9999,
      name: 'عميل تجريبي - اختبار الربط',
      phone: '0500000000',
      service: 'خدمة تجريبية',
      city: 'المركز الرئيسي',
      sourcePath: '/test',
      utmSource: 'admin_test',
      utmMedium: 'test',
      utmCampaign: 'test',
      createdAt: new Date().toISOString(),
    };

    const res = await fetch(webhookUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `فشل استدعاء الرابط (HTTP ${res.status})` }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'تم إرسال طلب الاختبار بنجاح إلى جدول البيانات' });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
