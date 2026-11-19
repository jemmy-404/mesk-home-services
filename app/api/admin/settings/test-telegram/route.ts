import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { botToken, chatId } = await request.json();

    if (!botToken || !chatId) {
      return NextResponse.json({ error: 'رمز البوت ومعرف المحادثة مطلوبان' }, { status: 400 });
    }

    const testMsg = `🔔 <b>رسالة اختبار ربط تيليجرام</b> 🔔\n\n` +
      `تم تأكيد الربط بنجاح بين نظام شركة مسك للخدمات المنزلية وبوت تيليجرام الخاص بك.\n` +
      `الوقت: ${new Date().toLocaleString('ar')}`;

    const res = await fetch(`https://api.telegram.org/bot${botToken.trim()}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text: testMsg,
        parse_mode: 'HTML',
      }),
    });

    const resData = await res.json();
    if (!res.ok || !resData.ok) {
      return NextResponse.json({ error: resData.description || 'فشل إرسال رسالة الاختبار' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'تم إرسال رسالة الاختبار بنجاح إلى تيليجرام' });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
