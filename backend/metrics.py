import time
import psutil
from models import (
    PublicMetrics,
    PrivateMetrics,
    ServiceStatus,
    Process,
    Mount,
    NetworkInterface,
)

BOOT_TIME = psutil.boot_time()

_last_net = psutil.net_io_counters()
_last_net_time = time.time()

WATCHED_SERVICES = ["nginx", "postgres", "redis", "sshd"]


def get_uptime() -> float:
    return time.time() - BOOT_TIME


def get_services() -> list[ServiceStatus]:
    running = {p.name() for p in psutil.process_iter(["name"])}
    return [ServiceStatus(name=svc, up=svc in running) for svc in WATCHED_SERVICES]


def get_net_mbps() -> tuple[float, float]:
    global _last_net, _last_net_time
    current = psutil.net_io_counters()
    now = time.time()
    elapsed = now - _last_net_time or 1

    recv_mbps = (current.bytes_recv - _last_net.bytes_recv) / elapsed / 1_000_000
    sent_mbps = (current.bytes_sent - _last_net.bytes_sent) / elapsed / 1_000_000

    _last_net = current
    _last_net_time = now
    return round(recv_mbps, 3), round(sent_mbps, 3)


def get_public_metrics() -> PublicMetrics:
    net_in, net_out = get_net_mbps()
    return PublicMetrics(
        uptime_seconds=get_uptime(),
        cpu_percent=psutil.cpu_percent(interval=0.1),
        memory_percent=psutil.virtual_memory().percent,
        disk_percent=psutil.disk_usage("/").percent,
        net_in_mbps=net_in,
        net_out_mbps=net_out,
        services=get_services(),
    )


def get_private_metrics() -> PrivateMetrics:
    net_in, net_out = get_net_mbps()
    mem = psutil.virtual_memory()

    processes = []
    for p in psutil.process_iter(
        ["pid", "name", "username", "cpu_percent", "memory_percent", "status"]
    ):
        try:
            info = p.info
            processes.append(
                Process(
                    pid=info["pid"],
                    name=info["name"] or "",
                    user=info["username"] or "",
                    cpu_percent=info["cpu_percent"] or 0.0,
                    mem_percent=info["memory_percent"] or 0.0,
                    status=info["status"] or "",
                )
            )
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    processes.sort(key=lambda p: p.cpu_percent, reverse=True)

    mounts = []
    for part in psutil.disk_partitions():
        try:
            usage = psutil.disk_usage(part.mountpoint)
            mounts.append(
                Mount(
                    device=part.device,
                    mountpoint=part.mountpoint,
                    total_gb=round(usage.total / 1e9, 2),
                    used_gb=round(usage.used / 1e9, 2),
                    percent=usage.percent,
                )
            )
        except PermissionError:
            continue

    interfaces = []
    net_per_nic = psutil.net_io_counters(pernic=True)
    for name, stats in net_per_nic.items():
        interfaces.append(
            NetworkInterface(
                name=name,
                bytes_sent_mb=round(stats.bytes_sent / 1e6, 2),
                bytes_recv_mb=round(stats.bytes_recv / 1e6, 2),
            )
        )

    return PrivateMetrics(
        uptime_seconds=get_uptime(),
        cpu_percent=psutil.cpu_percent(interval=0.1),
        memory_percent=mem.percent,
        memory_total_gb=round(mem.total / 1e9, 2),
        memory_used_gb=round(mem.used / 1e9, 2),
        disk_percent=psutil.disk_usage("/").percent,
        net_in_mbps=net_in,
        net_out_mbps=net_out,
        services=get_services(),
        cpu_per_core=psutil.cpu_percent(interval=0.1, percpu=True),
        load_avg=psutil.getloadavg(),
        processes=processes[:20],
        mounts=mounts,
        interfaces=interfaces,
    )
