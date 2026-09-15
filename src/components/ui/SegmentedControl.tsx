import { useId } from 'react';

interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

export function SegmentedControl({ options, value, onChange, className = '', label }: SegmentedControlProps) {
  const groupId = useId();

  return (
    <div role="radiogroup" aria-label={label} className={`flex bg-surface-raised rounded-md p-0.5 border border-line ${className}`}>
      {options.map((option) => {
        const isSelected = option === value;
        return (
          <button
            key={option}
            role="radio"
            aria-checked={isSelected}
            id={`${groupId}-${option}`}
            onClick={() => onChange(option)}
            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium font-sans transition-all duration-140 ${
              isSelected
                ? 'bg-terracotta text-white shadow-sm'
                : 'text-ink-3 hover:text-ink'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
