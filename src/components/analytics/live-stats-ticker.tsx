"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/ui";

export function LiveStatsTicker({ locale }: { locale: Locale }) {
  const [stats, setStats] = useState({
    activeUsers: 42,
    todayDownloads: 1240
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        activeUsers: Math.max(30, prev.activeUsers + (Math.random() > 0.5 ? 1 : -1)),
        todayDownloads: prev.todayDownloads + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const text: Partial<Record<Locale, { active: string; total: string }>> = {
    en: {
      active: "Active archivers right now",
      total: "Clips saved today"
    },
    ja: {
      active: "現在の利用ユーザー数",
      total: "本日のアーカイブ件数"
    }
  };

  const t = text[locale] ?? text.en!;

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-6 border-y border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/20 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
          {stats.activeUsers}
        </span>
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-500">
          {t.active}
        </span>
      </div>
      
      <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 hidden sm:block" />

      <div className="flex flex-col items-center">
        <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
          {stats.todayDownloads.toLocaleString()}
        </span>
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-500">
          {t.total}
        </span>
      </div>
    </div>
  );
}
