'use client';

import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics/gtag';
import type { Locale } from '@/lib/i18n/ui';

const t: Record<Locale, { prompt: string; install: string; dismiss: string }> = {
  en: { prompt: 'Add ClipKeep to your home screen for instant access', install: 'Install', dismiss: 'Later' },
  ja: { prompt: 'ホーム画面に追加してすぐ使えます', install: 'インストール', dismiss: 'あとで' },
  ar: { prompt: 'أضف ClipKeep إلى شاشتك الرئيسية للوصول الفوري', install: 'تثبيت', dismiss: 'لاحقاً' },
  es: { prompt: 'Agrega ClipKeep a tu pantalla de inicio para acceso rápido', install: 'Instalar', dismiss: 'Después' },
  pt: { prompt: 'Adicione o ClipKeep à sua tela inicial para acesso rápido', install: 'Instalar', dismiss: 'Depois' },
  fr: { prompt: 'Ajoutez ClipKeep à votre écran d\'accueil pour un accès rapide', install: 'Installer', dismiss: 'Plus tard' },
  id: { prompt: 'Tambahkan ClipKeep ke layar utama untuk akses cepat', install: 'Instal', dismiss: 'Nanti' },
  hi: { prompt: 'त्वरित पहुँच के लिए ClipKeep को होम स्क्रीन पर जोड़ें', install: 'इंस्टॉल करें', dismiss: 'बाद में' },
  de: { prompt: 'Füge ClipKeep zum Startbildschirm hinzu für schnellen Zugriff', install: 'Installieren', dismiss: 'Später' },
  tr: { prompt: "Hızlı erişim için ClipKeep'i ana ekrana ekle", install: 'Yükle', dismiss: 'Sonra' },
};

interface PwaInstallBannerProps {
  locale: Locale;
  trigger: boolean;
}

export function PwaInstallBanner({ locale, trigger }: PwaInstallBannerProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const dict = t[locale] || t.en;

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (trigger && deferredPrompt && !sessionStorage.getItem('pwa_prompt_dismissed')) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger, deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    trackEvent('pwa_install_click', { locale });
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    trackEvent('pwa_install_outcome', { outcome, locale });
    setDeferredPrompt(null);
    setVisible(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa_prompt_dismissed', '1');
    setVisible(false);
    trackEvent('pwa_install_dismiss', { locale });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex-none flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="ClipKeep" className="w-8 h-8 rounded-lg" />
        </div>
        <p className="flex-1 text-xs font-medium text-slate-700 dark:text-slate-300 leading-snug">{dict.prompt}</p>
        <div className="flex flex-col gap-1.5 flex-none">
          <button
            onClick={handleInstall}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            {dict.install}
          </button>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 text-xs font-medium px-3 py-1 rounded-lg transition-colors"
          >
            {dict.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}

// BeforeInstallPromptEvent is not in standard lib.dom.d.ts
declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }
}
