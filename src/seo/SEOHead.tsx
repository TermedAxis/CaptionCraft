import { useEffect } from 'react';
import { PageSEO, SITE_NAME, DEFAULT_OG_IMAGE } from './seo-config';

interface SEOHeadProps {
  seo: PageSEO;
}

function setMeta(selector: string, value: string, attr = 'content') {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    const match = selector.match(/\[([^=]+)="([^"]+)"\]/);
    if (match) {
      el.setAttribute(match[1], match[2]);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function SEOHead({ seo }: SEOHeadProps) {
  useEffect(() => {
    const {
      title,
      description,
      canonical,
      ogImage = DEFAULT_OG_IMAGE,
      keywords,
      ogType = 'website',
    } = seo;

    document.title = title;

    setMeta('meta[name="description"]', description);
    if (keywords) setMeta('meta[name="keywords"]', keywords);

    setLink('canonical', canonical);

    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[property="og:image"]', ogImage);
    setMeta('meta[property="og:type"]', ogType);
    setMeta('meta[property="og:site_name"]', SITE_NAME);

    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', ogImage);
    setMeta('meta[name="twitter:card"]', 'summary_large_image');

    return () => {
      document.title = `${SITE_NAME} – AI Caption, Script & Thumbnail Generator for Creators`;
    };
  }, [seo]);

  return null;
}
