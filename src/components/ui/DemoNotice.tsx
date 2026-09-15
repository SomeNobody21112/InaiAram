interface DemoNoticeProps {
  className?: string;
}

export function DemoNotice({ className = '' }: DemoNoticeProps) {
  return (
    <div
      className={`rounded-md border border-gold/30 bg-gold/5 px-4 py-3 text-center ${className}`}
      role="status"
    >
      <p className="font-mono text-[0.6875rem] leading-[1.4] tracking-[0.14em] uppercase text-gold">
        Prototype — nothing is submitted, stored or transmitted
      </p>
    </div>
  );
}
