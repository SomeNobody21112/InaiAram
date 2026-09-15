import type { ReactNode } from 'react';

interface CalloutProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gold' | 'terracotta';
}

const variantStyles = {
  default: 'border-line bg-surface-raised',
  gold: 'border-gold/20 bg-gold/5',
  terracotta: 'border-terracotta/20 bg-terracotta/5',
};

export function Callout({ children, className = '', variant = 'default' }: CalloutProps) {
  return (
    <div className={`rounded-xl border p-5 ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
