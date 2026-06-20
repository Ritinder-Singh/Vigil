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
            <td className="data-table__muted">{m.device}</td>
            <td>{m.mountpoint}</td>
            <td className="data-table__num">{m.used_gb} GB</td>
            <td className="data-table__muted">{m.total_gb} GB</td>
            <td>
              <div className="data-table__metric">
                <span className="data-table__num">
                  {m.percent.toFixed(0)}%
                </span>
                <DitherBar value={m.percent} segments={8} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
