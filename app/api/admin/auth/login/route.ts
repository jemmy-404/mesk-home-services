import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signAdminToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const cleanUser = typeof username === 'string' ? username.trim() : '';
    const cleanPass = typeof password === 'string' ? password.trim() : '';

    if (!cleanUser || !cleanPass) {
      return NextResponse.json({ error: 'يرجى إدخال اسم المستخدم وكلمة المرور' }, { status: 400 });
    }

    const envUser = (process.env.ADMIN_USERNAME || 'admin').trim();
    const envPass = (process.env.ADMIN_PASSWORD || 'MeskAdmin2025!#').trim();

    let isValid = false;

    // Check .env direct match first
    if (cleanUser.toLowerCase() === envUser.toLowerCase() && cleanPass === envPass) {
      isValid = true;
    } else {
      // Check database AdminUser
      try {
        const user = await prisma.adminUser.findUnique({
          where: { username: cleanUser },
        });
        if (user && user.passwordHash) {
          const match = await bcrypt.compare(cleanPass, user.passwordHash);
          if (match) isValid = true;
        }
      } catch (err) {
        console.warn('[Admin Auth] DB check skipped:', (err as Error).message);
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const token = await signAdminToken({
      username: cleanUser,
      role: 'admin',
    });

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
    });

    // Set secure HTTP-only session cookie
    response.cookies.set('mesk_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error('[Admin Login API] Error:', err);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
