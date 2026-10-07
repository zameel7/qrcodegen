import { faqs } from '@/app/faq';
import { siteDescription, siteName, siteUrl } from '@/lib/site';

const author = {
  '@type': 'Person',
  name: 'Zameel Hassan',
  url: 'https://www.zameel7.me',
};

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      inLanguage: 'en',
      publisher: author,
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteUrl}/#app`,
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      image: `${siteUrl}/opengraph-image`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author,
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
    />
  );
}
