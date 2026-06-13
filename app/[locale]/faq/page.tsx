import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import FAQSection from '@/components/sections/FAQSection';
import CtaBand from '@/components/sections/CtaBand';
import { webPageSchema, faqPageSchema } from '@/lib/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.faq' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/faq`,
      languages: { de: '/de/faq', en: '/en/faq' },
    },
    openGraph: { title: t('title'), description: t('description') },
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.faq' });
  const tFaq = await getTranslations({ locale, namespace: 'faq' });

  const pageSchema = webPageSchema({
    name: t('title'),
    description: t('description'),
    url: `/${locale}/faq`,
    type: 'FAQPage',
  });

  const faqItems = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
    q: tFaq(`items.${i}.q`),
    a: tFaq(`items.${i}.a`),
  }));

  const faqSchema = faqPageSchema(faqItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQSection locale={locale as 'de' | 'en'} />
      <CtaBand locale={locale as 'de' | 'en'} />
    </>
  );
}
