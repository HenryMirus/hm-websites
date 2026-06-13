import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ServicesSection from '@/components/sections/ServicesSection';
import CtaBand from '@/components/sections/CtaBand';
import { webPageSchema, serviceSchema } from '@/lib/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.services' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/services`,
      languages: { de: '/de/services', en: '/en/services' },
    },
    openGraph: { title: t('title'), description: t('description') },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.services' });
  const tServices = await getTranslations({ locale, namespace: 'services' });

  const pageSchema = webPageSchema({
    name: t('title'),
    description: t('description'),
    url: `/${locale}/services`,
  });

  const servicesSchemas = [0, 1, 2, 3].map((i) =>
    serviceSchema({
      name: tServices(`items.${i}.title`),
      description: tServices(`items.${i}.body`),
      url: `/${locale}/services`,
    })
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      {servicesSchemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <ServicesSection locale={locale as 'de' | 'en'} />
      <CtaBand locale={locale as 'de' | 'en'} />
    </>
  );
}
