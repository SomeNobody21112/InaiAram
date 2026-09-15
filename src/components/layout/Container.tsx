import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}

export function Container({ children, className = '', wide = false }: ContainerProps) {
  return (
    <div className={`mx-auto px-5 sm:px-8 lg:px-12 ${wide ? 'max-w-[1400px]' : 'max-w-[1200px]'} ${className}`}>
      {children}
    </div>
  );
}
