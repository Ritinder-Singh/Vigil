import type { NetworkInterface } from "../types/metrics";

interface NetworkInterfacesProps {
  interfaces: NetworkInterface[];
}

export function NetworkInterfaces({ interfaces }: NetworkInterfacesProps) {
  return (
    <table className="data-table network-table">
      <thead>
        <tr>
          <th>Interface</th>
          <th>Sent</th>
          <th>Received</th>
        </tr>
      </thead>
      <tbody>
        {interfaces.map((iface) => (
          <tr key={iface.name}>
            <td data-label="Interface">{iface.name}</td>
            <td data-label="Sent" className="data-table__num">{iface.bytes_sent_mb} MB</td>
            <td data-label="Received" className="data-table__num">{iface.bytes_recv_mb} MB</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}