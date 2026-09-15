interface DiamondProps {
  className?: string;
}

export function Diamond({ className = '' }: DiamondProps) {
  return (
    <div className={`flex justify-center ${className}`} aria-hidden="true">
      <span className="w-1.5 h-1.5 rotate-45 bg-terracotta" />
    </div>
  );
}
