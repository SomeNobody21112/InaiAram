/**
 * APP SHELL — the single coherent authenticated navigation surface.
 * Desktop: left sidebar + top bar. Mobile: compact top bar + drawer.
 * Calm, editorial, private — not an enterprise admin console.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Emblem } from '../ui/Emblem';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/primitives';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../store/app';
import { useAttention } from '../app/screens/Dashboard';

const NAV = [
  { to: '/app', label: 'Overview', end: true },
  { to: '/app/verifications', label: 'Verifications', end: false },
  { to: '/app/trust', label: 'Trust Profile', end: false },
  { to: '/app/evidence', label: 'Evidence', end: false },
  { to: '/app/reports', label: 'Reports', end: false },
  // One Consent & Privacy destination: grants, shares, ledger, data rights.
  // The per-category decision screen is reached from inside it.
  { to: '/app/privacy', label: 'Consent & Privacy', end: false },
  { to: '/app/states', label: 'Result states', end: false },
  { to: '/app/account', label: 'Account', end: false },
];

function NavItem({ to, label, end, onClick, badge }: { to: string; label: string; end: boolean; onClick?: () => void; badge?: string }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between h-10 px-3 rounded-lg text-sm transition-colors duration-150 ${
          isActive ? 'bg-terracotta/10 text-terracotta font-medium' : 'text-ink-2 hover:text-ink hover:bg-surface-raised'
        }`
      }
    >
      {label}
      {badge && (
        <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gold/15 text-gold text-[0.625rem] font-mono">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

function BrandLockup() {
  return (
    <Link to="/app" className="flex items-center gap-2.5 shrink-0" aria-label="InaiAram workspace home">
      <Emblem size={28} className="text-terracotta" />
      <div className="flex flex-col">
        <span className="font-serif text-[0.9375rem] text-ink leading-tight tracking-[-0.01em]">InaiAram</span>
        <span className="font-mono text-[0.5rem] tracking-[0.14em] uppercase text-ink-3 leading-none">Private workspace</span>
      </div>
    </Link>
  );
}

export function AppShell({ children, attentionCount: attentionCountProp }: { children: React.ReactNode; attentionCount?: number }) {
  const { theme, toggleTheme } = useTheme();
  const { state, dispatch } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const attention = useAttention();
  const attentionCount = attentionCountProp ?? attention.length;

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close the user menu on outside click
  useEffect(() => {
    if (!userOpen) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userOpen]);

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    setUserOpen(false);
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const user = state.user;
  const initials = (user?.name ?? 'IA').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Skip link is provided globally in App.tsx — targets this shell's #main-content */}
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-[248px] shrink-0 border-r border-line bg-bg-alt sticky top-0 h-screen">
        <div className="h-16 flex items-center px-5 border-b border-line">
          <BrandLockup />
        </div>
        <nav aria-label="Application" className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} badge={item.label === 'Overview' && attentionCount > 0 ? String(attentionCount) : undefined} />
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-line">
          <p className="text-[0.625rem] font-mono text-ink-3 leading-relaxed">
            Prototype — demonstration data only.<br />No live verification is performed.
          </p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-16 border-b border-line bg-bg/95 backdrop-blur-sm">
          <div className="h-full px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3">
            <div className="lg:hidden"><BrandLockup /></div>
            <div className="hidden lg:flex items-center gap-2 text-xs text-ink-3 min-w-0">
              <span className="label-mono">PRIVATE WORKSPACE</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">Illustrative sample case — no live verification is performed</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                className="w-11 h-11 flex items-center justify-center rounded-md text-ink-3 hover:text-ink hover:bg-surface-raised transition-colors"
              >
                {theme === 'dark' ? (
                  <svg width="16" height="16" viewBox="0 0 17 17" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M8.5 1.5V3M8.5 14v1.5M1.5 8.5H3M14 8.5h1.5M3.3 3.3l1.1 1.1M12.6 12.6l1.1 1.1M3.3 13.7l1.1-1.1M12.6 4.4l1.1-1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 17 17" fill="none" aria-hidden="true"><path d="M14.5 9.8A6 6 0 017.2 2.5a6.5 6.5 0 107.3 7.3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </button>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  aria-expanded={userOpen}
                  aria-haspopup="menu"
                  aria-label="Account and navigation menu"
                  className="w-11 h-11 rounded-full bg-terracotta/10 text-terracotta font-serif text-xs flex items-center justify-center hover:bg-terracotta/20 transition-colors"
                >
                  {initials}
                </button>
                {userOpen && (
                  <div role="menu" className="absolute right-0 top-full mt-2 w-60 bg-surface border border-line rounded-lg shadow-lg py-1.5 z-50">
                    <div className="px-3.5 py-2 border-b border-line">
                      <p className="text-sm font-medium text-ink truncate">{user?.name}</p>
                      <p className="text-xs text-ink-3 truncate">{user?.email}</p>
                    </div>
                    <Link to="/app/account" role="menuitem" onClick={() => setUserOpen(false)} className="block px-3.5 py-2 text-sm text-ink-2 hover:text-ink hover:bg-surface-raised transition-colors">Account</Link>
                    <Link to="/app/privacy" role="menuitem" onClick={() => setUserOpen(false)} className="block px-3.5 py-2 text-sm text-ink-2 hover:text-ink hover:bg-surface-raised transition-colors">Consent &amp; Privacy</Link>
                    <div className="border-t border-line mt-1 pt-1">
                      <button role="menuitem" onClick={handleLogout} className="w-full text-left px-3.5 py-2 text-sm text-terracotta hover:text-terracotta-deep hover:bg-surface-raised transition-colors">Log out</button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation"
                aria-expanded={menuOpen}
                className="lg:hidden w-11 h-11 flex items-center justify-center rounded-md text-ink-3 hover:text-ink hover:bg-surface-raised transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
          {children}
        </main>

        <footer className="border-t border-line px-4 sm:px-6 lg:px-10 py-4">
          <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[0.625rem] font-mono text-ink-3">Illustrative sample case · Not a real person · Nothing is transmitted</p>
            <Link to="/" className="text-[0.625rem] text-ink-3 hover:text-ink transition-colors">About InaiAram ↗</Link>
          </div>
        </footer>
      </div>

      <Drawer open={menuOpen} onClose={closeMenu} label="Application navigation">
        <div className="flex items-center justify-between p-5 border-b border-line">
          <BrandLockup />
          <button onClick={closeMenu} aria-label="Close navigation" className="w-11 h-11 flex items-center justify-center rounded-md text-ink-3 hover:text-ink hover:bg-surface-raised transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <nav aria-label="Application" className="p-3 space-y-0.5">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} onClick={closeMenu} badge={item.label === 'Overview' && attentionCount > 0 ? String(attentionCount) : undefined} />
          ))}
        </nav>
        <div className="p-5 border-t border-line">
          <Button variant="secondary" fullWidth onClick={handleLogout}>Log out</Button>
        </div>
      </Drawer>
    </div>
  );
}
