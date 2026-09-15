import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', size = 'md', children, fullWidth, className = '', disabled, ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-sans font-medium transition-all duration-150 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const variants: Record<Variant, string> = {
    primary:
      'bg-terracotta text-white hover:bg-terracotta-deep active:bg-terracotta-deep shadow-sm',
    secondary:
      'border border-line-strong text-ink hover:border-ink-3 hover:bg-surface-raised active:bg-bg-alt',
    ghost:
      'text-ink-2 hover:text-ink hover:bg-surface-raised active:bg-bg-alt',
  };

  const sizes: Record<Size, string> = {
    sm: 'px-4 py-2 text-[0.8125rem]',
    md: 'px-5 py-2.5 text-[0.8125rem]',
    lg: 'px-6 py-3 text-sm',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
