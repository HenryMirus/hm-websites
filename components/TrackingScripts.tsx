"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;
const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC;
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export default function TrackingScripts() {
  const { consent } = useConsent();

  // Kein Tracking auf dem Portal — nur notwendige Cookies
  if (typeof window !== "undefined" && window.location.hostname.startsWith("clients.")) return null;

  if (!consent.decided) return null;

  return (
    <>
      {/* ── Umami, selbst gehostet (Analytics consent) ── */}
      {consent.analytics && UMAMI_SRC && UMAMI_WEBSITE_ID && (
        <Script
          src={UMAMI_SRC}
          strategy="afterInteractive"
          data-website-id={UMAMI_WEBSITE_ID}
          data-domains="hm-labs.tech,hm-labs.de"
        />
      )}

      {/* ── Microsoft Clarity (Analytics consent) ──
          Offizielles Snippet. consentv2 ist seit 31.10.2025 für Besucher aus
          dem EWR Pflicht; ad_Storage bleibt denied, es läuft keine Werbung. */}
      {consent.analytics && CLARITY_PROJECT_ID && (
        <Script id="clarity-init" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","${CLARITY_PROJECT_ID}");
          window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
        `}</Script>
      )}

      {/* ── Google Analytics 4 (Analytics consent) ── */}
      {consent.analytics && GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}', { anonymize_ip: true });
          `}</Script>
        </>
      )}

      {/* ── Google Ads (Marketing consent) ── */}
      {consent.marketing && GOOGLE_ADS_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}</Script>
        </>
      )}

      {/* ── Meta Pixel (Marketing consent) ── */}
      {consent.marketing && META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){
            if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}</Script>
      )}

      {/* ── LinkedIn Insight Tag (Marketing consent) ── */}
      {consent.marketing && LINKEDIN_PARTNER_ID && (
        <Script id="linkedin-insight" strategy="afterInteractive">{`
          _linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          (function(l){
            if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}
            var s=document.getElementsByTagName("script")[0];
            var b=document.createElement("script");
            b.type="text/javascript";b.async=true;
            b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b,s)
          })(window.lintrk);
        `}</Script>
      )}
    </>
  );
}
