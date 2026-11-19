'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PhoneCall, MessageCircle, Menu, X, Shield, Clock } from 'lucide-react';
import { trackConversion } from './TrackingManager';

interface HeaderProps {
  phone: string;
  whatsapp: string;
  workingHours?: string | null;
}

export default function Header({ phone, whatsapp, workingHours }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cleanWhatsapp = whatsapp.replace(/\+/g, '').replace(/\s+/g, '');

  const handlePhoneClick = () => {
    trackConversion('Contact', { channel: 'phone' });
  };

  const handleWhatsappClick = () => {
    trackConversion('Contact', { channel: 'whatsapp' });
  };

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-brand-navy text-white text-xs py-2 px-4 border-b border-brand-navy-light/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-brand-orange" />
            <span>{workingHours || 'خدمة 24 ساعة طوال أيام الأسبوع — سرعة استجابة فورية'}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-gray-300">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>ضمان معتمد على كافة الخدمات</span>
            </span>
            <span className="text-gray-500">|</span>
            <a
              href={`tel:${phone}`}
              onClick={handlePhoneClick}
              className="hover:text-brand-orange transition font-bold"
              dir="ltr"
            >
              {phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0">
              <Image
                src="/images/logo-badge.png"
                alt="شركة مسك للخدمات المنزلية"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 640px) 64px, 72px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
                شركة مسك
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-brand-blue-dark -mt-1">
                للخدمات المنزلية المتكاملة
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-700">
            <Link href="/" className="hover:text-brand-blue transition">
              الرئيسية
            </Link>
            <a href="/#services" className="hover:text-brand-blue transition">
              خدماتنا
            </a>
            <a href="/#why-us" className="hover:text-brand-blue transition">
              لماذا مسك؟
            </a>
            <a href="/#coverage" className="hover:text-brand-blue transition">
              مناطق التغطية
            </a>
            <a href="/#reviews" className="hover:text-brand-blue transition">
              آراء العملاء
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${cleanWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsappClick}
              className="p-2.5 rounded-xl border border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 transition"
              title="تواصل عبر واتساب"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <a
              href={`tel:${phone}`}
              onClick={handlePhoneClick}
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition transform active:scale-95 text-sm"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>اتصل الآن ({phone})</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={`tel:${phone}`}
              onClick={handlePhoneClick}
              className="p-2 rounded-lg bg-orange-50 text-brand-orange hover:bg-orange-100 transition"
              title="اتصال سريع"
            >
              <PhoneCall className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-5 space-y-3 shadow-lg animate-fadeIn">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-gray-800 hover:text-brand-blue"
            >
              الرئيسية
            </Link>
            <a
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-gray-800 hover:text-brand-blue"
            >
              خدماتنا الشاملة
            </a>
            <a
              href="/#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-gray-800 hover:text-brand-blue"
            >
              لماذا تختار شركة مسك؟
            </a>
            <a
              href="/#coverage"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-gray-800 hover:text-brand-blue"
            >
              المدن ومناطق التغطية
            </a>
            <a
              href="/#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-gray-800 hover:text-brand-blue"
            >
              تقييمات وآراء العملاء
            </a>

            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <a
                href={`tel:${phone}`}
                onClick={() => {
                  handlePhoneClick();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-brand-orange text-white font-bold text-center text-sm flex items-center justify-center gap-1.5 shadow"
              >
                <PhoneCall className="w-4 h-4" />
                <span>اتصال مباشر</span>
              </a>
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  handleWhatsappClick();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-center text-sm flex items-center justify-center gap-1.5 shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>محادثة واتساب</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
