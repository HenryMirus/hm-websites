import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ContactSection from '@/components/sections/ContactSection';
import { webPageSchema } from '@/lib/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.contact' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { de: '/de/contact', en: '/en/contact' },
    },
    openGraph: { title: t('title'), description: t('description') },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.contact' });

  const schema = webPageSchema({
    name: t('title'),
    description: t('description'),
    url: `/${locale}/contact`,
    type: 'ContactPage',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ContactSection locale={locale as 'de' | 'en'} />
    </>
  );
}
