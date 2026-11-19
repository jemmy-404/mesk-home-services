'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PhoneCall, MessageCircle, MapPin, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { trackConversion } from './TrackingManager';

interface FooterProps {
  phone: string;
  whatsapp: string;
  businessAddress?: string | null;
  workingHours?: string | null;
  googleMapsEmbedUrl?: string | null;
  services: { id: number; slug: string; nameAr: string }[];
  cities: { id: number; slug: string; nameAr: string }[];
}

export default function Footer({
  phone,
  whatsapp,
  businessAddress,
  workingHours,
  googleMapsEmbedUrl,
  services,
  cities,
}: FooterProps) {
  const cleanWhatsapp = whatsapp.replace(/\+/g, '').replace(/\s+/g, '');

  const handlePhoneClick = () => {
    trackConversion('Contact', { channel: 'phone' });
  };

  const handleWhatsappClick = () => {
    trackConversion('Contact', { channel: 'whatsapp' });
  };

  return (
    <footer className="bg-brand-navy text-white pt-16 pb-24 md:pb-12 border-t border-brand-navy-light/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Column 1: Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-28 h-16 flex-shrink-0">
                <Image
                  src="/images/logo-light.png"
                  alt="شركة مسك للخدمات المنزلية"
                  fill
                  className="object-contain"
                  sizes="112px"
                />
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              شركة مسك هي وجهتكم الأولى للخدمات المنزلية المتكاملة، حيث نجمع بين الخبرة العريقة وأحدث المعدات العالمية لتقديم خدمات النظافة، النقل، المكافحة، العزل، الصيانة، وتنسيق الحدائق بأعلى معايير الدقة والضمان.
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span>{workingHours || 'خدمة 24 ساعة طوال أيام الأسبوع'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <span>{businessAddress || 'المركز الرئيسي للخدمات المنزلية المتكاملة'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>ضمان شامل ومعتمد على كافة الأعمال والخدمات</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links to Services */}
          <div>
            <h4 className="text-base font-extrabold text-white mb-4 border-r-4 border-brand-blue pr-3">
              خدماتنا الرئيسية
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {services.slice(0, 7).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="hover:text-brand-orange transition flex items-center gap-1.5"
                  >
                    <span className="text-brand-blue text-xs">◀</span>
                    <span>{s.nameAr}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Coverage Cities */}
          <div>
            <h4 className="text-base font-extrabold text-white mb-4 border-r-4 border-brand-orange pr-3">
              المدن ومناطق التغطية
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-6">
              {cities.map((c) => (
                <Link
                  key={c.id}
                  href={`/${c.slug}/${services[0]?.slug || 'cleaning'}`}
                  className="hover:text-brand-blue transition text-xs py-1 px-2 rounded bg-gray-800/60 hover:bg-gray-800 flex items-center justify-between"
                >
                  <span>خدمات {c.nameAr}</span>
                  <span className="text-gray-500 text-[10px]">📍</span>
                </Link>
              ))}
            </div>

            <div className="bg-gray-800/80 rounded-xl p-3 border border-gray-700/60 text-xs text-gray-300">
              <span className="text-brand-orange font-bold block mb-1">سرعة وصول فائقة:</span>
              نمتلك فرقاً ميدانية متأهبة للوصول إليكم في كافة الأحياء والمناطق بأسرع وقت ممكن.
            </div>
          </div>

          {/* Column 4: Contact & Direct Actions */}
          <div>
            <h4 className="text-base font-extrabold text-white mb-4 border-r-4 border-emerald-500 pr-3">
              اتصل بنا مباشرة
            </h4>
            <p className="text-xs text-gray-300 mb-4">
              فريق خدمة العملاء جاهز للرد على استفساراتكم وحجز مواعيدكم على الفور:
            </p>

            <div className="space-y-3">
              <a
                href={`tel:${phone}`}
                onClick={handlePhoneClick}
                className="flex items-center gap-3 bg-brand-orange hover:bg-brand-orange-hover text-white p-3 rounded-xl transition shadow-md"
              >
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="w-5 h-5 text-white animate-bounce" />
                </div>
                <div>
                  <span className="text-xs text-orange-100 block">اتصال هاتفي مباشر</span>
                  <span className="text-base font-black tracking-wide" dir="ltr">{phone}</span>
                </div>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsappClick}
                className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition shadow-md"
              >
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs text-emerald-100 block">محادثة واتساب سريعة</span>
                  <span className="text-base font-black tracking-wide" dir="ltr">{whatsapp}</span>
                </div>
              </a>
            </div>

            {/* Optional Google Maps */}
            {googleMapsEmbedUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-gray-700 h-36">
                <iframe
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="موقع شركة مسك على الخريطة"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} شركة مسك للخدمات المنزلية — جودة نثق بها.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-gray-200 transition">
              سياسة الخصوصية
            </Link>
            <Link href="/" className="hover:text-gray-200 transition">
              الشروط والأحكام
            </Link>
            <Link href="/admin/login" className="text-gray-600 hover:text-gray-400 transition">
              دخول الإدارة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
