import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { webPageSchema } from '@/lib/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.datenschutz' });
  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}/datenschutz`,
      languages: { de: '/de/datenschutz', en: '/en/datenschutz' },
    },
  };
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'datenschutz' });
  const tMeta = await getTranslations({ locale, namespace: 'meta.datenschutz' });

  const schema = webPageSchema({
    name: tMeta('title'),
    description: tMeta('description'),
    url: `/${locale}/datenschutz`,
  });

  const sections: { title: string; body: string }[] = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
    title: t(`sections.${i}.title`),
    body: t(`sections.${i}.body`),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="section-pad">
        <div className="container-site max-w-3xl">
          <h1 className="display-h2 mb-16">{t('h1')}</h1>
          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-lg font-600 text-[#F5F5F0] mb-3">{section.title}</h2>
                <p className="text-[#9CA3AF] leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
