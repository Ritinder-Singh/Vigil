interface LoadAverageProps {
    loadAvg: [number,number,number]
}


export function LoadAverage({loadAvg}: LoadAverageProps) {
    const [one,five,fifteen] = loadAvg;
    return(
        <div className="load-avg">
            <div className="load-avg__item">
                <span className="load-av__label">1m</span>
                <span className="process-table__num">{one.toFixed(2)}</span>
            </div>
            <div className="load-avg__item">
                <span className="load-av__label">5m</span>
                <span className="process-table__num">{five.toFixed(2)}</span>
            </div>
            <div className="load-avg__item">
                <span className="load-av__label">15m</span>
                <span className="process-table__num">{fifteen.toFixed(2)}</span>
            </div>
        </div>
    );
}