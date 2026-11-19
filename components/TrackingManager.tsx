'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export interface TrackingPixelsProps {
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
  snapchatPixelId?: string | null;
  googleAdsId?: string | null;
  gtmId?: string | null;
}

export function trackConversion(
  eventType: 'Lead' | 'Contact',
  payload?: {
    channel?: 'phone' | 'whatsapp';
    service?: string;
    city?: string;
    value?: number;
    currency?: string;
    [key: string]: unknown;
  }
) {
  if (typeof window === 'undefined') return;

  try {
    if (eventType === 'Lead') {
      // 1. Meta Pixel
      if (typeof (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq === 'function') {
        (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'Lead', {
          content_name: payload?.service || 'طلب خدمة منزلية',
          status: 'success',
          ...payload,
        });
      }

      // 2. TikTok Pixel
      if (typeof (window as unknown as { ttq?: { track: (...args: unknown[]) => void } }).ttq?.track === 'function') {
        (window as unknown as { ttq: { track: (...args: unknown[]) => void } }).ttq.track('SubmitForm', {
          contents: [{ content_name: payload?.service || 'طلب خدمة' }],
          ...payload,
        });
      }

      // 3. Snapchat Pixel
      if (typeof (window as unknown as { snaptr?: (...args: unknown[]) => void }).snaptr === 'function') {
        (window as unknown as { snaptr: (...args: unknown[]) => void }).snaptr('track', 'SIGN_UP', {
          item_category: payload?.service,
          ...payload,
        });
      }

      // 4. Google Ads / Analytics
      if (typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: payload?.service,
          ...payload,
        });
      }
    } else if (eventType === 'Contact') {
      // Direct Call or WhatsApp Click
      const channel = payload?.channel || 'phone';

      // 1. Meta Pixel
      if (typeof (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq === 'function') {
        (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'Contact', {
          channel,
          ...payload,
        });
      }

      // 2. TikTok Pixel
      if (typeof (window as unknown as { ttq?: { track: (...args: unknown[]) => void } }).ttq?.track === 'function') {
        (window as unknown as { ttq: { track: (...args: unknown[]) => void } }).ttq.track('Contact', {
          channel,
          ...payload,
        });
      }

      // 3. Snapchat Pixel
      if (typeof (window as unknown as { snaptr?: (...args: unknown[]) => void }).snaptr === 'function') {
        (window as unknown as { snaptr: (...args: unknown[]) => void }).snaptr('track', 'CUSTOM_EVENT_1', {
          action: channel,
          ...payload,
        });
      }

      // 4. Google Ads / Analytics
      if (typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'contact_click', {
          event_category: 'lead_generation',
          event_label: channel,
          channel,
          ...payload,
        });
      }
    }
  } catch (err) {
    console.warn('[Tracking Engine] Error tracking conversion event:', err);
  }
}

export default function TrackingManager({
  metaPixelId,
  tiktokPixelId,
  snapchatPixelId,
  googleAdsId,
  gtmId,
}: TrackingPixelsProps) {
  const cleanMeta = metaPixelId?.trim();
  const cleanTiktok = tiktokPixelId?.trim();
  const cleanSnapchat = snapchatPixelId?.trim();
  const cleanGoogleAds = googleAdsId?.trim();
  const cleanGtm = gtmId?.trim();

  useEffect(() => {
    // Helpful console message in dev
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 [TrackingManager] Active pixels:', {
        Meta: cleanMeta || 'None',
        TikTok: cleanTiktok || 'None',
        Snapchat: cleanSnapchat || 'None',
        GoogleAds: cleanGoogleAds || 'None',
        GTM: cleanGtm || 'None',
      });
    }
  }, [cleanMeta, cleanTiktok, cleanSnapchat, cleanGoogleAds, cleanGtm]);

  return (
    <>
      {/* 1. Meta Pixel */}
      {cleanMeta && (
        <Script
          id={`meta-pixel-${cleanMeta}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${cleanMeta}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* 2. TikTok Pixel */}
      {cleanTiktok && (
        <Script
          id={`tiktok-pixel-${cleanTiktok}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                ttq.load('${cleanTiktok}');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      )}

      {/* 3. Snapchat Pixel */}
      {cleanSnapchat && (
        <Script
          id={`snapchat-pixel-${cleanSnapchat}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
              {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
              a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
              r.src=n;var u=t.getElementsByTagName(s)[0];
              u.parentNode.insertBefore(r,u);})(window,document,
              'https://sc-static.net/scevent.min.js');
              snaptr('init', '${cleanSnapchat}');
              snaptr('track', 'PAGE_VIEW');
            `,
          }}
        />
      )}

      {/* 4. Google Ads / Tag */}
      {cleanGoogleAds && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${cleanGoogleAds}`}
            strategy="afterInteractive"
          />
          <Script
            id={`google-ads-${cleanGoogleAds}`}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${cleanGoogleAds}');
              `,
            }}
          />
        </>
      )}

      {/* 5. Google Tag Manager (GTM) */}
      {cleanGtm && (
        <Script
          id={`gtm-${cleanGtm}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${cleanGtm}');
            `,
          }}
        />
      )}
    </>
  );
}
