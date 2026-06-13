const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hmwebsites.de';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HM Websites',
  url: SITE_URL,
  email: 'mrs.hrny@gmail.com',
  telephone: '+49015750126303',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Pantaleonstr. 20',
    addressLocality: 'Buchholz',
    postalCode: '53567',
    addressCountry: 'DE',
  },
  description:
    'Premium web design agency building custom websites with cinematic motion design. Built by AI agents.',
  foundingDate: '2025',
  areaServed: ['DE', 'AT', 'CH', 'EU'],
  knowsLanguage: ['de', 'en'],
};

export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HM Websites',
  url: SITE_URL,
  description:
    'Award-winning web design agency. Custom websites with cinematic GSAP motion, built by AI agents.',
  publisher: {
    '@type': 'Organization',
    name: 'HM Websites',
  },
};

export function webPageSchema({
  name,
  description,
  url,
  type = 'WebPage',
}: {
  name: string;
  description: string;
  url: string;
  type?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url: `${SITE_URL}${url}`,
    isPartOf: { '@type': 'WebSite', url: SITE_URL },
    publisher: organizationSchema,
  };
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function serviceSchema(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Web Design & Development',
    name: service.name,
    description: service.description,
    url: `${SITE_URL}${service.url}`,
    provider: {
      '@type': 'Organization',
      name: 'HM Websites',
      url: SITE_URL,
    },
    areaServed: ['DE', 'AT', 'CH', 'EU'],
  };
}
