interface SectionRuleProps {
  label: string;
  className?: string;
}

export function SectionRule({ label, className = '' }: SectionRuleProps) {
  return (
    <div className={`flex items-center gap-4 py-3 ${className}`} aria-hidden="true">
      <div className="flex-1 h-px bg-line" />
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rotate-45 bg-terracotta/60" />
        <span className="font-mono text-[0.625rem] leading-[1.4] tracking-[0.12em] uppercase text-ink-3 font-medium whitespace-nowrap">
          {label}
        </span>
        <span className="w-1.5 h-1.5 rotate-45 bg-terracotta/60" />
      </div>
      <div className="flex-1 h-px bg-line" />
    </div>
  );
}
