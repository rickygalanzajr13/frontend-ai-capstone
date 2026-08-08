type SprocktdMarkProps = {
  className?: string;
  title?: string;
};

const TEETH = Array.from({ length: 8 }, (_, i) => i * 45);

/**
 * Sprocktd mark — a geometric sprocket wheel: a thin outer ring with eight
 * evenly spaced film perforations orbiting a small hub. Flat vector, Swiss
 * grid, inherits currentColor.
 */
export function SprocktdMark({ className, title }: SprocktdMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="24" cy="24" r="20.5" stroke="currentColor" strokeWidth="3" />
      {TEETH.map((angle) => (
        <rect
          key={angle}
          x="21"
          y="7.5"
          width="6"
          height="7"
          rx="1.6"
          fill="currentColor"
          transform={`rotate(${angle} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="4.5" fill="currentColor" />
    </svg>
  );
}
