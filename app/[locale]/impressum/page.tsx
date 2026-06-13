import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { webPageSchema } from '@/lib/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.impressum' });
  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}/impressum`,
      languages: { de: '/de/impressum', en: '/en/impressum' },
    },
  };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'impressum' });
  const tMeta = await getTranslations({ locale, namespace: 'meta.impressum' });

  const schema = webPageSchema({
    name: tMeta('title'),
    description: tMeta('description'),
    url: `/${locale}/impressum`,
  });

  const content = t('content');
  const paragraphs = content.split('\n\n');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="section-pad">
        <div className="container-site max-w-3xl">
          <h1 className="display-h2 mb-16">{t('h1')}</h1>
          <div className="space-y-6">
            {paragraphs.map((para, i) => {
              const isBold = para.startsWith('**') && para.includes('**');
              if (isBold) {
                const cleaned = para.replace(/\*\*/g, '');
                return (
                  <h2 key={i} className="text-lg font-600 text-[#F5F5F0] mt-10 first:mt-0">
                    {cleaned}
                  </h2>
                );
              }
              return (
                <p key={i} className="text-[#9CA3AF] leading-relaxed whitespace-pre-line">
                  {para}
                </p>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
