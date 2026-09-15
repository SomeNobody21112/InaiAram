import type { ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  alt?: boolean;
  ariaLabelledBy?: string;
}

export function Section({ children, id, className = '', alt = false, ariaLabelledBy }: SectionProps) {
  const ref = useReveal({ once: true, threshold: 0.08 });

  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      ref={ref}
      className={`section-py ${alt ? 'bg-bg-alt' : 'bg-bg'} ${className}`}
    >
      {children}
    </section>
  );
}
