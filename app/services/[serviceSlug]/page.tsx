import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getServiceBySlug,
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
  ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ServicePageProps {
  params: {
    serviceSlug: string;
  };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.serviceSlug);
  if (!service) {
    return {
      title: 'الخدمة غير موجودة | شركة مسك',
    };
  }

  return {
    title: service.metaTitle || `${service.nameAr} بأعلى جودة وضمان | شركة مسك`,
    description: service.metaDescription || service.shortDesc,
    alternates: {
      canonical: `https://meskco.com/services/${service.slug}`,
    },
    openGraph: {
      title: service.metaTitle || `${service.nameAr} | شركة مسك للخدمات المنزلية`,
      description: service.shortDesc,
      url: `https://meskco.com/services/${service.slug}`,
      images: ['/images/logo-badge.png'],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await getServiceBySlug(params.serviceSlug);
  if (!service) {
    notFound();
  }

  const routePath = `/services/${service.slug}`;
  const [config, allServices, allCities] = await Promise.all([
    resolvePageConfig(routePath),
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
        url={`https://meskco.com/services/${service.slug}`}
        telephone={config.phone}
        service={{
          name: service.nameAr,
          description: service.shortDesc,
          url: `https://meskco.com/services/${service.slug}`,
        }}
        faqs={service.faqs}
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
            <span className="text-gray-400">خدماتنا</span>
            <span>/</span>
            <span className="font-bold text-brand-navy">{service.nameAr}</span>
          </div>
        </div>

        {/* Hero & Lead Form */}
        <section className="bg-gradient-to-b from-sky-50/60 via-white to-gray-50/50 py-10 lg:py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Service Info */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cream border border-brand-orange/30 text-brand-navy text-xs font-bold">
                  <ServiceIcon name={service.iconName} className="w-4 h-4 text-brand-orange" />
                  <span>خدمة احترافية معتمدة وضمان شامل</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy leading-tight">
                  {config.customHeadline || service.nameAr}
                </h1>

                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Key features bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-brand-blue mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <a
                    href={`tel:${config.phone}`}
                    className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow-lg transition transform active:scale-95"
                  >
                    <PhoneCall className="w-5 h-5 animate-bounce" />
                    <span>اتصل الآن ({config.phone})</span>
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

              {/* Form column */}
              <div className="lg:col-span-5">
                <LeadForm
                  services={allServices}
                  cities={allCities}
                  initialServiceSlug={service.slug}
                  customHeadline={config.customHeadline}
                  customOfferBadge={config.customOfferBadge}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Full Content Section */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none text-right">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mb-6 pb-3 border-b border-gray-100">
                تفاصيل وخطة تنفيذ {service.nameAr}
              </h2>
              <div className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line space-y-4">
                {service.fullContent}
              </div>
            </div>
          </div>
        </section>

        {/* City Coverage for This Service (Internal Programmatic SEO Linking) */}
        <section className="py-14 bg-brand-bgLight border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-brand-orange text-xs font-bold block mb-1">
                خدمة سريعة في منطقتك
              </span>
              <h3 className="text-2xl font-extrabold text-brand-navy">
                احصل على {service.nameAr} في مدينتك
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {allCities.map((city) => (
                <Link
                  key={city.id}
                  href={`/${city.slug}/${service.slug}`}
                  className="bg-white hover:bg-brand-blue hover:text-white p-3.5 rounded-xl border border-gray-200 text-center transition group shadow-sm"
                >
                  <MapPin className="w-4 h-4 mx-auto mb-1 text-brand-orange group-hover:text-white transition" />
                  <span className="font-bold text-xs sm:text-sm block">{service.nameAr} في {city.nameAr}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FaqAccordion
              faqs={service.faqs}
              title={`الأسئلة الأكثر شيوعاً عن ${service.nameAr}`}
              subtitle="إجابات دقيقة وافية لمساعدتك في اتخاذ القرار الأمثل"
            />
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
