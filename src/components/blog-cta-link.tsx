'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics/gtag';

type BlogCtaLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  locale: 'en' | 'es' | 'ar' | 'ja' | 'pt' | 'fr' | 'de' | 'tr' | 'id' | 'hi';
  slug: string;
  ctaType: 'tool' | 'support';
  ctaPosition: 'header' | 'main' | 'problem' | 'compare';
};

export function BlogCtaLink({ href, className, children, locale, slug, ctaType, ctaPosition }: BlogCtaLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackEvent('blog_cta_click', {
          locale,
          slug,
          cta_type: ctaType,
          cta_position: ctaPosition,
          destination: href,
        });
      }}
    >
      {children}
    </Link>
  );
}



