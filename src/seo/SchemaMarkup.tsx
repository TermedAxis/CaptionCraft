import { useEffect } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

interface SchemaProps {
  id: string;
  schema: object;
}

function injectSchema(id: string, schema: object) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function removeSchema(id: string) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

export function SchemaMarkup({ id, schema }: SchemaProps) {
  useEffect(() => {
    injectSchema(id, schema);
    return () => removeSchema(id);
  }, [id, schema]);
  return null;
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };
  return <SchemaMarkup id="schema-faq" schema={schema} />;
}

export function SoftwareAppSchema({
  name,
  description,
  url,
  category = 'SocialNetworkingApplication',
}: {
  name: string;
  description: string;
  url: string;
  category?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    applicationCategory: category,
    description,
    url,
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '8000' },
  };
  return <SchemaMarkup id="schema-software" schema={schema} />;
}

export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Organization', name: 'Media Wizard' },
    publisher: {
      '@type': 'Organization',
      name: 'Media Wizard',
      logo: { '@type': 'ImageObject', url: 'https://mediawizard.app/og-image.png' },
    },
  };
  return <SchemaMarkup id="schema-article" schema={schema} />;
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <SchemaMarkup id="schema-breadcrumb" schema={schema} />;
}
