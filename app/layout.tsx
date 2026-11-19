import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://meskco.com'),
  title: {
    default: 'شركة مسك للخدمات المنزلية | تنظيف، نقل عفش، مكافحة، عزل، صيانة',
    template: '%s | شركة مسك للخدمات المنزلية',
  },
  description: 'شركة مسك الرائدة في الخدمات المنزلية المتكاملة: تنظيف منازل وفلل، نقل عفش وتغليف، مكافحة حشرات، عزل أسطح وفوم، صيانة أفران ومكيفات، وتنسيق حدائق بأعلى جودة وضمان.',
  keywords: [
    'شركة مسك للخدمات المنزلية',
    'خدمات تنظيف منازل',
    'نقل عفش وأثاث',
    'مكافحة حشرات ورش مبيدات',
    'عزل أسطح وخزانات',
    'عزل فوم',
    'صيانة أفران',
    'غسيل وصيانة مكيفات',
    'كشف تسربات المياه',
    'تنسيق حدائق وعشب صناعي',
    'تصليح وصيانة أبواب',
  ],
  authors: [{ name: 'شركة مسك للخدمات المنزلية' }],
  creator: 'شركة مسك للخدمات المنزلية',
  publisher: 'شركة مسك للخدمات المنزلية',
  icons: {
    icon: '/images/logo-badge.png',
    shortcut: '/images/logo-badge.png',
    apple: '/images/logo-badge.png',
  },
  openGraph: {
    title: 'شركة مسك للخدمات المنزلية | حلول متكاملة بجودة وضمان',
    description: 'نقدم أرقى الخدمات المنزلية المتكاملة بأحدث المعدات والكوادر الاحترافية وضمان شامل لراحتكم.',
    url: 'https://meskco.com',
    siteName: 'شركة مسك للخدمات المنزلية',
    images: [
      {
        url: '/images/logo-badge.png',
        width: 800,
        height: 600,
        alt: 'شعار شركة مسك للخدمات المنزلية',
      },
    ],
    locale: 'ar_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شركة مسك للخدمات المنزلية',
    description: 'أفضل الخدمات المنزلية المتكاملة بدقة وأمان وضمان شامل.',
    images: ['/images/logo-badge.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-cairo bg-white text-brand-navy antialiased selection:bg-brand-blue/20 selection:text-brand-navy">
        {children}
      </body>
    </html>
  );
}
