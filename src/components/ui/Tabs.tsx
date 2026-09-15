import { useId } from 'react';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className = '' }: TabsProps) {
  const group = useId();

  return (
    <div className={`flex gap-1 overflow-x-auto scrollbar-none ${className}`} role="tablist" aria-label="Demo sections">
      {tabs.map((tab) => {
        const isSelected = tab === activeTab;
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`tabpanel-${group}-${tab}`}
            id={`tab-${group}-${tab}`}
            onClick={() => onTabChange(tab)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-sans font-medium whitespace-nowrap transition-all duration-140 ${
              isSelected
                ? 'bg-terracotta/10 text-terracotta'
                : 'text-ink-3 hover:text-ink hover:bg-surface-raised'
            }`}
          >
            <TabIcon tab={tab} active={isSelected} />
            <span className="hidden sm:inline">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}

function TabIcon({ tab, active }: { tab: string; active: boolean }) {
  const color = active ? 'text-terracotta' : 'text-ink-3';
  switch (tab) {
    case 'Overview':
      return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={color}><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
    case 'Evidence':
      return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={color}><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M5 6h6M5 8h4M5 10h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>;
    case 'Analysis':
      return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={color}><path d="M2 14L6 6L10 10L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'Report':
      return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={color}><path d="M4 2h8v12H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M6 5h4M6 7h3M6 9h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>;
    case 'Sharing':
      return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={color}><circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" /><path d="M6 7L10 5M6 9L10 11" stroke="currentColor" strokeWidth="1" /></svg>;
    case 'Activity':
      return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={color}><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" /><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
    default:
      return null;
  }
}
