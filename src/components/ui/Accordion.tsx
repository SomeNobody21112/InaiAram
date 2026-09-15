import { useState, useId } from 'react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const id = useId();
  const headerId = `accordion-header-${id}`;
  const panelId = `accordion-panel-${id}`;

  return (
    <div className="border-b border-line">
      <h3>
        <button
          id={headerId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-4 px-0 text-left text-ink font-sans font-medium text-[0.875rem] hover:text-terracotta transition-colors duration-150"
        >
          <span>{title}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
        className="pb-4 text-ink-2 text-[0.8125rem] leading-relaxed"
      >
        {children}
      </div>
    </div>
  );
}

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className = '' }: AccordionProps) {
  return (
    <div className={className} role="region">
      {children}
    </div>
  );
}
