import { DitherBar } from "./DitherBar";
import type { Mount } from "../types/metrics";

interface MountsTableProps {
  mounts: Mount[];
}

export function MountsTable({ mounts }: MountsTableProps) {
  return (
    <table className="data-table mounts-table">
      <thead>
        <tr>
          <th>Device</th>
          <th>Mount</th>
          <th>Used</th>
          <th>Total</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        {mounts.map((m) => (
          <tr key={m.mountpoint}>
            <td data-label="Device" className="data-table__muted">{m.device}</td>
            <td data-label="Mount">{m.mountpoint}</td>
            <td data-label="Used" className="data-table__num">{m.used_gb} GB</td>
            <td data-label="Total" className="data-table__muted">{m.total_gb} GB</td>
            <td data-label="Usage">
              <div className="data-table__metric">
                <span className="data-table__num">{m.percent.toFixed(0)}%</span>
                <DitherBar value={m.percent} segments={8} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}