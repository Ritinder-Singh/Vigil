import { useMetrics } from "./hooks/useMetrics";

function App() {
  const { metrics, error } = useMetrics();

  if (error) return <div>Error: {error}</div>;
  if (!metrics) return <div>Loading...</div>;


  return (
    <pre>{JSON.stringify(metrics, null, 2)}</pre>
  );
}


export default App;



