"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics/gtag";
import { Locale } from "@/lib/i18n/ui";

interface MagicMomentCelebrationProps {
  locale: Locale;
}

export function MagicMomentCelebration({ locale }: MagicMomentCelebrationProps) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if we should show the celebration
    // It shows exactly ONCE when the magic moment is first detected in this session
    const magicMomentReached = localStorage.getItem("clipkeep:magic_moment_reached") === "true";
    const alreadyCelebrated = sessionStorage.getItem("clipkeep:magic_moment_celebrated") === "true";

    if (magicMomentReached && !alreadyCelebrated) {
      const timer = setTimeout(() => {
        setShow(true);
        trackEvent("magic_moment_celebration_shown", { locale });
      }, 1000); // Delay for better impact
      return () => clearTimeout(timer);
    }
  }, [locale]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem("clipkeep:magic_moment_celebrated", "true");
    trackEvent("magic_moment_celebration_dismissed", { locale });
  };

  const handleShare = () => {
    const text = locale === 'ja' 
      ? "ClipKeepで3回連続保存に成功！SNS動画のアーカイブに超便利。 #ClipKeep" 
      : "Just hit a 3-streak success on ClipKeep! The best tool for SNS media archives. #ClipKeep";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
    window.open(url, '_blank');
    trackEvent("magic_moment_share_click", { platform: 'twitter', locale });
    handleDismiss();
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl shadow-blue-500/20 border border-white/10 animate-in zoom-in-95 duration-300">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-700" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse" />
        
        <div className="relative pt-12 pb-8 px-8 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 animate-bounce">
            <span className="text-4xl">🏆</span>
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
            {locale === 'ja' ? 'パワーユーザー認定！' : 'Power User Status!'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            {locale === 'ja' 
              ? '3回連続でアーカイブに成功しました。ClipKeepを気に入っていただけましたか？ぜひ友だちにも教えてあげてください！' 
              : 'You\'ve successfully archived 3 clips in a row! Loving ClipKeep? Help us grow by sharing with your friends.'}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleShare}
              className="w-full bg-slate-950 dark:bg-white dark:text-slate-950 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              {locale === 'ja' ? 'Xでシェアして応援する' : 'Support us on X'}
            </button>
            
            <button
              onClick={handleDismiss}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {locale === 'ja' ? '今は閉じる' : 'Maybe later'}
            </button>
          </div>
          
          <p className="mt-6 text-[10px] text-slate-400 uppercase tracking-widest font-black">
            {locale === 'ja' ? 'ClipKeepは完全無料です' : 'ClipKeep is 100% Free'}
          </p>
        </div>
      </div>
      
      {/* Visual Confetti (CSS Only) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
