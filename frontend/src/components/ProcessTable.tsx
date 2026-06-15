import { DitherBar } from "./DitherBar";
import type { Process } from "../types/metrics";

interface ProcessTableProps {
  processes: Process[];
}

export function ProcessTable({ processes }: ProcessTableProps) {
  return (
    <table className="process-table">
      <thead>
        <tr>
          <th>PID</th>
          <th>Name</th>
          <th>User</th>
          <th>CPU</th>
          <th>MEM</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {processes.slice(0, 12).map((p) => (
          <tr key={p.pid}>
            <td className="process-table__num">{p.pid}</td>
            <td>{p.name}</td>
            <td className="process-table__muted">{p.user}</td>
            <td>
              <div className="process-table__metric">
                <span className="process-table__num">{p.cpu_percent.toFixed(1)}%</span>
                <DitherBar value={p.cpu_percent} segments={14} />
              </div>
            </td>
            <td>
              <div className="process-table__metric">
                <span className="process-table__num">{p.mem_percent.toFixed(1)}%</span>
                <DitherBar value={p.mem_percent} segments={14} />
              </div>
            </td>
            <td className="process-table__muted">{p.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
