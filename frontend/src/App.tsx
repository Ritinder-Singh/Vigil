import './styles/layout.css';
import { useMetricsStream } from './hooks/useMetricsStream';
import { MetricCell } from './components/MetricCell';
import { formatUptime, networkPercent } from './utils/format';
import { HeaderStatus } from './components/HeaderStatus';

function App() {
  const { metrics, connected } = useMetricsStream();

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
        <HeaderStatus connected={connected} />
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
                <span className={`status-dot ${svc.up ? 'status-dot--live' : ''}`} />
                {svc.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
