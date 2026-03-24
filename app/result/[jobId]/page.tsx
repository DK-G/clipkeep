import type { Metadata } from 'next';
import { Suspense } from 'react';
import { normalizeLocale, resultText, menuText } from '@/lib/i18n/ui';
import { getJob } from '@/lib/extract/store';
import { ResultClient } from '@/components/result-client';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import type { ExtractionResult } from '@/lib/api/types';

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

  const title = job.media[0]?.title || `Video from ${job.platform}`;
  const description = `Download this ${job.platform} video extracted via ClipKeep. High quality links available.`;
  const thumb = job.media[0]?.thumbUrl || 'https://clipkeep.net/icon.png';

  return {
    title: `${title} | ClipKeep`,
    description,
    openGraph: {
      title,
      description,
      images: [thumb],
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title,
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
  
  const job = await getJob(jobId);
  
  const initialData: ExtractionResult | null = job ? {
    id: job.id,
    platform: job.platform,
    status: job.status,
    variants: job.media.map(m => ({
      url: m.downloadUrl || m.url || '',
      quality: m.quality || 'original',
      ext: m.type === 'video' ? 'mp4' : m.type === 'image' ? 'jpg' : 'mp3',
      type: m.type as 'video' | 'image' | 'audio' | 'gif',
      thumbUrl: m.thumbUrl || undefined,
    })).filter(v => v.url !== ''),
    author_name: job.media[0]?.title || undefined, // Fallback
    title: job.media[0]?.title || undefined,
    thumbnail_url: job.media[0]?.thumbUrl || undefined,
    warnings: job.warnings || [],
  } : null;

  const videoSchema = initialData?.status === 'completed' ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    'name': initialData.title || `Video from ${initialData.platform}`,
    'description': initialData.title || 'Viral video extracted via ClipKeep.',
    'thumbnailUrl': initialData.thumbnail_url,
    'uploadDate': job?.createdAt || new Date().toISOString(),
    'contentUrl': `https://clipkeep.net/result/${jobId}`,
    'embedUrl': `https://clipkeep.net/result/${jobId}`,
  } : null;

  const breadcrumbs = [
    { name: menu.downloads, item: '/' },
    { name: initialData?.platform ? `${initialData.platform.toUpperCase()} Downloader` : 'Downloader', item: `/download-${initialData?.platform || 'tiktok'}-video?locale=${locale}` },
    { name: initialData?.title || 'Result', item: `/result/${jobId}?locale=${locale}` }
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-12 text-slate-600">{t.loading}...</div>}>
        <ResultClient jobId={jobId} locale={locale} initialData={initialData} />
      </Suspense>
    </>
  );
}
