import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Emblem } from '../ui/Emblem';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { en } from '../../content/en';

export function Nav() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
        triggerRef.current?.focus();
        return;
      }
      // Focus trap
      if (e.key === 'Tab' && mobileMenuRef.current) {
        const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a, button, input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    // Focus first element in drawer
    requestAnimationFrame(() => {
      mobileMenuRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    });
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  const navLinks = [
    { label: en.nav.howItWorks, href: '#how-it-works' },
    { label: en.nav.whatWeVerify, href: '#what-we-verify' },
    { label: en.nav.whyInaiAram, href: '#why-inaiaram' },
    { label: en.nav.pricing, href: '#pricing' },
    { label: en.nav.faq, href: '#faq' },
  ];

  const resourceLinks = [
    { label: en.nav.resourcesItems.evidenceThread, href: '#evidence-thread' },
    { label: en.nav.resourcesItems.eightPillars, href: '#eight-pillars' },
    { label: en.nav.resourcesItems.certaintyLevels, href: '#certainty-levels' },
    { label: en.nav.resourcesItems.coverageAndLimitations, href: '#limitations' },
    { label: en.nav.resourcesItems.sampleCase, href: '/signup' },
    { label: en.nav.resourcesItems.howWeHandleData, href: '#consent-privacy' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-200 ${
          isScrolled ? 'bg-bg/95 backdrop-blur-sm border-line shadow-[0_1px_3px_rgba(0,0,0,0.04)]' : 'bg-bg border-transparent'
        }`}
      >
        <nav className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between h-16">
          {/* Wordmark lockup */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="InaiAram home">
            <Emblem size={32} className="text-terracotta" />
            <div className="flex flex-col">
              <span className="font-serif text-[1.05rem] text-ink leading-tight tracking-[-0.01em]">InaiAram</span>
              <span className="font-mono text-[0.5rem] tracking-[0.14em] uppercase text-ink-3 leading-none">
                Matrimonial Trust
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.8125rem] text-ink-2 hover:text-ink transition-colors duration-150 font-sans"
              >
                {link.label}
              </a>
            ))}

            {/* Resources dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                onBlur={() => setTimeout(() => setIsResourcesOpen(false), 150)}
                aria-expanded={isResourcesOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 text-[0.8125rem] text-ink-2 hover:text-ink transition-colors duration-150 font-sans"
              >
                {en.nav.resources}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {isResourcesOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-52 bg-surface border border-line rounded-lg shadow-lg py-1 z-50"
                  role="menu"
                >
                  {resourceLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      role="menuitem"
                      onClick={() => setIsResourcesOpen(false)}
                      className="block px-4 py-2 text-[0.8125rem] text-ink-2 hover:text-ink hover:bg-surface-raised transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-pressed={theme === 'dark'}
              className="w-9 h-9 flex items-center justify-center rounded-md text-ink-3 hover:text-ink hover:bg-surface-raised transition-colors duration-150"
            >
              {theme === 'dark' ? (
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
                  <circle cx="8.5" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8.5 1.5V3M8.5 14v1.5M1.5 8.5H3M14 8.5h1.5M3.3 3.3l1.1 1.1M12.6 12.6l1.1 1.1M3.3 13.7l1.1-1.1M12.6 4.4l1.1-1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
                  <path d="M14.5 9.8A6 6 0 017.2 2.5a6.5 6.5 0 107.3 7.3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            <Link
              to="/login"
              className="hidden sm:inline-flex text-[0.8125rem] text-ink-2 hover:text-ink transition-colors duration-150 px-3"
            >
              {en.nav.login}
            </Link>

            <Link to="/signup" className="hidden sm:inline-flex">
              <Button variant="primary" size="sm">{en.nav.startVerification}</Button>
            </Link>

            {/* Mobile hamburger */}
            <button
              ref={triggerRef}
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileOpen}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md text-ink-3 hover:text-ink hover:bg-surface-raised transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" ref={mobileMenuRef}>
          <div className="absolute inset-0 bg-black/40" onClick={closeMobile} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 w-full max-w-[320px] bg-bg border-l border-line overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-line">
              <span className="font-serif text-lg text-ink">Menu</span>
              <button
                onClick={closeMobile}
                aria-label="Close menu"
                className="w-9 h-9 flex items-center justify-center rounded-md text-ink-3 hover:text-ink hover:bg-surface-raised transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="p-5 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className="flex items-center h-11 px-3 text-[0.9375rem] text-ink-2 hover:text-ink hover:bg-surface-raised rounded-md transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-line mt-3 pt-3">
                <span className="px-3 py-2 font-mono text-[0.625rem] tracking-[0.12em] uppercase text-ink-3 block">
                  {en.nav.resources}
                </span>
                {resourceLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMobile}
                    className="flex items-center h-11 px-6 text-[0.8125rem] text-ink-2 hover:text-ink hover:bg-surface-raised rounded-md transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="p-5 border-t border-line space-y-2">
              <Link to="/login" onClick={closeMobile}>
                <Button variant="ghost" fullWidth>{en.nav.login}</Button>
              </Link>
              <Link to="/signup" onClick={closeMobile}>
                <Button variant="primary" fullWidth>{en.nav.startVerification}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
