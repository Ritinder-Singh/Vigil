import { useAuth } from "../context/AuthContext";
import { LoginForm } from "./LoginForm";

interface HeaderStatusProps {
  connected: boolean;
}

export function HeaderStatus({ connected }: HeaderStatusProps) {
  const { isAuthenticated, loading, logout } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return (
      <div className="header__status">
        <span className={`status-dot ${connected ? "status-dot--live" : ""}`} />
        AUTHENTICATED
        <button className="header__logout" onClick={logout}>
          LOGOUT
        </button>
      </div>
    );
  }

  return (
    <div className="header__status">
      <LoginForm />
    </div>
  );
}
