from pydantic import BaseModel


class ServiceStatus(BaseModel):
    name: str
    up: bool


class Process(BaseModel):
    pid: int
    name: str
    user: str
    cpu_percent: float
    mem_percent: float
    status: str


class Mount(BaseModel):
    device: str
    mountpoint: str
    total_gb: float
    used_gb: float
    percent: float


class NetworkInterface(BaseModel):
    name: str
    bytes_sent_mb: float
    bytes_recv_mb: float


class PublicMetrics(BaseModel):
    uptime_seconds: float
    cpu_percent: float
    memory_percent: float
    disk_percent: float
    net_in_mbps: float
    net_out_mbps: float
    services: list[ServiceStatus]


class PrivateMetrics(PublicMetrics):
    cpu_per_core: list[float]
    load_avg: tuple[float, float, float]
    memory_total_gb: float
    memory_used_gb: float
    processes: list[Process]
    mounts: list[Mount]
    interfaces: list[NetworkInterface]
