import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

export function LoginForm() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    const ok = await login(password);
    if (!ok) {
      setError(true);
      setPassword("");
    }
    setSubmitting(false);
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label className="login-form__label" htmlFor="password">
        ACCESS KEY
      </label>
      <input
        id="password"
        type="password"
        className="login-form__input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
      />
      <button type="submit" className="login-form__submit" disabled={submitting}>
        {submitting ? "..." : "AUTHENTICATE"}
      </button>
      {error && <div className="login-form__error">Access denied</div>}
    </form>
  );
}
