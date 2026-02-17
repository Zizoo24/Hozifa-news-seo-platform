import { useEffect, useState } from "react";

interface HealthResponse {
  status: string;
  db: string;
}

const API_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: HealthResponse) => setHealth(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>News SEO Platform</h1>
      <h2>Health Check</h2>

      {loading && <p>Checking backend status...</p>}

      {error && (
        <div style={{ color: "#dc2626" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {health && (
        <table
          style={{
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Service</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Backend</td>
              <td style={tdStyle}>
                <StatusBadge value={health.status} />
              </td>
            </tr>
            <tr>
              <td style={tdStyle}>Database</td>
              <td style={tdStyle}>
                <StatusBadge value={health.db} />
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </main>
  );
}

function StatusBadge({ value }: { value: string }) {
  const isOk = value === "ok";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.25rem 0.75rem",
        borderRadius: "9999px",
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#fff",
        backgroundColor: isOk ? "#16a34a" : "#dc2626",
      }}
    >
      {value}
    </span>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "0.5rem 1rem",
  borderBottom: "2px solid #e5e7eb",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  borderBottom: "1px solid #e5e7eb",
};

export default App;
