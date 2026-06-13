import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import ValueProps from '@/components/sections/ValueProps';
import ProcessTeaser from '@/components/sections/ProcessTeaser';
import FAQTeaser from '@/components/sections/FAQTeaser';
import CtaBand from '@/components/sections/CtaBand';
import { webPageSchema } from '@/lib/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: { de: '/de', en: '/en' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });

  const schema = webPageSchema({
    name: t('title'),
    description: t('description'),
    url: `/${locale}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Hero locale={locale as 'de' | 'en'} />
      <ValueProps locale={locale as 'de' | 'en'} />
      <ProcessTeaser locale={locale as 'de' | 'en'} />
      <FAQTeaser locale={locale as 'de' | 'en'} />
      <CtaBand locale={locale as 'de' | 'en'} />
    </>
  );
}
