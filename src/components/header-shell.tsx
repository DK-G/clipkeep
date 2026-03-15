'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { normalizeLocale, localeDir } from '@/lib/i18n/ui';
import { LanguageSwitcher } from './language-switcher';
import { SideMenu } from './side-menu';

export function HeaderShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = normalizeLocale(searchParams.get('locale'));
  const dir = localeDir(locale);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname, searchParams]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100" style={{ height: '64px', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <Link href={`/?locale=${locale}`} style={{ fontSize: 20, fontWeight: 'bold', textDecoration: 'none', color: '#000' }}>
            ClipKeep
          </Link>
          
          <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Floating Menu Trigger Button - Using inline styles for cross-environment reliability */}
      <button
        ref={menuButtonRef}
        onClick={toggleMenu}
        aria-label="Toggle Menu"
        aria-expanded={isMenuOpen}
        style={{
          position: 'fixed',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 60,
          width: '56px',
          height: '56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          [dir === 'ltr' ? 'right' : 'left']: '16px',
          backgroundColor: isMenuOpen ? '#fff' : '#2563eb',
          color: isMenuOpen ? '#000' : '#fff',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          outline: 'none',
        }}
      >
        <div style={{ width: '24px', height: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ 
            width: '100%', 
            height: '2px', 
            backgroundColor: 'currentColor', 
            transition: 'all 0.3s',
            transform: isMenuOpen ? 'rotate(45deg) translateY(10px)' : 'none'
          }} />
          <span style={{ 
            width: '100%', 
            height: '2px', 
            backgroundColor: 'currentColor', 
            transition: 'opacity 0.3s',
            opacity: isMenuOpen ? 0 : 1
          }} />
          <span style={{ 
            width: '100%', 
            height: '2px', 
            backgroundColor: 'currentColor', 
            transition: 'all 0.3s',
            transform: isMenuOpen ? 'rotate(-45deg) translateY(-10px)' : 'none'
          }} />
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
