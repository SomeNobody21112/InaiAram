interface EmblemProps {
  size?: number;
  className?: string;
  opacity?: number;
}

export function Emblem({ size = 40, className = '', opacity = 1 }: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      {/* Radial garland spokes */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 20 + 6 * Math.cos(angle);
        const y1 = 20 + 6 * Math.sin(angle);
        const x2 = 20 + 16 * Math.cos(angle);
        const y2 = 20 + 16 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.75"
            opacity={i % 3 === 0 ? 0.5 : 0.25}
          />
        );
      })}
      {/* Inner decorative dots */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const cx = 20 + 10 * Math.cos(angle);
        const cy = 20 + 10 * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="1.5"
            fill="currentColor"
            opacity="0.35"
          />
        );
      })}
      <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
