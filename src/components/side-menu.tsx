'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, menuText } from '@/lib/i18n/ui';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  locale: Locale;
  dir: 'ltr' | 'rtl';
}

export function SideMenu({ isOpen, onClose, triggerRef, locale, dir }: SideMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const t = menuText[locale];

  // Logic to determine active state
  const isActive = (href: string, activeHash?: string) => {
    const url = new URL(href, 'https://clipkeep.net');
    const pathMatch = pathname === url.pathname;
    
    if (activeHash) {
      if (typeof window !== 'undefined') {
        const currentHash = window.location.hash;
        return pathMatch && currentHash === activeHash;
      }
      return false;
    }
    
    return pathMatch;
  };

  const toggleSection = (idx: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Accessibility: Focus Management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const closeBtn = menuRef.current?.querySelector('button[aria-label="Close Menu"]') as HTMLElement;
        closeBtn?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    }
  }, [isOpen, triggerRef]);

  // Accessibility: Keyboard Support
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
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
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
        { label: t.twitter, href: `/download-twitter-video?locale=${locale}` },
        { label: t.tiktok, href: `/download-tiktok-video?locale=${locale}` },
        { label: t.telegram, href: `/download-telegram-video?locale=${locale}` },
        { label: t.instagram, href: `/download-instagram-video?locale=${locale}` },
      ]
    },
    {
      id: 'rankings',
      title: t.rankings,
      items: [
        { label: 'Twitter', href: `/twitter-trending-videos?locale=${locale}` },
        { label: 'TikTok', href: `/tiktok-trending-videos?locale=${locale}` },
        { label: 'Telegram', href: `/telegram-trending-videos?locale=${locale}` },
      ]
    },
    {
      id: 'latest',
      title: t.latest,
      items: [
        { label: 'Twitter', href: `/twitter-latest-videos?locale=${locale}` },
        { label: 'TikTok', href: `/tiktok-latest-videos?locale=${locale}` },
        { label: 'Telegram', href: `/telegram-latest-videos?locale=${locale}` },
      ]
    },
    {
      id: 'language',
      title: t.language,
      items: [
        { label: 'English', href: `${pathname}?locale=en` },
        { label: 'العربية', href: `${pathname}?locale=ar` },
        { label: '日本語', href: `${pathname}?locale=ja` },
        { label: 'Español', href: `${pathname}?locale=es` },
        { label: 'Português', href: `${pathname}?locale=pt` },
        { label: 'Français', href: `${pathname}?locale=fr` },
        { label: 'Indonesia', href: `${pathname}?locale=id` },
        { label: 'हिंदी', href: `${pathname}?locale=hi` },
        { label: 'Deutsch', href: `${pathname}?locale=de` },
        { label: 'Türkçe', href: `${pathname}?locale=tr` },
      ]
    },
    {
      id: 'more',
      title: t.more,
      items: [
        { label: t.about, href: `/about?locale=${locale}` },
        { label: t.faq, href: `/faq?locale=${locale}` },
        { label: t.privacy, href: `/legal/privacy?locale=${locale}` },
        { label: menuText[locale].instagram.replace(' Downloader', '').replace(' 保存', '').includes('Contact') ? t.contact : t.contact, href: `/contact?locale=${locale}` },
      ]
    }
  ];

  const drawerStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    [dir === 'ltr' ? 'right' : 'left']: 0,
    width: '320px',
    maxWidth: '85vw',
    backgroundColor: '#ffffff',
    zIndex: 80,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transition: 'transform 0.3s ease-in-out',
    transform: isOpen ? 'translateX(0)' : (dir === 'ltr' ? 'translateX(100%)' : 'translateX(-100%)'),
    display: 'flex',
    flexDirection: 'column',
    textAlign: dir === 'ltr' ? 'left' : 'right',
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 70,
          transition: 'opacity 0.3s',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* Drawer */}
      <div style={drawerStyles}>
        <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
          <span style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.025em', color: '#111827' }}>MENU</span>
          <button 
            onClick={onClose}
            aria-label="Close Menu"
            style={{ border: 'none', background: 'none', padding: '8px', cursor: 'pointer', borderRadius: '50%' }}
          >
            <svg style={{ width: '24px', height: '24px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {menuData.map((group, gIdx) => {
              const isExpanded = expandedSections[gIdx] || false;
              return (
                <div key={group.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <button
                    onClick={() => toggleSection(gIdx)}
                    aria-expanded={isExpanded}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '24px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: dir === 'ltr' ? 'left' : 'right',
                    }}
                  >
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 'bold', 
                      letterSpacing: '0.1em', 
                      textTransform: 'uppercase', 
                      color: isExpanded ? '#2563eb' : '#9ca3af',
                      transition: 'color 0.2s'
                    }}>
                      {group.title}
                    </span>
                    <svg 
                      style={{ 
                        width: '16px', 
                        height: '16px', 
                        color: isExpanded ? '#60a5fa' : '#d1d5db', 
                        transition: 'transform 0.3s', 
                        transform: isExpanded ? 'rotate(180deg)' : 'none' 
                      }} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div 
                    style={{ 
                      maxHeight: isExpanded ? '500px' : '0',
                      opacity: isExpanded ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease-in-out',
                      backgroundColor: '#fff',
                    }}
                  >
                    <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {group.items.map((item, iIdx) => {
                        const active = isActive(item.href, ('hash' in item) ? (item as { hash?: string }).hash : undefined);
                        return (
                          <Link
                            key={iIdx}
                            href={item.href}
                            style={{ 
                              display: 'block',
                              fontSize: '0.875rem', 
                              textDecoration: 'none',
                              color: active ? '#2563eb' : '#4b5563',
                              fontWeight: active ? 'bold' : '500',
                              transition: 'all 0.2s',
                              paddingLeft: active ? '4px' : '0',
                            }}
                            onClick={onClose}
                          >
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ padding: '32px', borderTop: '1px solid #f3f4f6', backgroundColor: 'rgba(249, 250, 251, 0.3)', fontSize: '10px', color: '#9ca3af', textAlign: 'center', letterSpacing: '0.1em' }}>
          EST. 2025 • CLIPKEEP
        </div>
      </div>
    </>
  );
}
