'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { normalizeLocale, localeDir } from '@/lib/i18n/ui';
import { LanguageSwitcher } from './language-switcher';
import { SideMenu } from './side-menu';

const headerLabels = {
  en: { toggleMenu: 'Toggle Menu' },
  ar: { toggleMenu: 'تبديل القائمة' },
  ja: { toggleMenu: 'メニューを切り替え' },
  es: { toggleMenu: 'Alternar menú' },
  pt: { toggleMenu: 'Alternar menu' },
  fr: { toggleMenu: 'Basculer le menu' },
  id: { toggleMenu: 'Buka/tutup menu' },
  hi: { toggleMenu: 'मेनू टॉगल करें' },
  de: { toggleMenu: 'Menü umschalten' },
  tr: { toggleMenu: 'Menüyü aç/kapat' },
} as const;

export function HeaderShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = normalizeLocale(searchParams.get('locale'));
  const dir = localeDir(locale);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname, searchParams]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="sticky top-0 z-50 h-[56px] bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 sm:bg-white/90 sm:dark:bg-slate-950/90 sm:backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-4 flex justify-between items-center h-full">
          <Link 
            href={`/?locale=${locale}`} 
            className="text-lg font-[800] no-underline text-slate-900 dark:text-white tracking-tight"
          >
            ClipKeep
          </Link>
          
          <div className="flex-1" /> {/* Spacer added here */}
          <div className="flex items-center">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>
 
      {/* Floating Menu Button (Mobile & Desktop) */}
      <button 
        ref={menuButtonRef}
        onClick={toggleMenu}
        className={`fixed top-4 right-3 z-[60] p-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl border border-white/20 dark:border-slate-200 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center
          ${isMenuOpen ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100'}
        `}
        aria-label={headerLabels[locale].toggleMenu}
        aria-expanded={isMenuOpen}
      >
        <div className="w-[18px] h-3.5 flex flex-col justify-between items-center">
          <span className={`w-full h-[2px] bg-white dark:bg-slate-100 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[6px] !bg-black dark:!bg-white' : ''}`} />
          <span className={`w-full h-[2px] bg-white dark:bg-slate-100 transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`w-full h-[2px] bg-white dark:bg-slate-100 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[6px] !bg-black dark:!bg-white' : ''}`} />
        </div>
      </button>

      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        triggerRef={menuButtonRef}
        locale={locale}
        dir={dir}
      />
    </>
  );
}
