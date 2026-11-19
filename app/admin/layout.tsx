'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Wrench,
  MapPin,
  Sliders,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Layers,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on login page, render clean container without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { label: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
    { label: 'الطلبات والعملاء', href: '/admin/leads', icon: Users },
    { label: 'إدارة الخدمات', href: '/admin/services', icon: Wrench },
    { label: 'المدن والمناطق', href: '/admin/cities', icon: MapPin },
    { label: 'تخصيص الحملات (Overrides)', href: '/admin/overrides', icon: Sliders },
    { label: 'الإعدادات والربط', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-brand-navy">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-brand-navy text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/images/logo-badge.png"
              alt="شركة مسك"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-sm">إدارة شركة مسك</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-gray-800 text-gray-200"
          aria-label="تبديل القائمة"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 right-0 z-40 h-screen w-64 bg-brand-navy text-white flex flex-col justify-between p-4 shadow-xl transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="pb-6 pt-2 border-b border-gray-800 flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/images/logo-badge.png"
                alt="شركة مسك"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-black text-base block text-white">شركة مسك</span>
              <span className="text-[11px] text-brand-blue-light block">لوحة التحكم المركزية</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                      : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-800 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-gray-300 hover:bg-gray-800/60 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-brand-blue-light" />
              <span>معاينة الموقع الحي</span>
            </span>
            <span className="text-[10px] text-gray-500">↗</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
