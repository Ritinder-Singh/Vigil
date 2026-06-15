const FILL_CHAR = '▒';
const EMPTY_CHAR = '░';
const WARN_CHAR = '▓';

interface DitherBarProps {
  value: number;
  segments?: number;
}

export function DitherBar({ value, segments = 28 }: DitherBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const filledCount = Math.round((clamped / 100) * segments);
  const emptyCount = segments - filledCount;


  let level: 'normal' | 'warn' | 'critical' = 'normal';
  if (clamped >= 85) level = 'critical';
  else if (clamped >= 65) level = 'warn';

  const fillChar = level === 'critical' ? WARN_CHAR : FILL_CHAR;

  return (
    <div
      className={`dither-bar dither-bar--${level}`}
      role="img"
      aria-label={`${Math.round(clamped)} percent`}
    >
      <span className="dither-bar__fill">{fillChar.repeat(filledCount)}</span>
      <span className="dither-bar__empty">{EMPTY_CHAR.repeat(emptyCount)}</span>
    </div>
  );
}
