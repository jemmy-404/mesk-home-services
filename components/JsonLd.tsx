import React from 'react';

interface JsonLdProps {
  businessName?: string;
  url?: string;
  telephone?: string;
  address?: string;
  service?: {
    name: string;
    description: string;
    url: string;
  };
  faqs?: { question: string; answer: string }[];
}

export default function JsonLd({
  businessName = 'شركة مسك للخدمات المنزلية',
  url = 'https://meskco.com',
  telephone = '0571319638',
  address = 'المركز الرئيسي للخدمات المنزلية',
  service,
  faqs,
}: JsonLdProps) {
  // 1. HomeAndConstructionBusiness / LocalBusiness schema
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: businessName,
    url: url,
    telephone: telephone,
    logo: 'https://meskco.com/images/logo-badge.png',
    image: 'https://meskco.com/images/logo-badge.png',
    description: 'شركة مسك متخصصة في تقديم أرقى الخدمات المنزلية الشاملة من تنظيف، نقل عفش، مكافحة حشرات، عزل أسطح وخزانات، صيانة أفران ومكيفات، وتنسيق حدائق بأعلى جودة وضمان.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'المركز الرئيسي',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    priceRange: '$$',
  };

  // 2. Service schema (if on service page)
  const serviceSchema = service
    ? {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: {
          '@type': 'HomeAndConstructionBusiness',
          name: businessName,
          url: url,
          telephone: telephone,
        },
        url: service.url,
      }
    : null;

  // 3. FAQPage schema (if FAQs provided)
  const faqSchema =
    faqs && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
