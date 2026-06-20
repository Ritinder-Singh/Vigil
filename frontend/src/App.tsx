import "./styles/layout.css";
import { useMetricsStream } from "./hooks/useMetricsStream";
import { MetricCell } from "./components/MetricCell";
import { formatUptime, networkPercent } from "./utils/format";
import { HeaderStatus } from "./components/HeaderStatus";
import { useAuth } from "./context/AuthContext";
import { usePrivateMetricsStream } from "./hooks/usePrivateMetricsStream";
import { ProcessTable } from "./components/ProcessTable";
import { LoadAverage } from "./components/LoadAverage";
import { CoreBreakdown } from "./components/CoreBreakdown";
import { MountsTable } from "./components/MountsTable";
import { NetworkInterfaces } from "./components/NetworkInterfaces";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  const { isAuthenticated } = useAuth();
  const { metrics, connected } = useMetricsStream();
  const { metrics: privateMetrics } = usePrivateMetricsStream(isAuthenticated);

  if (!metrics) {
    return (
      <div className="page">
        <p>Connecting...</p>
      </div>
    );
  }

  const netTotal = metrics.net_in_mbps + metrics.net_out_mbps;

  return (
    <div className="page">
      <header className="header">
        <div>
          <div className="header__title">VIGIL</div>
          <div className="header__meta">
            vps-prod-01.chandigarh — up {formatUptime(metrics.uptime_seconds)}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <ThemeToggle />
          <HeaderStatus connected={connected} />
        </div>
      </header>

      <div className="metric-grid">
        <MetricCell
          label="CPU"
          value={metrics.cpu_percent.toFixed(0)}
          unit="%"
          percent={metrics.cpu_percent}
        />
        <MetricCell
          label="Memory"
          value={metrics.memory_percent.toFixed(0)}
          unit="%"
          percent={metrics.memory_percent}
        />
        <MetricCell
          label="Disk"
          value={metrics.disk_percent.toFixed(0)}
          unit="%"
          percent={metrics.disk_percent}
        />
        <MetricCell
          label="Network"
          value={netTotal.toFixed(1)}
          unit="MB/s"
          percent={networkPercent(metrics.net_in_mbps, metrics.net_out_mbps)}
        />
      </div>

      <div className="section">
        <div className="section__header">Services</div>
        <div className="section__body">
          <div className="services-row">
            {metrics.services.map((svc) => (
              <span className="service-item" key={svc.name}>
                <span
                  className={`status-dot ${svc.up ? "status-dot--live" : ""}`}
                />
                {svc.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      {isAuthenticated && privateMetrics && (
        <>
          <div className="section">
            <div className="section__header">Load Average</div>
            <div className="section__body">
              <LoadAverage loadAvg={privateMetrics.load_avg} />
            </div>
          </div>

          <div className="section">
            <div className="section__header">CPU per Core</div>
            <div className="section__body">
              <CoreBreakdown cores={privateMetrics.cpu_per_core} />
            </div>
          </div>

          <div className="section">
            <div className="section__header">Disk Mounts</div>
            <div className="section__body" style={{ padding: 0 }}>
              <MountsTable mounts={privateMetrics.mounts} />
            </div>
          </div>

          <div className="section">
            <div className="section__header">Network Interfaces</div>
            <div className="section__body" style={{ padding: 0 }}>
              <NetworkInterfaces interfaces={privateMetrics.interfaces} />
            </div>
          </div>

          <div className="section">
            <div className="section__header">Processes</div>
            <div className="section__body" style={{ padding: 0 }}>
              <ProcessTable processes={privateMetrics.processes} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
