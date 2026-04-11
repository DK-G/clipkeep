"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { trackEvent } from "@/lib/analytics/gtag";
import { resultText, localeDir, Locale, menuText } from "@/lib/i18n/ui";
import type { ApiSuccess, ApiFailure, ExtractionResult } from "@/lib/api/types";
import type { Platform } from "@/lib/extract/types";
import { AdsterraNative } from "@/components/ads/native-banner";
import { DownloadItem } from "@/components/download-item";
import { GallerySection } from "@/components/gallery-section";
import { PlatformIcon } from "@/components/platform-icons";
import { useHistory } from "@/hooks/use-history";
import { usePlatformUsage } from "@/hooks/use-platform-usage";
import { ExtractorForm } from "@/components/extractor-form";
import { DownloadGuard } from "@/components/download-guard";


interface ResultClientProps {
  jobId: string;
  locale: Locale;
  initialData: ExtractionResult | null;
}

const relatedSectionText: Record<Locale, {
  trendingBody: (platform: string) => string;
  trendingLink: string;
  latestLink: string;
  latestBody: (platform: string) => string;
  savedCount: (count: number) => string;
}> = {
  en: {
    trendingBody: (platform) => `More ${platform} clips that are already performing well on ClipKeep.`,
    trendingLink: 'View all trending',
    latestLink: 'Browse latest',
    latestBody: (platform) => `Fresh ${platform} extractions you can open next if you want newer posts instead of top performers.`,
    savedCount: (count) => `${count} saved`,
  },
  ja: {
    trendingBody: (platform) => `ClipKeepで既に反応の良い${platform}クリップをさらに表示します。`,
    trendingLink: 'トレンドをすべて見る',
    latestLink: '最新を見る',
    latestBody: (platform) => `人気順ではなく新しい投稿を見たい場合は、最新の${platform}抽出を次に開けます。`,
    savedCount: (count) => `${count}件保存`,
  },
  ar: {
    trendingBody: (platform) => `المزيد من مقاطع ${platform} التي تحقق أداءً جيداً بالفعل على ClipKeep.`,
    trendingLink: 'عرض جميع الرائج',
    latestLink: 'تصفح الأحدث',
    latestBody: (platform) => `أحدث عمليات استخراج ${platform} التي يمكنك فتحها بعد ذلك إذا أردت منشورات أحدث بدلاً من الأعلى أداءً.`,
    savedCount: (count) => `${count} محفوظ`,
  },
  es: {
    trendingBody: (platform) => `Más clips de ${platform} que ya están funcionando bien en ClipKeep.`,
    trendingLink: 'Ver todo lo trending',
    latestLink: 'Ver lo último',
    latestBody: (platform) => `Extracciones recientes de ${platform} que puedes abrir después si prefieres publicaciones nuevas en lugar de las más vistas.`,
    savedCount: (count) => `${count} guardados`,
  },
  pt: {
    trendingBody: (platform) => `Mais clipes de ${platform} que já estão performando bem no ClipKeep.`,
    trendingLink: 'Ver todos os trends',
    latestLink: 'Ver últimos',
    latestBody: (platform) => `Extrações recentes de ${platform} para abrir em seguida se você quiser posts mais novos em vez dos mais fortes.`,
    savedCount: (count) => `${count} salvos`,
  },
  fr: {
    trendingBody: (platform) => `Plus de clips ${platform} qui performent déjà bien sur ClipKeep.`,
    trendingLink: 'Voir toutes les tendances',
    latestLink: 'Voir les nouveautés',
    latestBody: (platform) => `Nouvelles extractions ${platform} à ouvrir ensuite si vous préférez les publications récentes aux contenus les plus performants.`,
    savedCount: (count) => `${count} enregistrés`,
  },
  id: {
    trendingBody: (platform) => `Lebih banyak klip ${platform} yang sudah berkinerja baik di ClipKeep.`,
    trendingLink: 'Lihat semua tren',
    latestLink: 'Lihat terbaru',
    latestBody: (platform) => `Ekstraksi ${platform} terbaru yang bisa Anda buka berikutnya jika ingin posting baru, bukan yang performanya tertinggi.`,
    savedCount: (count) => `${count} tersimpan`,
  },
  hi: {
    trendingBody: (platform) => `ClipKeep पर अच्छा प्रदर्शन कर रहे और ${platform} क्लिप देखें।`,
    trendingLink: 'सभी ट्रेंडिंग देखें',
    latestLink: 'नए देखें',
    latestBody: (platform) => `अगर आप टॉप परफॉर्मर की जगह नई पोस्ट देखना चाहते हैं, तो अगली बार ${platform} की ताज़ा एक्सट्रैक्शन खोलें।`,
    savedCount: (count) => `${count} सेव`,
  },
  de: {
    trendingBody: (platform) => `Mehr ${platform}-Clips, die auf ClipKeep bereits gut performen.`,
    trendingLink: 'Alle Trends ansehen',
    latestLink: 'Neueste ansehen',
    latestBody: (platform) => `Frische ${platform}-Extraktionen, die Sie als Nächstes öffnen können, wenn Sie neuere Posts statt Top-Performer möchten.`,
    savedCount: (count) => `${count} gespeichert`,
  },
  tr: {
    trendingBody: (platform) => `ClipKeep uzerinde halihazirda iyi performans gosteren daha fazla ${platform} klibi.`,
    trendingLink: 'Tum trendleri gor',
    latestLink: 'Yenileri gor',
    latestBody: (platform) => `En iyi performans gosterenler yerine daha yeni gonderiler istiyorsan sonraki olarak acabilecegin yeni ${platform} cikarmalari.`,
    savedCount: (count) => `${count} kaydedildi`,
  },
};

export function ResultClient({ jobId, locale, initialData }: ResultClientProps) {
  const t = resultText[locale] || resultText.en;
  const menu = menuText[locale] || menuText.en;
  const relatedText = relatedSectionText[locale] || relatedSectionText.en;
  const dir = localeDir(locale);

  const { addToHistory } = useHistory();
  const { recordPlatformUse } = usePlatformUsage();
  const [data, setData] = useState<ExtractionResult | null>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(
    !initialData || (initialData?.status !== "completed" && initialData?.status !== "failed")
  );
  
  const [guardActive, setGuardActive] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ url: string; index: number } | null>(null);
  const [sessionDownloadCount, setSessionDownloadCount] = useState(0);
  const guardStartRef = useRef<number | null>(null);

  const getGuardDuration = (count: number) => {
    if (count < 2) return 1500;
    if (count < 4) return 2000;
    return 2500;
  };

  const handleDownloadRequest = (url: string, index: number) => {
    setPendingDownload({ url, index });
    setGuardActive(true);
    guardStartRef.current = Date.now();
    trackEvent("download_guard_start", { 
      platform: data?.platform, 
      session_download_count: sessionDownloadCount + 1 
    });
  };

  const handleGuardComplete = () => {
    setGuardActive(false);
    guardStartRef.current = null;
    if (pendingDownload) {
      if (data?.platform === 'telegram') {
        fetch(`/api/v1/gallery/access/${jobId}?locale=${locale}&index=${pendingDownload.index}`, { method: 'POST' })
          .catch((err) => console.error('Failed to record telegram media access:', err));
      }

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const targetUrl = new URL(pendingDownload.url, window.location.origin);
      const isSameOrigin = targetUrl.origin === window.location.origin;

      if (isMobile && isSameOrigin) {
        window.location.assign(targetUrl.toString());
      } else {
        const link = document.createElement("a");
        link.href = targetUrl.toString();
        link.setAttribute("download", "");
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      const newCount = sessionDownloadCount + 1;
      setSessionDownloadCount(newCount);
      trackEvent("download_guard_complete", {
        platform: data?.platform,
        session_download_count: newCount
      });
      trackEvent("download_actual_start", {
        platform: data?.platform,
        session_download_count: newCount,
        mobile: isMobile,
        same_origin: isSameOrigin
      });
      trackEvent("max_session_depth", { depth: newCount });
    }
  };

  useEffect(() => {
    return () => {
      if (guardStartRef.current) {
        trackEvent("abandon_after_guard", { 
          platform: data?.platform,
          duration_waited: Date.now() - guardStartRef.current,
          session_download_count: sessionDownloadCount
        });
      }
    };
  }, [data?.platform, sessionDownloadCount]);

  useEffect(() => {
    if (!jobId || data?.status === "completed" || data?.status === "failed") return;

    let pollInterval: NodeJS.Timeout;

    async function fetchResult() {
      try {
        const res = await fetch(`/api/v1/extract/jobs/${jobId}`);
        const json = (await res.json()) as ApiSuccess<ExtractionResult> | ApiFailure;

        if (json.ok) {
          setData(json.data);
          if (json.data.status === "completed" || json.data.status === "failed") {
            setLoading(false);
            if (json.data.status === "completed") {
              trackEvent("processing_complete", { 
                platform: json.data.platform, 
                jobId,
                total_session_downloads: sessionDownloadCount
              });
            }
            if (json.data.status === "failed") {
              setError(t.errorTitle);
              trackEvent("error_displayed", { platform: json.data.platform, jobId, error: "job_failed" });
            }
          } else {
            pollInterval = setTimeout(fetchResult, 2000);
          }
        } else {
          setError(json.error.message || t.errorTitle);
          setLoading(false);
          trackEvent("error_displayed", { platform: data?.platform, jobId, error: json.error.code });
        }
      } catch {
        setError(t.errorTitle);
        setLoading(false);
        trackEvent("error_displayed", { platform: data?.platform, jobId, error: "network_failure" });
      }
    }

    fetchResult();
    return () => clearTimeout(pollInterval);
  }, [jobId, t.errorTitle, data?.status, data?.platform, sessionDownloadCount]);

  useEffect(() => {
    if (data?.status !== "completed" || !jobId) return;

    const storageKey = `recorded_${jobId}`;
    if (sessionStorage.getItem(storageKey)) return;

    const recordAccess = async () => {
      try {
        await fetch(`/api/v1/gallery/access/${jobId}?locale=${locale}`, { method: "POST" });
        sessionStorage.setItem(storageKey, "true");
        
        if (data) {
          if (data.platform) recordPlatformUse(data.platform);
          addToHistory({
            id: jobId,
            platform: data.platform,
            thumbnail_url: data.thumbnail_url || "",
            title: data.title || "",
            created_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error("Failed to record access:", err);
      }
    };

    recordAccess();
  }, [jobId, data, locale, addToHistory, recordPlatformUse]);

  if (loading && !data) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.loadingTitle}</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">{t.loadingSubtitle}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl transform -rotate-6 shadow-lg">!</div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{t.errorTitle}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-md mx-auto">{error}</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
             <h3 className="text-lg font-bold mb-6 text-center">{t.backToDownloader}</h3>
             <ExtractorForm locale={locale} />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      {guardActive && (
        <DownloadGuard 
          text={t.preparingDownload} 
          onComplete={handleGuardComplete} 
          duration={getGuardDuration(sessionDownloadCount)} locale={locale}
        />
      )}
      <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6" dir={dir}>
        <header className="mb-8">
          <Link href={`/download-${data.platform}-video?locale=${locale}`} className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-2">
            ← {t.backToDownloader}
          </Link>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="aspect-video sm:aspect-[4/5] relative bg-slate-100 dark:bg-slate-950">
                  <Image
                    src={data.thumbnail_url || '/placeholder-video.png'}
                    alt={t.mediaTitle}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                  {data.status === 'processing' && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-8 text-center">
                      <div className="animate-spin w-8 h-8 border-3 border-white border-t-transparent rounded-full mb-4"></div>
                      <p className="text-white font-bold">{t.loadingTitle}...</p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-slate-900 dark:bg-slate-800 p-2 rounded-lg text-white">
                      <PlatformIcon platform={data.platform as Platform} className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[200px]">
                        {data.author_name || t.unknownAuthor}
                      </p>
                      <p className="text-xs text-slate-500">@{data.author_handle || 'source'}</p>
                    </div>
                  </div>
                  {data.title && (
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight line-clamp-2">{data.title}</h2>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
                  {data.status === 'completed' ? (
                    <span className="flex items-center gap-2">
                      ✔ {t.successSubtitle}
                    </span>
                  ) : t.loadingTitle}
                  {data.status === 'completed' && (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white animate-in zoom-in duration-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t.downloadDescription}</p>
              </div>
              
              {data.status === 'completed' && (
                <div className="bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 px-4 py-2 rounded-xl text-sm font-bold border border-blue-600/20 animate-pulse">
                  ✨ {t.readyToDownload}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {data.variants.map((variant, idx) => (
                <DownloadItem 
                  key={idx}
                  variant={variant}
                  variantIndex={idx}
                  locale={locale}
                  sourceUrl={data.source_url}
                  platform={data.platform as Platform}
                  onDownloadRequest={handleDownloadRequest}
                  isGuarding={guardActive && pendingDownload?.url === variant.url && pendingDownload?.index === idx}
                />
              ))}
            </div>

            <div className="mt-12 p-8 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span aria-hidden="true" className="text-blue-200">✦</span>
                        {t.nextActionAnother}
                    </h3>
                    {sessionDownloadCount > 0 && (
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                        {relatedText.savedCount(sessionDownloadCount)}
                      </span>
                    )}
                  </div>
                  
                  <div className="relative mb-6">
                    <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">🔗</span>
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                      onFocus={(e) => {
                        const startTime = Date.now();
                        e.currentTarget.onblur = () => {
                           trackEvent('time_to_next_action', { 
                             duration: Date.now() - startTime,
                             platform: data?.platform
                           });
                        };
                        trackEvent('cta_next_click', { platform: data?.platform });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </div>

                  <button 
                    onClick={() => {
                       trackEvent('cta_next_click', { platform: data?.platform });
                       window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg"
                  >
                    {t.nextActionPaste}
                    <span aria-hidden="true">→</span>
                  </button>
               </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-900">
               <AdsterraNative />
            </div>
          </div>
        </main>

        <div className="mt-16 space-y-10">
          <section className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">{t.recommendedClips}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {relatedText.trendingBody(data.platform)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm font-semibold">
                <Link href={`/trending/${data.platform}?locale=${locale}`} onClick={() => trackEvent("result_related_click", { locale, platform: data.platform, job_id: jobId, destination_type: "trending", section: "similar" })} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  {relatedText.trendingLink}
                </Link>
                <Link href={`/latest/${data.platform}?locale=${locale}`} onClick={() => trackEvent("result_related_click", { locale, platform: data.platform, job_id: jobId, destination_type: "latest", section: "similar" })} className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
                  {relatedText.latestLink}
                </Link>
              </div>
            </div>
            <GallerySection 
              platform={data.platform as Platform}
              locale={locale}
              title={t.recommendedClips}
              type="trending"
              layout="carousel"
              hideMeta={true}
              limit={10}
              excludeIds={[jobId]}
            />
          </section>

          <section className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">{menu.latest}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {relatedText.latestBody(data.platform)}
                </p>
              </div>
              <Link href={`/latest/${data.platform}?locale=${locale}`} onClick={() => trackEvent("result_related_click", { locale, platform: data.platform, job_id: jobId, destination_type: "latest", section: "latest" })} className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                {relatedText.latestLink}
              </Link>
            </div>
            <GallerySection 
              platform={data.platform as Platform}
              locale={locale}
              title={menu.latest}
              type="recent"
              layout="carousel"
              hideMeta={true}
              limit={10}
              excludeIds={[jobId]}
            />
          </section>
        </div>
      </div>
    </>
  );
}

