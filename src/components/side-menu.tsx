'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, localeNativeLabels, menuText } from '@/lib/i18n/ui';
import { SITE_URL } from '@/lib/site-url';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  locale: Locale;
}

const sideMenuUi = {
  en: { menu: 'MENU', close: 'Close Menu', footer: 'EST. 2025 • CLIPKEEP' },
  ar: { menu: 'القائمة', close: 'إغلاق القائمة', footer: 'منذ 2025 • CLIPKEEP' },
  ja: { menu: 'メニュー', close: 'メニューを閉じる', footer: 'EST. 2025 • CLIPKEEP' },
  es: { menu: 'MENÚ', close: 'Cerrar menú', footer: 'EST. 2025 • CLIPKEEP' },
  pt: { menu: 'MENU', close: 'Fechar menu', footer: 'EST. 2025 • CLIPKEEP' },
  fr: { menu: 'MENU', close: 'Fermer le menu', footer: 'EST. 2025 • CLIPKEEP' },
  id: { menu: 'MENU', close: 'Tutup menu', footer: 'EST. 2025 • CLIPKEEP' },
  hi: { menu: 'मेनू', close: 'मेनू बंद करें', footer: 'EST. 2025 • CLIPKEEP' },
  de: { menu: 'MENÜ', close: 'Menü schließen', footer: 'EST. 2025 • CLIPKEEP' },
  tr: { menu: 'MENÜ', close: 'Menüyü kapat', footer: 'EST. 2025 • CLIPKEEP' },
} as const;

export function SideMenu({ isOpen, onClose, triggerRef, locale }: SideMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const t = menuText[locale];
  const ui = sideMenuUi[locale];

  const isActive = (href: string) => {
    try {
      const url = new URL(href, SITE_URL);
      return pathname === url.pathname;
    } catch {
      return false;
    }
  };

  const toggleSection = (idx: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const closeBtn = menuRef.current?.querySelector('button[aria-label]') as HTMLElement;
        closeBtn?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();

      if (e.key === 'Tab') {
        const focusableElements = menuRef.current?.querySelectorAll('a, button');
        if (!focusableElements) return;

        const first = focusableElements[0] as HTMLElement;
        const last = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const menuData = [
    {
      id: 'downloads',
      title: t.downloads,
      items: [
        { label: t.bilibili, href: `/download-bilibili-video?locale=${locale}` },
        { label: t.bluesky, href: `/download-bluesky-video?locale=${locale}` },
        { label: t.discord, href: `/download-discord-video?locale=${locale}` },
        { label: t.facebook, href: `/download-facebook-video?locale=${locale}` },
        { label: t.lemon8, href: `/download-lemon8-video?locale=${locale}` },
        { label: t.pinterest, href: `/download-pinterest-video?locale=${locale}` },
        { label: t.reddit, href: `/download-reddit-video?locale=${locale}` },
        { label: t.threads, href: `/download-threads-video?locale=${locale}` },
        { label: t.tiktok, href: `/download-tiktok-video?locale=${locale}` },
        { label: t.twitter, href: `/download-twitter-video?locale=${locale}` },
      ],
    },
    {
      id: 'discovery',
      title: t.globalHub || "Discovery",
      items: [
        { label: t.rankings, href: `/trending?locale=${locale}` },
        { label: t.latest, href: `/latest?locale=${locale}` },
      ],
    },
    {
      id: 'language',
      title: t.language,
      items: [
                { label: localeNativeLabels.en, href: `${pathname}?locale=en` },
        { label: localeNativeLabels.ar, href: `${pathname}?locale=ar` },
        { label: localeNativeLabels.ja, href: `${pathname}?locale=ja` },
        { label: localeNativeLabels.es, href: `${pathname}?locale=es` },
        { label: localeNativeLabels.pt, href: `${pathname}?locale=pt` },
        { label: localeNativeLabels.fr, href: `${pathname}?locale=fr` },
        { label: localeNativeLabels.id, href: `${pathname}?locale=id` },
        { label: localeNativeLabels.hi, href: `${pathname}?locale=hi` },
        { label: localeNativeLabels.de, href: `${pathname}?locale=de` },
        { label: localeNativeLabels.tr, href: `${pathname}?locale=tr` },
      ],
    },
    {
      id: 'more',
      title: t.more,
      items: [
        { label: t.about, href: `/about?locale=${locale}` },
        { label: t.faq, href: `/faq?locale=${locale}` },
        { label: t.privacy, href: `/legal/privacy?locale=${locale}` },
        { label: t.contact, href: `/contact?locale=${locale}` },
      ],
    },
  ];

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[70] transition-opacity duration-300 bg-black/40 backdrop-blur-[4px] ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div 
        ref={menuRef} 
        className={`fixed z-[80] bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col
          top-0 bottom-0 right-0 left-auto h-full w-[320px] max-w-[85vw]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Mobile Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full" />
        </div>

        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
          <span className="font-[900] text-xl tracking-tight text-slate-900 dark:text-white uppercase">{ui.menu}</span>
          <button 
            onClick={onClose} 
            aria-label={ui.close} 
            className="p-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col min-h-full">
            <div className="flex-1" />
            {menuData.map((group, gIdx) => {
              const isExpanded = expandedSections[gIdx] || false;
              return (
                <div key={group.id} className="border-b border-gray-50 dark:border-slate-900">
                  <button
                    onClick={() => toggleSection(gIdx)}
                    aria-expanded={isExpanded}
                    className="w-full flex items-center justify-between p-6 bg-transparent border-none cursor-pointer transition-colors"
                  >
                    <span className={`text-xs font-bold tracking-[0.1em] uppercase transition-colors duration-200 ${
                      isExpanded ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'
                    }`}>
                      {group.title}
                    </span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-blue-500 dark:text-blue-400' : 'text-gray-300 dark:text-slate-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div className={`transition-all duration-300 ease-in-out bg-white dark:bg-slate-950 overflow-hidden ${
                    isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 pb-6 flex flex-col gap-4">
                      {group.items.map((item, iIdx) => {
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={iIdx}
                            href={item.href}
                            className={`block text-sm no-underline transition-all duration-200 ${
                              active 
                                ? 'text-blue-600 dark:text-blue-400 font-bold translate-x-1' 
                                : 'text-gray-600 dark:text-slate-400 font-medium hover:text-blue-500 dark:hover:text-blue-400'
                            }`}
                            onClick={onClose}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/10 text-[10px] text-gray-400 dark:text-slate-600 text-center tracking-[0.1em]">
          {ui.footer}
        </div>
      </div>
    </>
  );
}


