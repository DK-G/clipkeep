import type { Metadata } from 'next';
import { Suspense } from 'react';
import { normalizeLocale, resultText, menuText } from '@/lib/i18n/ui';
import { getJob } from '@/lib/extract/store';
import { ResultClient } from '@/components/result-client';
import type { ExtractionResult } from '@/lib/api/types';
import { SITE_URL } from '@/lib/site-url';

interface Props {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { jobId } = await params;
  const job = await getJob(jobId);
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = resultText[locale];

  if (!job) {
    return { title: t.errorTitle };
  }

  const richTitle = job.media[0]?.text || job.media[0]?.title || `Video from ${job.platform}`;
  const description = `Download this ${job.platform} video extracted via ClipKeep. High quality links available.`;
  const thumb = job.media[0]?.thumbUrl || `${SITE_URL}/icon.png`;

  return {
    title: `${richTitle} | ClipKeep`,
    description,
    openGraph: {
      title: richTitle,
      description,
      images: [thumb],
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: richTitle,
      description,
      images: [thumb],
    },
  };
}

export default async function ResultPage({ params, searchParams }: Props) {
  const { jobId } = await params;
  const sp = await searchParams;
  const locale = normalizeLocale(typeof sp.locale === 'string' ? sp.locale : undefined);
  const t = resultText[locale];
  const menu = menuText[locale];

  const demoJobId = 'job_tiktok_7c1de28c9edb807c';
  const isDemo = jobId === demoJobId;

  const job = await getJob(jobId);

  const initialData: ExtractionResult | null = isDemo ? {
    id: demoJobId,
    platform: 'tiktok',
    status: 'completed',
    variants: [
      {
        url: 'https://v16m.tiktokcdn-us.com/6cf73d053904bf77e0495f1d5c56df18/69c7649e/video/tos/useast5/tos-useast5-ve-0068c004-tx/ooQVIgD9RJbiA6DnIFkIfEtYCJ0EDEMgSnpkBf/?a=1233&bti=OUBzOTg7QGo6OjZAL3AjLTAzYCMxNDNg&ch=0&cr=13&dr=0&er=0&lr=all&net=0&cd=0%7C0%7C0%7C&cv=1&br=1248&bt=624&cs=0&ds=6&ft=4bUg3M9h8Zmo0F5M8x4jV0DrinWrKsd.&mime_type=video_mp4&qs=0&rc=ZDlpPGQzNzQ4ZDxlOTZpM0BpajVxNnQ5cmo8eDMzZzczNEBeYjY2XzMtXmExYWAyL14uYSMtNC4vMmRzMTJgLS1kMS9zcw%3D%3D&vvpl=1&l=202603272316587B644EDC06E8A4340777&btag=e00090200',
        quality: 'HD No Watermark',
        ext: 'mp4',
        type: 'video',
      },
      {
        url: 'https://v16m.tiktokcdn-us.com/2e6914b66975cd2ced1671e20c2145a1/69c7649e/video/tos/useast5/tos-useast5-pve-0068-tx/owIKEQBxIkNxAkBzEi6sfiGMBk6ChiGwpzUyA8/?a=1233&bti=OUBzOTg7QGo6OjZAL3AjLTAzYCMxNDNg&ch=0&cr=13&dr=0&er=0&lr=all&net=0&cd=0%7C0%7C0%7C&cv=1&br=1306&bt=653&cs=0&ds=3&ft=4bUg3M9h8Zmo0F5M8x4jV0DrinWrKsd.&mime_type=video_mp4&qs=0&rc=ODQzaTM0N2g2ODs4OjY7ZUBpajVxNnQ5cmo8eDMzZzczNEBfNDNjYy5jNS4xYTQ1M19gYSMtNC4vMmRzMTJgLS1kMS9zcw%3D%3D&vvpl=1&l=202603272316587B644EDC06E8A4340777&btag=e00090200',
        quality: 'Watermarked',
        ext: 'mp4',
        type: 'video',
      }
    ],
    author_name: 'TikTok',
    author_handle: 'tiktok',
    title: 'Our response to the Supreme Court decision.',
    thumbnail_url: 'https://p16-common-sign.tiktokcdn-us.com/tos-useast5-p-0068-tx/osTE4EFiwIDeSuAAMKAgfoEYnVQTRhgDSAipJC~tplv-tiktokx-cropcenter-q:300:400:q72.jpeg?dr=8596&refresh_token=b506b93a&x-expires=1774738800&x-signature=oDiF6Dwf%2BcrimPtr827EKWiro1k%3D&t=bacd0480&ps=933b5bde&shp=d05b14bd&shcp=1d1a97fc&idc=useast5&sc=cover&biz_tag=tt_video&s=AWEME_DETAIL',
    source_url: 'https://www.tiktok.com/@tiktok/video/7460937381265411370',
    warnings: [],
  } : job ? {
    id: job.id,
    platform: job.platform,
    status: job.status,
    variants: job.media.map(m => ({
      url: m.downloadUrl || m.url || '',
      quality: m.quality || 'original',
      ext: m.type === 'video' ? 'mp4' : m.type === 'image' ? 'jpg' : 'mp3',
      type: m.type as 'video' | 'image' | 'audio' | 'gif',
    })).filter(v => v.url !== ''),
    author_name: job.media[0]?.authorName || undefined,
    author_handle: job.media[0]?.authorHandle || undefined,
    title: job.media[0]?.text || job.media[0]?.title || undefined,
    thumbnail_url: job.media[0]?.thumbUrl || undefined,
    source_url: job.sourceUrl,
    warnings: job.warnings || [],
  } : null;

  const jsonLd = initialData?.status === 'completed' ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'VideoObject',
        name: initialData.title || `Video from ${initialData.platform}`,
        description: initialData.title || 'Viral video extracted via ClipKeep.',
        thumbnailUrl: initialData.thumbnail_url,
        uploadDate: job?.createdAt || new Date().toISOString(),
        contentUrl: `${SITE_URL}/result/${jobId}`,
        embedUrl: `${SITE_URL}/result/${jobId}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: menu.downloads,
            item: `${SITE_URL}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: initialData?.platform ? `${initialData.platform.toUpperCase()} Downloader` : 'Downloader',
            item: `${SITE_URL}/download-${initialData?.platform || 'tiktok'}-video?locale=${locale}`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: initialData?.title || 'Result',
            item: `${SITE_URL}/result/${jobId}?locale=${locale}`
          }
        ]
      }
    ]
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-12 text-slate-600">{t.loading}...</div>}>
        <ResultClient jobId={jobId} locale={locale} initialData={initialData} />
      </Suspense>
    </>
  );
}
