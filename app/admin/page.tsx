import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Wrench,
  MapPin,
  Sliders,
  TrendingUp,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardOverview() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let totalAll = 0;
  let totalToday = 0;
  let totalWeek = 0;
  let recentLeads: any[] = [];
  let servicesCount = 0;
  let citiesCount = 0;
  let overridesCount = 0;

  try {
    const [all, today, week, recents, sCount, cCount, oCount] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.lead.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.lead.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.city.count({ where: { isActive: true } }),
      prisma.pageOverride.count({ where: { isActive: true } }),
    ]);

    totalAll = all;
    totalToday = today;
    totalWeek = week;
    recentLeads = recents;
    servicesCount = sCount > 0 ? sCount : 10;
    citiesCount = cCount > 0 ? cCount : 7;
    overridesCount = oCount;
  } catch (err) {
    console.warn('[Admin Overview] DB query fallback:', (err as Error).message);
    servicesCount = 10;
    citiesCount = 7;
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">جديد</span>;
      case 'CONTACTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">تم التواصل</span>;
      case 'ASSIGNED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">قيد التنفيذ</span>;
      case 'CLOSED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">مكتمل</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">لوحة التحكم المركزية</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            متابعة فورية للطلبات، الحملات الإعلانية، ونسب التحويل لشركة مسك
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs sm:text-sm font-bold shadow-md transition"
          >
            <Users className="w-4 h-4" />
            <span>عرض كل الطلبات</span>
          </Link>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">طلبات اليوم</span>
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-navy">{totalToday}</div>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">خلال الـ 24 ساعة الماضية</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">طلبات هذا الأسبوع</span>
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-brand-blue flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-navy">{totalWeek}</div>
          <span className="text-[11px] text-gray-400 block mt-1">آخر 7 أيام</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">إجمالي الطلبات المسجلة</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-navy">{totalAll}</div>
          <span className="text-[11px] text-gray-400 block mt-1">منذ إطلاق النظام</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">الحملات والتخصيصات</span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-navy">{overridesCount}</div>
          <span className="text-[11px] text-purple-600 font-bold block mt-1">صفحة مخصصة نشطة</span>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench className="w-5 h-5 text-brand-blue" />
            <div>
              <span className="text-xs text-gray-500 block">الخدمات النشطة</span>
              <span className="text-base font-bold text-brand-navy">{servicesCount} خدمات</span>
            </div>
          </div>
          <Link href="/admin/services" className="text-xs text-brand-blue hover:underline">
            إدارة ←
          </Link>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-brand-orange" />
            <div>
              <span className="text-xs text-gray-500 block">المدن المغطاة</span>
              <span className="text-base font-bold text-brand-navy">{citiesCount} مدن ومناطق</span>
            </div>
          </div>
          <Link href="/admin/cities" className="text-xs text-brand-blue hover:underline">
            إدارة ←
          </Link>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-xs text-gray-500 block">تخصيص الصفحات (Media Buying)</span>
              <span className="text-base font-bold text-brand-navy">{overridesCount} صفحات</span>
            </div>
          </div>
          <Link href="/admin/overrides" className="text-xs text-brand-blue hover:underline">
            إدارة ←
          </Link>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-brand-navy">أحدث طلبات الخدمة الواردة</h3>
            <p className="text-xs text-gray-400">الطلبات الأخيرة المسجلة عبر نماذج الموقع والإعلانات</p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-bold text-brand-blue hover:text-brand-blue-dark flex items-center gap-1 transition"
          >
            <span>عرض وإدارة جميع الطلبات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="p-3.5">العميل</th>
                <th className="p-3.5">الجوال</th>
                <th className="p-3.5">الخدمة المطلوبة</th>
                <th className="p-3.5">المدينة</th>
                <th className="p-3.5">مصدر الحملة</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5">الوقت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3.5 font-bold text-brand-navy">{lead.name}</td>
                    <td className="p-3.5 font-mono text-gray-600" dir="ltr">
                      <a href={`tel:${lead.phone}`} className="hover:text-brand-orange">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="p-3.5 font-medium">{lead.serviceName}</td>
                    <td className="p-3.5">{lead.cityName}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono text-[11px]">
                        {lead.utmSource || 'مباشر'}
                      </span>
                    </td>
                    <td className="p-3.5">{statusBadge(lead.status)}</td>
                    <td className="p-3.5 text-gray-400 text-[11px]">
                      {new Date(lead.createdAt).toLocaleString('ar', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    لا توجد طلبات مسجلة بعد. بمجرد إرسال الزوار للطلبات ستظهر هنا فوراً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
