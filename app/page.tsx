import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getActiveServices,
  getActiveCities,
  resolvePageConfig,
} from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileStickyBar from '@/components/MobileStickyBar';
import LeadForm from '@/components/LeadForm';
import TrackingManager from '@/components/TrackingManager';
import JsonLd from '@/components/JsonLd';
import ServiceIcon from '@/components/ServiceIcon';
import {
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Zap,
  Users,
  Award,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Star,
  MapPin,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'شركة مسك للخدمات المنزلية | تنظيف، نقل، مكافحة، عزل، صيانة',
    description: 'شركة مسك الأولى في تقديم الخدمات المنزلية المتكاملة: تنظيف منازل، نقل عفش، مكافحة حشرات، عزل فوم وأسطح، صيانة أفران ومكيفات، وتنسيق حدائق بأعلى جودة وضمان.',
    alternates: {
      canonical: 'https://meskco.com',
    },
  };
}

export default async function HomePage() {
  const [config, services, cities] = await Promise.all([
    resolvePageConfig('/'),
    getActiveServices(),
    getActiveCities(),
  ]);

  const cleanWhatsapp = config.whatsapp.replace(/\+/g, '').replace(/\s+/g, '');

  return (
    <>
      {/* Tracking Pixels */}
      <TrackingManager
        metaPixelId={config.metaPixelId}
        tiktokPixelId={config.tiktokPixelId}
        snapchatPixelId={config.snapchatPixelId}
        googleAdsId={config.googleAdsId}
        gtmId={config.gtmId}
      />

      {/* JSON-LD Schemas */}
      <JsonLd
        businessName="شركة مسك للخدمات المنزلية"
        url="https://meskco.com"
        telephone={config.phone}
        address={config.globalSettings.businessAddress || 'المركز الرئيسي'}
      />

      {/* Header */}
      <Header
        phone={config.phone}
        whatsapp={config.whatsapp}
        workingHours={config.globalSettings.workingHours}
      />

      <main className="flex-1">
        {/* ========================================================
            HERO SECTION (High Converting Above The Fold)
        ======================================================== */}
        <section className="relative bg-gradient-to-b from-sky-50/70 via-white to-gray-50/50 pt-8 pb-16 lg:py-20 overflow-hidden border-b border-gray-100">
          {/* Subtle Background Glows */}
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Hero Left/Main Copy (7 cols on desktop) */}
              <div className="lg:col-span-7 space-y-6 text-right">
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-cream/80 border border-brand-orange/30 text-brand-navy font-bold text-xs sm:text-sm shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse" />
                  <span>الخيار الأول للخدمات المنزلية المتكاملة مع الضمان</span>
                </div>

                {/* Main H1 Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy leading-tight sm:leading-tight">
                  خدمات منزلية احترافية{' '}
                  <span className="text-brand-blue">بأعلى معايير الجودة</span>{' '}
                  وسرعة استجابة فائقة
                </h1>

                {/* Subheadline */}
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                  نحن في <strong className="text-brand-navy">شركة مسك</strong> نوفر لك حلولاً شاملة تشمل التنظيف، نقل الأثاث، مكافحة الحشرات، عزل الأسطح، صيانة الأجهزة والتكييف، وتنسيق الحدائق بأيدي كوادر فنية مدربة وأحدث المعدات لضمان راحتك التامة.
                </p>

                {/* Key Trust Pillars */}
                <div className="grid grid-cols-3 gap-3 pt-2 pb-2">
                  <div className="p-3 rounded-xl bg-white shadow-sm border border-gray-100 text-center">
                    <Zap className="w-5 h-5 text-brand-orange mx-auto mb-1.5" />
                    <span className="font-extrabold text-xs sm:text-sm text-brand-navy block">سرعة استجابة</span>
                    <span className="text-[11px] text-gray-500">وصول فوري لموقعك</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white shadow-sm border border-gray-100 text-center">
                    <Users className="w-5 h-5 text-brand-blue mx-auto mb-1.5" />
                    <span className="font-extrabold text-xs sm:text-sm text-brand-navy block">عمالة محترفة</span>
                    <span className="text-[11px] text-gray-500">فنيون ذوو خبرة وكفاءة</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white shadow-sm border border-gray-100 text-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                    <span className="font-extrabold text-xs sm:text-sm text-brand-navy block">ضمان معتمد</span>
                    <span className="text-[11px] text-gray-500">متابعة ورضا تام 100%</span>
                  </div>
                </div>

                {/* Direct Action Buttons for Immediate Mobile / Desktop Call */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={`tel:${config.phone}`}
                    className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/20 transition transform active:scale-95"
                  >
                    <PhoneCall className="w-5 h-5 animate-bounce" />
                    <span>اتصال فوري: {config.phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow-md transition transform active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>محادثة واتساب سريعة</span>
                  </a>
                </div>
              </div>

              {/* Hero Right: Embedded Lead Form (5 cols on desktop) */}
              <div className="lg:col-span-5 relative">
                <LeadForm
                  services={services}
                  cities={cities}
                  customHeadline={config.customHeadline}
                  customOfferBadge={config.customOfferBadge}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SERVICES GRID SECTION (Interactive 10 Services)
        ======================================================== */}
        <section id="services" className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 text-brand-blue-dark text-xs font-bold mb-3 border border-sky-100">
                <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                <span>خدمات منزلية شاملة ومتكاملة</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-4">
                تصفح خدماتنا المتميزة
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                نغطي كافة احتياجات منزلك من الصيانة والتنظيف والعزل والنقل بأعلى مستويات الحرفية والضمان الكتابي.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-brand-blue/50 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Icon and Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                        <ServiceIcon name={service.iconName} className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        خدمة مضمونة
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-blue transition">
                      {service.nameAr}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {service.shortDesc}
                    </p>

                    {/* Features list snapshot */}
                    <ul className="space-y-1.5 mb-6 text-xs text-gray-500">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:text-brand-blue-dark transition"
                    >
                      <span>تفاصيل الخدمة وحجز موعد</span>
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </Link>
                    <a
                      href={`tel:${config.phone}`}
                      className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover p-2 rounded-lg bg-orange-50 hover:bg-orange-100 transition"
                      title="اتصال مباشر"
                    >
                      طلب سريع
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            WHY CHOOSE MESK SECTION (Value Proposition)
        ======================================================== */}
        <section id="why-us" className="py-16 sm:py-20 bg-brand-bgLight border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 text-brand-orange-hover text-xs font-bold border border-orange-100">
                  <Award className="w-4 h-4 text-brand-orange" />
                  <span>ثقة وتميز عبر سنوات من الخبرة</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy leading-snug">
                  لماذا يفضل العملاء <span className="text-brand-blue">شركة مسك</span> عن غيرها؟
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  نحن ندرك أن منزلك هو مساحتك الأغلى، لذا نلتزم بأعلى معايير الأمانة، الدقة، والنظافة مع تقديم أسعار تنافسية واضحة بدون أي رسوم خفية.
                </p>

                <div className="pt-2">
                  <a
                    href={`tel:${config.phone}`}
                    className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navy-light text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition"
                  >
                    <PhoneCall className="w-4 h-4 text-brand-orange" />
                    <span>تحدث مع المستشار الفني الآن</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-brand-blue flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-brand-navy mb-2">ضمان كتابي معتمد</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    نقدم ضمانات رسمية تصل لسنوات على خدمات العزل والمكافحة مع الالتزام بالمعاينة والمتابعة المجانية.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-brand-navy mb-2">التزام صارم بالمواعيد</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    نحترم وقت عملائنا ونضمن وصول فريق العمل وتجهيزاته في الوقت المحدد بدقة دون أي تأخير.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-brand-navy mb-2">أحدث الأجهزة العالمية</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    نستخدم أحدث أجهزة الكشف الإلكتروني، ماكينات البخار والضغط، ومبيدات وعوازل معتمدة بيئياً.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-brand-navy mb-2">أسعار تنافسية وشفافة</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    تسعير عادل وواضح يتناسب مع مختلف الاحتياجات مع عروض وخصومات مميزة على باقات الخدمات المشتركة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3-STEP WORKFLOW SECTION
        ======================================================== */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-brand-orange text-xs font-bold tracking-wider uppercase block mb-2">
                خطوات سهلة وميسرة
              </span>
              <h2 className="text-3xl font-extrabold text-brand-navy">
                كيف نخدمك في 3 خطوات بسيطة؟
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="text-center p-6 rounded-2xl bg-sky-50/50 border border-sky-100">
                <div className="w-14 h-14 rounded-full bg-brand-blue text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-sky-500/20">
                  1
                </div>
                <h3 className="font-bold text-lg text-brand-navy mb-2">اطلب الخدمة</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  أرسل طلبك عبر النموذج أو تواصل معنا مباشرة عبر الاتصال الهاتفي أو رسائل الواتساب.
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-orange-50/50 border border-orange-100">
                <div className="w-14 h-14 rounded-full bg-brand-orange text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-orange-500/20">
                  2
                </div>
                <h3 className="font-bold text-lg text-brand-navy mb-2">تواصل فوري ومعاينة</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  يتواصل معك المختص الفني فوراً لتحديد التفاصيل وتقديم أفضل عرض سعر وتنسيق الموعد.
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/20">
                  3
                </div>
                <h3 className="font-bold text-lg text-brand-navy mb-2">تنفيذ احترافي وضمان</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  يصلك الفريق المتخصص لتنفيذ العمل بأعلى معايير الدقة مع تسليم شهادة الضمان المعتمدة.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            REVIEWS SECTION
        ======================================================== */}
        <section id="reviews" className="py-16 sm:py-20 bg-brand-bgLight border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <h2 className="text-3xl font-extrabold text-brand-navy mb-2">
                ماذا يقول عملاؤنا عنا؟
              </h2>
              <p className="text-gray-500 text-sm">
                آراء وتجارب حقيقية لعملاء وثقوا بخدمات شركة مسك
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    &quot;قمت بطلب خدمة نقل العفش مع الفك والتركيب، التجربة كانت ممتازة جداً. العمالة محترمة والتغليف ممتاز ولم تحدث أي خدوش للأثاث. شكراً مسك.&quot;
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-navy">أبو راشد</span>
                  <span className="text-gray-400">خدمة نقل عفش</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    &quot;تعاملت معهم في عزل السطح وكشف تسربات المياه، دقة في المواعيد وأجهزة فحص حديثة بدون تكسير. الفاتورة انخفضت بشكل ملحوظ بعدها.&quot;
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-navy">سلطان الخالدي</span>
                  <span className="text-gray-400">كشف تسربات وعزل</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    &quot;خدمة تنظيف الفلل والمجالس بالبخار احترافية لأبعد حد. المجالس عادت كالجديدة والروائح المعطرة استمرت لأيام. أنصح بالتعامل معهم بشدة.&quot;
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-navy">أم فهد</span>
                  <span className="text-gray-400">تنظيف منازل ومجالس</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            CITIES COVERAGE SECTION
        ======================================================== */}
        <section id="coverage" className="py-16 sm:py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-100">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>تغطية جغرافية واسعة</span>
              </div>
              <h2 className="text-3xl font-extrabold text-brand-navy mb-2">
                نصل إليكم أينما كنتم
              </h2>
              <p className="text-gray-500 text-sm">
                فرقنا الميدانية جاهزة للتحرك السريع وخدمتكم في كافة المدن والأحياء
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/${city.slug}/${services[0]?.slug || 'cleaning'}`}
                  className="group bg-gray-50 hover:bg-brand-blue hover:text-white p-4 rounded-xl border border-gray-200 hover:border-brand-blue text-center transition-all duration-200 shadow-sm"
                >
                  <MapPin className="w-5 h-5 mx-auto mb-2 text-brand-orange group-hover:text-white transition" />
                  <span className="font-bold text-sm block">{city.nameAr}</span>
                  <span className="text-[11px] text-gray-500 group-hover:text-sky-100 block mt-1">
                    خدمات فورية
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            FINAL CALL TO ACTION BANNER
        ======================================================== */}
        <section className="bg-gradient-to-r from-brand-navy via-brand-navy-light to-brand-navy text-white py-14">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
              جاهزون لخدمتكم على مدار 24 ساعة بأفضل الأسعار
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              تواصل معنا الآن للحصول على استشارة مجانية وعرض سعر فوري مخصص لاحتياجاتك بدون أي التزام مسبق.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={`tel:${config.phone}`}
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold text-base py-3.5 px-8 rounded-xl shadow-lg transition transform active:scale-95"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                <span>اتصل فوراً: {config.phone}</span>
              </a>
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-3.5 px-8 rounded-xl shadow-md transition transform active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        phone={config.phone}
        whatsapp={config.whatsapp}
        businessAddress={config.globalSettings.businessAddress}
        workingHours={config.globalSettings.workingHours}
        googleMapsEmbedUrl={config.globalSettings.googleMapsEmbedUrl}
        services={services}
        cities={cities}
      />

      {/* Mobile Sticky Bottom Conversion Bar */}
      <MobileStickyBar phone={config.phone} whatsapp={config.whatsapp} />
    </>
  );
}
