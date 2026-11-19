import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ cities });
  } catch (err) {
    console.error('[Admin Cities GET] Error:', err);
    return NextResponse.json({ error: 'فشل جلب المدن', cities: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, nameAr, isActive = true, sortOrder = 0 } = body;

    if (!slug || !nameAr) {
      return NextResponse.json({ error: 'الاسم والرابط التعريفي مطلوبان' }, { status: 400 });
    }

    const created = await prisma.city.create({
      data: {
        slug: slug.trim().toLowerCase(),
        nameAr: nameAr.trim(),
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, city: created });
  } catch (err) {
    console.error('[Admin Cities POST] Error:', err);
    return NextResponse.json({ error: 'فشل إضافة المدينة' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, slug, nameAr, isActive, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرف المدينة مطلوب' }, { status: 400 });
    }

    const updated = await prisma.city.update({
      where: { id: Number(id) },
      data: {
        slug: slug?.trim()?.toLowerCase(),
        nameAr: nameAr?.trim(),
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
      },
    });

    return NextResponse.json({ success: true, city: updated });
  } catch (err) {
    console.error('[Admin Cities PUT] Error:', err);
    return NextResponse.json({ error: 'فشل تحديث المدينة' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف المدينة مطلوب' }, { status: 400 });
    }

    await prisma.city.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin Cities DELETE] Error:', err);
    return NextResponse.json({ error: 'فشل حذف المدينة' }, { status: 500 });
  }
}
