import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  raised?: boolean;
}

export function Card({ children, className = '', raised = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-line ${raised ? 'bg-surface-raised shadow-sm' : 'bg-surface'} ${className}`}
    >
      {children}
    </div>
  );
}
