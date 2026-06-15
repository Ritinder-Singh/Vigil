export interface ServiceStatus {
  name: string;
  up: boolean;
}


export interface Process {
  pid: number;
  name: string;
  user: string;
  cpu_percent: number;
  mem_percent: number;
  status: string;

}



export interface Mount {
  device: string;
  mountpoint: string;
  total_gb: number;
  used_gb: number;
  percent: number;

}

export interface NetworkInterface {
  name: string;
  bytes_sent_mb: number;
  bytes_recv_mb: number;

}

export interface PublicMetrics {
  uptime_seconds: number;
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
  net_in_mbps: number;
  net_out_mbps: number;
  services: ServiceStatus[];
}

export interface PrivateMetrics extends PublicMetrics {
  cpu_per_core: number[];
  load_avg: [number, number, number];
  memory_total_gb: number;
  memory_used_gb: number;
  processes: Process[];
  mounts: Mount[];
  interfaces: NetworkInterface[];
}
