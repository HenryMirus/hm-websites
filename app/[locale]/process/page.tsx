import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ProcessSection from '@/components/sections/ProcessSection';
import CtaBand from '@/components/sections/CtaBand';
import { webPageSchema } from '@/lib/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.process' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/process`,
      languages: { de: '/de/process', en: '/en/process' },
    },
    openGraph: { title: t('title'), description: t('description') },
  };
}

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.process' });

  const schema = webPageSchema({
    name: t('title'),
    description: t('description'),
    url: `/${locale}/process`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProcessSection locale={locale as 'de' | 'en'} />
      <CtaBand locale={locale as 'de' | 'en'} />
    </>
  );
}
