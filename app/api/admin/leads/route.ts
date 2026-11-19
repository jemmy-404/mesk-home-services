import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const service = searchParams.get('service') || '';

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (service && service !== 'ALL') {
      where.serviceName = service;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { cityName: { contains: search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return NextResponse.json({ leads });
  } catch (err) {
    console.error('[Admin Leads API] Error:', err);
    return NextResponse.json({ error: 'فشل جلب بيانات الطلبات', leads: [] }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'المعرف والحالة مطلوبان' }, { status: 400 });
    }

    const updated = await prisma.lead.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (err) {
    console.error('[Admin Leads PATCH] Error:', err);
    return NextResponse.json({ error: 'فشل تحديث حالة الطلب' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف الطلب مطلوب' }, { status: 400 });
    }

    await prisma.lead.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin Leads DELETE] Error:', err);
    return NextResponse.json({ error: 'فشل حذف الطلب' }, { status: 500 });
  }
}
