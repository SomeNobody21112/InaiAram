/**
 * SHARED UI PRIMITIVES for the application surface.
 * PageHeader, Breadcrumb, EmptyState, LoadingState, ErrorState, Dialog,
 * Drawer, Tooltip, Toast, Skeleton — all themed, all accessible.
 */
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

// ---------------- PageHeader ----------------
export function PageHeader({ eyebrow, title, description, actions }: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="label-mono text-ink-3 mb-2">{eyebrow}</p>}
        <h1 className="display-m text-ink">{title}</h1>
        {description && <p className="body text-ink-2 mt-2 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

// ---------------- Breadcrumb ----------------
export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-3 mb-4 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5 min-w-0">
          {i > 0 && <span aria-hidden="true" className="text-line-strong">/</span>}
          {item.to ? (
            <Link to={item.to} className="hover:text-ink transition-colors truncate max-w-[160px]">{item.label}</Link>
          ) : (
            <span className="text-ink-2 truncate max-w-[220px]" aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ---------------- EmptyState ----------------
export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="border border-dashed border-line-strong rounded-xl bg-surface px-8 py-12 text-center max-w-lg mx-auto">
      <span className="font-serif text-2xl text-ink-3" aria-hidden="true">◆</span>
      <h3 className="h3 text-ink mt-3 mb-1.5">{title}</h3>
      <p className="text-sm text-ink-2 leading-relaxed mb-5">{body}</p>
      {action}
    </div>
  );
}

// ---------------- LoadingState / Skeleton ----------------
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-bg-alt ${className}`} aria-hidden="true" />;
}

export function LoadingState({ label, rows = 3 }: { label: string; rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 rounded-lg border border-line bg-surface flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ---------------- ErrorState ----------------
export function ErrorState({ title, body, onRetry }: { title: string; body: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-terracotta/20 bg-terracotta/5 px-6 py-8 text-center max-w-lg mx-auto" role="alert">
      <p className="text-sm font-medium text-terracotta-deep mb-1">{title}</p>
      <p className="text-sm text-ink-2 mb-4">{body}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm font-medium text-terracotta hover:text-terracotta-deep underline underline-offset-2">
          Please try again
        </button>
      )}
    </div>
  );
}

// ---------------- Focus trap hook (shared by Dialog/Drawer) ----------------
function useFocusTrap(ref: React.RefObject<HTMLElement | null>, onClose: () => void, active: boolean) {
  useEffect(() => {
    // Closed overlays must not trap focus or listen for Escape.
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = () => Array.from(el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    const first = focusables()[0];
    first?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) return;
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    document.addEventListener('keydown', handleKey, true);
    return () => {
      document.removeEventListener('keydown', handleKey, true);
      previouslyFocused?.focus?.();
    };
  }, [ref, onClose, active]);
}

// Ref-counted scroll lock: safe with overlapping overlays (dialog on top of
// drawer, nested dialogs). Scroll restores only when the LAST overlay closes.
let scrollLockCount = 0;
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    scrollLockCount++;
    document.body.style.overflow = 'hidden';
    return () => {
      scrollLockCount = Math.max(0, scrollLockCount - 1);
      if (scrollLockCount === 0) document.body.style.overflow = '';
    };
  }, [active]);
}

// ---------------- Overlay exit state (calm 180–200ms entrance/exit) ----------------
// Entrance: CSS animation (overlay-in / drawer-in / fade-in, see base.css).
// Exit: the closing flag swaps Tailwind transition classes for a brief moment
// before onClose unmounts the overlay. Reduced motion skips the delay entirely.
function useOverlayExit(open: boolean, onClose: () => void) {
  const [closing, setClosing] = useState(false);
  const reduceMotion = useRef(false);
  useEffect(() => {
    reduceMotion.current = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  const requestClose = useCallback(() => {
    if (!open || closing) return;
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, reduceMotion.current ? 0 : 180);
  }, [open, closing, onClose]);
  return { closing, requestClose };
}

// ---------------- Dialog ----------------
export function Dialog({ open, onClose, title, children, width = 'max-w-lg' }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { closing, requestClose } = useOverlayExit(open, onClose);
  useFocusTrap(ref, requestClose, open);
  useScrollLock(open);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`absolute inset-0 bg-black/40 overlay-backdrop transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`} onClick={requestClose} aria-hidden="true" />
      <div ref={ref} className={`overlay-panel relative w-full ${width} bg-surface border border-line rounded-t-2xl sm:rounded-xl shadow-xl max-h-[92vh] overflow-y-auto transition-all duration-200 ease-out ${closing ? 'opacity-0 translate-y-3 sm:translate-y-0 sm:scale-[0.99]' : 'opacity-100 translate-y-0 scale-100'}`}>
        <div className="sticky top-0 bg-surface border-b border-line px-5 py-3.5 flex items-center justify-between z-10">
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          <button onClick={requestClose} aria-label="Close dialog" className="w-11 h-11 -mr-2 flex items-center justify-center rounded-md text-ink-3 hover:text-ink hover:bg-surface-raised transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ---------------- Drawer (mobile navigation) ----------------
export function Drawer({ open, onClose, label, children }: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { closing, requestClose } = useOverlayExit(open, onClose);
  useFocusTrap(ref, requestClose, open);
  useScrollLock(open);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label={label}>
      <div className={`absolute inset-0 bg-black/40 overlay-backdrop transition-opacity duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`} onClick={requestClose} aria-hidden="true" />
      <div ref={ref} className={`drawer-panel absolute inset-y-0 right-0 w-full max-w-[320px] bg-bg border-l border-line overflow-y-auto transition-transform duration-200 ease-out ${closing ? 'translate-x-full' : 'translate-x-0'}`}>
        {children}
      </div>
    </div>
  );
}

// ---------------- Tooltip ----------------
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="relative inline-flex group">
      {children}
      <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 rounded-md bg-ink text-bg text-[0.6875rem] leading-snug whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 z-20">
        {label}
      </span>
    </span>
  );
}

// ---------------- Toast ----------------
interface ToastItem { id: number; message: string }
const ToastContext = createContext<{ toast: (message: string) => void }>({ toast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const toast = useCallback((message: string) => {
    const id = nextId.current++;
    setItems((prev) => [...prev, { id, message }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4">
        {items.map((t) => (
          <div key={t.id} className="pointer-events-auto bg-ink text-bg text-sm px-4 py-2.5 rounded-lg shadow-lg">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

// ---------------- Disclosure (expandable detail) ----------------
export function Disclosure({ summary, children, defaultOpen = false }: {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
        className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-terracotta hover:text-terracotta-deep transition-colors"
      >
        {summary}
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M2.5 4L5.5 7l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div id={id} className="mt-3">{children}</div>}
    </div>
  );
}
