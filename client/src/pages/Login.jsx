import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";
import Hint from "../components/Hint";

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
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <Link to="/" className="mb-8 font-display text-2xl tracking-tight text-clay">
        HomeFeast
      </Link>
      <h1 className="page-title">Welcome back</h1>
      <p className="page-subtitle">Log in to order tiffin or manage your kitchen.</p>
      <form className="card mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className="input"
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            className="input"
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Hint text="Sign in and go to your dashboard.">
          <button className="btn-primary w-full" type="submit">
            Log in
          </button>
        </Hint>
      </form>
      <p className="mt-5 text-sm text-ink/55">
        New here? <Link to="/register" className="font-semibold text-clay hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
