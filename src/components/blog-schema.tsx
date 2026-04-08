import { BlogLocale, KeywordArticle } from '@/lib/blog/keyword-articles';
import { SITE_URL } from '@/lib/site-url';

interface BlogSchemaProps {
  article: KeywordArticle;
  locale: BlogLocale;
  kw: string;
  intro: string;
  steps: string[];
  fails: string[];
  faqAnswer: string;
}

export function BlogSchema({ article, locale, kw, intro, steps, fails, faqAnswer }: BlogSchemaProps) {
  const isHowTo = article.slug.startsWith('how-to-') || article.slug.includes('-save-method-');
  const isFaq = article.slug.includes('safe') || article.slug.includes('not-working') || article.category === 'comparison';

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: kw,
    description: intro,
    totalTime: 'PT1M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'Video URL',
      },
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'ClipKeep',
      },
    ],
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s,
      name: `Step ${i + 1}`,
      url: `${SITE_URL}/blog/${article.slug}${locale === 'en' ? '' : `?locale=${locale}`}#step-${i + 1}`,
    })),
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: fails.map((f) => ({
      '@type': 'Question',
      name: f,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faqAnswer,
      },
    })),
  };

  return (
    <>
      {isHowTo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
        />
      )}
      {isFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
        />
      )}
    </>
  );
}
