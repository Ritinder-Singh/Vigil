import { DitherBar } from "./DitherBar";

interface CoreBreakdownProps {
    cores: number[];
}

export function CoreBreakdown({cores}: CoreBreakdownProps) {
    return(
        <div className="core-grid">
            {cores.map((pct, i) => (
                <div className="core-cell" key={i}>
                    <div className="core-cell__label">core {i}</div>
                    <div className="process-table__num">{pct.toFixed(0)}%</div>
                    < DitherBar value={pct} segments={12} />
                </div>
            ))}
        </div>
    );
}