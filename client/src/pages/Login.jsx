import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(homeFor(user.role));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-3 py-8 sm:px-4">
      <Link to="/" className="mb-6 font-display text-2xl text-clay">
        HomeFeast
      </Link>
      <h1 className="page-title">Welcome back</h1>
      <form className="card mt-6 space-y-3" onSubmit={onSubmit}>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full" type="submit">
          Log in
        </button>
      </form>
      <p className="mt-4 text-sm text-ink/60">
        New here? <Link to="/register" className="text-clay">Create an account</Link>
      </p>
    </div>
  );
}
