"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/gtag";
import type { Locale } from "@/lib/i18n/ui";

interface DownloadGuardProps {
  onComplete: () => void;
  text: string;
  duration?: number;
  locale?: Locale;
}

const guardText: Record<Locale, { optimizing: string; discover: string; popular: string; saving: string }> = {
  en: { optimizing: "Optimizing file for high-speed download...", discover: "Discover", popular: "Popular Downloads", saving: "See what others are saving" },
  ar: { optimizing: "يتم تجهيز الملف لتنزيل سريع...", discover: "اكتشف", popular: "التحميلات الشائعة", saving: "شاهد ما يحفظه الآخرون" },
  ja: { optimizing: "高速ダウンロード向けにファイルを最適化しています...", discover: "見つける", popular: "人気の保存", saving: "他のユーザーの保存を見る" },
  es: { optimizing: "Optimizando el archivo para una descarga rápida...", discover: "Explorar", popular: "Descargas populares", saving: "Mira lo que otros están guardando" },
  pt: { optimizing: "Otimizando o arquivo para download rápido...", discover: "Descobrir", popular: "Downloads populares", saving: "Veja o que outras pessoas estão salvando" },
  fr: { optimizing: "Optimisation du fichier pour un téléchargement rapide...", discover: "Découvrir", popular: "Téléchargements populaires", saving: "Voir ce que les autres enregistrent" },
  id: { optimizing: "Mengoptimalkan file untuk unduhan cepat...", discover: "Jelajahi", popular: "Unduhan populer", saving: "Lihat apa yang disimpan orang lain" },
  hi: { optimizing: "तेज़ डाउनलोड के लिए फ़ाइल तैयार की जा रही है...", discover: "खोजें", popular: "लोकप्रिय डाउनलोड", saving: "देखें दूसरे क्या सेव कर रहे हैं" },
  de: { optimizing: "Datei wird für schnellen Download optimiert...", discover: "Entdecken", popular: "Beliebte Downloads", saving: "Sehen, was andere speichern" },
  tr: { optimizing: "Dosya hızlı indirme için optimize ediliyor...", discover: "Keşfet", popular: "Popüler indirmeler", saving: "Diğer kullanıcıların neleri kaydettiğini görün" },
};

export function DownloadGuard({ onComplete, text, duration = 1500, locale = "en" }: DownloadGuardProps) {
  const [progress, setProgress] = useState(0);
  const t = guardText[locale] || guardText.en;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        onComplete();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm p-8 mx-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-150 opacity-20" />
            <div className="relative bg-blue-600 text-white p-5 rounded-3xl shadow-lg shadow-blue-600/30 text-3xl leading-none" aria-hidden="true">
              ⭳
            </div>
            <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 p-1.5 rounded-xl animate-pulse text-xs" aria-hidden="true">
              ✦
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{text}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.optimizing}</p>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mb-8 border border-slate-200/50 dark:border-slate-700/50">
            <div className="h-full bg-blue-600 transition-all duration-300 ease-out relative" style={{ width: `${progress}%` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          <div className="w-full">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-bold mb-3">{t.discover}</p>
            <Link
              href={`/trending?locale=${locale}`}
              onClick={() => trackEvent("guard_internal_click", { type: "trending" })}
              className="group block p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white dark:bg-slate-800 p-2 rounded-xl text-blue-600 shadow-sm group-hover:scale-110 transition-transform" aria-hidden="true">
                    ↗
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.popular}</p>
                    <p className="text-[10px] text-slate-500">{t.saving}</p>
                  </div>
                </div>
                <span aria-hidden="true" className="text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all">→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
