import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // CSV header with UTF-8 BOM (\uFEFF) for Excel Arabic support
    let csv = '\uFEFFالمعرف,الاسم,الجوال,الخدمة,المدينة,المصدر,الحملة,المسار,الحالة,تاريخ الإنشاء\n';

    for (const l of leads) {
      const cleanName = `"${(l.name || '').replace(/"/g, '""')}"`;
      const cleanPhone = `"${l.phone}"`;
      const cleanService = `"${(l.serviceName || '').replace(/"/g, '""')}"`;
      const cleanCity = `"${(l.cityName || '').replace(/"/g, '""')}"`;
      const cleanSource = `"${l.utmSource || '-'}"`;
      const cleanCampaign = `"${l.utmCampaign || '-'}"`;
      const cleanPath = `"${l.sourcePath || '/'}"`;
      const cleanStatus = `"${l.status}"`;
      const cleanDate = `"${new Date(l.createdAt).toLocaleString('ar')}"`;

      csv += `${l.id},${cleanName},${cleanPhone},${cleanService},${cleanCity},${cleanSource},${cleanCampaign},${cleanPath},${cleanStatus},${cleanDate}\n`;
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="mesk-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error('[CSV Export Error]:', err);
    return NextResponse.json({ error: 'فشل تصدير ملف الطلبات' }, { status: 500 });
  }
}
