import { DitherBar } from "./DitherBar";

interface MetricCellProps {
  label: string;
  value: string;
  unit?: string;
  percent: number;
}

export function MetricCell({ label, value, unit, percent }: MetricCellProps) {
  return (
    <div className="metric-cell">
      <div className="metric-cell__label">{label}
      </div>
      <div className="metric-cell__value">
        {value}
        {unit && <span className="metric-cell__value-unit">{unit}</span>}
      </div>
      <DitherBar value={percent} />
    </div>
  );
}




