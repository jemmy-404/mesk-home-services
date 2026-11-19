'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackConversion } from './TrackingManager';
import { ShieldCheck, CheckCircle2, PhoneCall, MessageCircle, ArrowRight, Loader2, Send } from 'lucide-react';

interface LeadFormProps {
  services: { id: number; slug: string; nameAr: string }[];
  cities: { id: number; slug: string; nameAr: string }[];
  initialServiceSlug?: string;
  initialCitySlug?: string;
  customHeadline?: string | null;
  customOfferBadge?: string | null;
}

function InnerLeadForm({
  services,
  cities,
  initialServiceSlug,
  initialCitySlug,
  customHeadline,
  customOfferBadge,
}: LeadFormProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Find initial service name
  const matchedService = services.find(s => s.slug === initialServiceSlug);
  const matchedCity = cities.find(c => c.slug === initialCitySlug);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceName, setServiceName] = useState(matchedService?.nameAr || services[0]?.nameAr || 'خدمات التنظيف الشاملة');
  const [cityName, setCityName] = useState(matchedCity?.nameAr || cities[0]?.nameAr || 'الأحساء');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // Update defaults if props change
  useEffect(() => {
    if (matchedService) setServiceName(matchedService.nameAr);
    if (matchedCity) setCityName(matchedCity.nameAr);
  }, [matchedService, matchedCity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('يرجى كتابة الاسم الكريم');
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('يرجى إدخال رقم جوال صحيح للتواصل');
      return;
    }

    setLoading(true);

    try {
      const utmSource = searchParams.get('utm_source') || '';
      const utmMedium = searchParams.get('utm_medium') || '';
      const utmCampaign = searchParams.get('utm_campaign') || '';

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          serviceName,
          cityName,
          sourcePath: pathname,
          utmSource,
          utmMedium,
          utmCampaign,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء معالجة طلبك');
      }

      // Track conversion event across active Pixels
      trackConversion('Lead', {
        service: serviceName,
        city: cityName,
      });

      setWhatsappUrl(data.whatsappRedirectUrl || '');
      setSubmitted(true);

      // Optional immediate redirect to WhatsApp if enabled
      if (data.enableWhatsappRedirect && data.whatsappRedirectUrl) {
        setTimeout(() => {
          window.location.href = data.whatsappRedirectUrl;
        }, 1800);
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-emerald-500 text-center animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-brand-navy mb-2">تم استلام طلبك بنجاح!</h3>
        <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
          شكراً لتواصلك مع شركة مسك. يقوم فريقنا الآن بمراجعة طلبك وسيتم الاتصال بك خلال دقائق معدودة لتأكيد الموعد والأسعار.
        </p>

        {whatsappUrl && (
          <div className="space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg transition-transform transform active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              تأكيد سريع ومباشر عبر واتساب
            </a>
            <p className="text-xs text-gray-500">
              سيتم نقلك تلقائياً إلى محادثة واتساب مع فريق خدمة العملاء...
            </p>
          </div>
        )}

        <button
          onClick={() => {
            setSubmitted(false);
            setName('');
            setPhone('');
          }}
          className="mt-6 text-sm text-gray-500 hover:text-brand-blue flex items-center justify-center gap-1 mx-auto transition"
        >
          <span>إرسال طلب جديد لخدمة أخرى</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100 relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-brand-blue via-brand-orange to-brand-blue" />

      {customOfferBadge ? (
        <div className="inline-block bg-orange-100 text-brand-orange-hover text-xs font-bold px-3 py-1 rounded-full mb-3 border border-orange-200">
          🔥 {customOfferBadge}
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 bg-sky-50 text-brand-blue-dark text-xs font-bold px-3 py-1 rounded-full mb-3 border border-sky-100">
          <ShieldCheck className="w-4 h-4 text-brand-blue" />
          <span>خدمة فورية معتمدة وضمان شامل</span>
        </div>
      )}

      <h3 className="text-xl sm:text-2xl font-extrabold text-brand-navy mb-1 leading-snug">
        {customHeadline || 'احصل على عرض سعر فوري ومجاني'}
      </h3>
      <p className="text-gray-500 text-xs sm:text-sm mb-5">
        أدخل بياناتك وسيتواصل معك فني الخدمة المختص فوراً لتقديم أفضل عرض.
      </p>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 text-xs sm:text-sm p-3 rounded-lg mb-4 border border-red-200 font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Name Field */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5 text-right">
            الاسم الكريم <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: أبو محمد"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-gray-800 text-sm transition"
          />
        </div>

        {/* 2. Phone Field */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5 text-right">
            رقم الجوال <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05XXXXXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-gray-800 text-sm transition text-right"
            />
          </div>
        </div>

        {/* 3. Service Dropdown */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5 text-right">
            الخدمة المطلوبة
          </label>
          <select
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-gray-800 text-sm bg-white transition cursor-pointer"
          >
            {services.map((s) => (
              <option key={s.id} value={s.nameAr}>
                {s.nameAr}
              </option>
            ))}
          </select>
        </div>

        {/* 4. City Dropdown */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5 text-right">
            المدينة أو المنطقة
          </label>
          <select
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-gray-800 text-sm bg-white transition cursor-pointer"
          >
            {cities.map((c) => (
              <option key={c.id} value={c.nameAr}>
                {c.nameAr}
              </option>
            ))}
          </select>
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold text-base rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition duration-200 transform active:scale-98 disabled:opacity-75 cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري إرسال طلبك...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>أرسل الطلب واحصل على الخصم</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center pt-1">
          🔒 بياناتك في سرية وأمان تام — لا نشارك معلوماتك مع أي طرف ثالث.
        </p>
      </form>
    </div>
  );
}

export default function LeadForm(props: LeadFormProps) {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-blue mb-2" />
        <span className="text-xs text-gray-400">جاري تحميل النموذج...</span>
      </div>
    }>
      <InnerLeadForm {...props} />
    </Suspense>
  );
}
