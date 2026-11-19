import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getServiceBySlug,
  getCityBySlug,
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
import FaqAccordion from '@/components/FaqAccordion';
import {
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Zap,
  Users,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CityServicePageProps {
  params: {
    citySlug: string;
    serviceSlug: string;
  };
}

export async function generateMetadata({ params }: CityServicePageProps): Promise<Metadata> {
  const [city, service] = await Promise.all([
    getCityBySlug(params.citySlug),
    getServiceBySlug(params.serviceSlug),
  ]);

  if (!city || !service) {
    return {
      title: 'الصفحة غير موجودة | شركة مسك',
    };
  }

  const title = `${service.nameAr} في ${city.nameAr} | خصم خاص وضمان معتمد | شركة مسك`;
  const description = `أفضل خدمات ${service.nameAr} في ${city.nameAr} مع شركة مسك. فنيون محترفون، سرعة وصول لموقعك، ومعدات متطورة مع ضمان كتابي معتمد. اطلب عرض السعر الآن.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://meskco.com/${city.slug}/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://meskco.com/${city.slug}/${service.slug}`,
      images: ['/images/logo-badge.png'],
    },
  };
}

export default async function CityServicePage({ params }: CityServicePageProps) {
  const [city, service] = await Promise.all([
    getCityBySlug(params.citySlug),
    getServiceBySlug(params.serviceSlug),
  ]);

  if (!city || !service) {
    notFound();
  }

  const routePath = `/${city.slug}/${service.slug}`;
  const [config, allServices, allCities] = await Promise.all([
    resolvePageConfig(routePath),
    getActiveServices(),
    getActiveCities(),
  ]);

  const cleanWhatsapp = config.whatsapp.replace(/\+/g, '').replace(/\s+/g, '');

  // Localized FAQs with city context
  const localizedFaqs = service.faqs.map(faq => ({
    question: faq.question.includes('؟')
      ? faq.question.replace('؟', ` في ${city.nameAr}؟`)
      : `${faq.question} في ${city.nameAr}`,
    answer: faq.answer,
  }));

  return (
    <>
      {/* Tracking Pixels (Specific to this page / campaign if overridden) */}
      <TrackingManager
        metaPixelId={config.metaPixelId}
        tiktokPixelId={config.tiktokPixelId}
        snapchatPixelId={config.snapchatPixelId}
        googleAdsId={config.googleAdsId}
        gtmId={config.gtmId}
      />

      {/* JSON-LD Schemas */}
      <JsonLd
        businessName={`شركة مسك للخدمات المنزلية - فرع ${city.nameAr}`}
        url={`https://meskco.com/${city.slug}/${service.slug}`}
        telephone={config.phone}
        address={`خدمة متوفرة في ${city.nameAr} وكافة الأحياء المجاورة`}
        service={{
          name: `${service.nameAr} في ${city.nameAr}`,
          description: `خدمات ${service.nameAr} المعتمدة لسكان ${city.nameAr} بأعلى جودة وضمان.`,
          url: `https://meskco.com/${city.slug}/${service.slug}`,
        }}
        faqs={localizedFaqs}
      />

      {/* Header */}
      <Header
        phone={config.phone}
        whatsapp={config.whatsapp}
        workingHours={config.globalSettings.workingHours}
      />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="bg-gray-100/70 border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8 text-xs text-gray-500">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Link href="/" className="hover:text-brand-blue">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href={`/services/${service.slug}`} className="hover:text-brand-blue">
              {service.nameAr}
            </Link>
            <span>/</span>
            <span className="font-bold text-brand-navy">{city.nameAr}</span>
          </div>
        </div>

        {/* Localized Hero & Direct Lead Form */}
        <section className="bg-gradient-to-b from-sky-50/70 via-white to-gray-50/50 py-10 lg:py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Localized Copy */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cream border border-brand-orange/30 text-brand-navy text-xs font-bold">
                  <MapPin className="w-4 h-4 text-brand-orange" />
                  <span>تغطية فورية وشاملة لكافة أحياء {city.nameAr}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy leading-tight">
                  {config.customHeadline || `${service.nameAr} في ${city.nameAr}`}
                </h1>

                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  هل تبحث عن أفضل من يقدم <strong className="text-brand-navy">{service.nameAr}</strong> في <strong className="text-brand-blue">{city.nameAr}</strong>؟ توفر لكم شركة مسك طواقم فنية متخصصة ومعدات حديثة تضمن إنجاز العمل بأعلى درجات الدقة والسرعة مع ضمان معتمد.
                </p>

                {/* Localized Trust Badges */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white shadow-sm border border-gray-100 text-center">
                    <Zap className="w-5 h-5 text-brand-orange mx-auto mb-1" />
                    <span className="font-bold text-xs sm:text-sm text-brand-navy block">وصول خلال دقائق</span>
                    <span className="text-[10px] text-gray-500">فرق متمركزة في {city.nameAr}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white shadow-sm border border-gray-100 text-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <span className="font-bold text-xs sm:text-sm text-brand-navy block">ضمان معتمد</span>
                    <span className="text-[10px] text-gray-500">شهادة ضمان على الخدمة</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white shadow-sm border border-gray-100 text-center">
                    <Users className="w-5 h-5 text-brand-blue mx-auto mb-1" />
                    <span className="font-bold text-xs sm:text-sm text-brand-navy block">فنيون محترفون</span>
                    <span className="text-[10px] text-gray-500">خبرة وكفاءة عالية</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={`tel:${config.phone}`}
                    className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow-lg transition transform active:scale-95"
                  >
                    <PhoneCall className="w-5 h-5 animate-bounce" />
                    <span>اتصال فوري ({config.phone})</span>
                  </a>

                  <a
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow-md transition transform active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>واتساب {city.nameAr}</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Pre-selected Lead Form */}
              <div className="lg:col-span-5">
                <LeadForm
                  services={allServices}
                  cities={allCities}
                  initialServiceSlug={service.slug}
                  initialCitySlug={city.slug}
                  customHeadline={config.customHeadline}
                  customOfferBadge={config.customOfferBadge || `عرض خاص لأهالي ${city.nameAr}`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Key Service Highlights in This City */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mb-3">
                مميزات طلب {service.nameAr} من شركة مسك في {city.nameAr}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                نحرص على تزويد عملائنا في {city.nameAr} بأعلى درجات الراحة والجودة عبر فريق ميداني متكامل.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feat, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-blue/40 transition">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <span className="font-bold text-brand-navy text-sm sm:text-base">{feat}</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed pr-11">
                    تنفيذ دقيق بمعايير احترافية تناسب منازل ومنشآت {city.nameAr} مع الضمان التام.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Localized FAQ Accordion */}
        <section className="py-16 sm:py-20 bg-brand-bgLight border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FaqAccordion
              faqs={localizedFaqs}
              title={`أسئلة العملاء في ${city.nameAr} حول ${service.nameAr}`}
              subtitle={`كل ما تود معرفته عن الأسعار، المواعيد، والضمان لخدمة ${service.nameAr}`}
            />
          </div>
        </section>

        {/* Other Services in this City */}
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="text-2xl font-extrabold text-brand-navy">
                خدمات أخرى متوفرة في {city.nameAr}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {allServices
                .filter((s) => s.slug !== service.slug)
                .map((otherS) => (
                  <Link
                    key={otherS.id}
                    href={`/${city.slug}/${otherS.slug}`}
                    className="p-3.5 rounded-xl border border-gray-200 hover:border-brand-blue hover:bg-sky-50/50 text-center transition group shadow-sm"
                  >
                    <ServiceIcon name={otherS.iconName} className="w-5 h-5 mx-auto mb-1.5 text-brand-blue group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs sm:text-sm text-gray-800 block">
                      {otherS.nameAr}
                    </span>
                  </Link>
                ))}
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
        services={allServices}
        cities={allCities}
      />

      {/* Mobile Sticky Bar */}
      <MobileStickyBar phone={config.phone} whatsapp={config.whatsapp} />
    </>
  );
}
