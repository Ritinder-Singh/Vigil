import { DitherBar } from "./DitherBar";
import type { Process } from "../types/metrics";

interface ProcessTableProps {
  processes: Process[];
}

export function ProcessTable({ processes }: ProcessTableProps) {
  return (
    <table className="data-table process-table">
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
            <td data-label="PID" className="data-table__num">{p.pid}</td>
            <td data-label="Name">{p.name}</td>
            <td data-label="User" className="data-table__muted">{p.user}</td>
            <td data-label="CPU">
              <div className="data-table__metric">
                <span className="data-table__num">{p.cpu_percent.toFixed(1)}%</span>
                <DitherBar value={p.cpu_percent} segments={8} />
              </div>
            </td>
            <td data-label="Mem">
              <div className="data-table__metric">
                <span className="data-table__num">{p.mem_percent.toFixed(1)}%</span>
                <DitherBar value={p.mem_percent} segments={8} />
              </div>
            </td>
            <td data-label="Status" className="data-table__muted">{p.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}