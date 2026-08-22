import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    address: "",
    role: "customer",
    kitchenName: "",
  });
  const [error, setError] = useState("");

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await register(form);
      navigate(homeFor(user.role));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <Link to="/" className="mb-6 font-display text-2xl text-clay">
        HomeFeast
      </Link>
      <h1 className="font-display text-3xl">Create your account</h1>
      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-2">
          {["customer", "cook"].map((role) => (
            <button
              key={role}
              type="button"
              className={form.role === role ? "btn-primary" : "btn-ghost"}
              onClick={() => set("role", role)}
            >
              {role === "customer" ? "I want food" : "I cook"}
            </button>
          ))}
        </div>
        <input className="input" placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => set("password", e.target.value)} required />
        <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <input className="input" placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
        <input className="input" placeholder="Address" value={form.address} onChange={(e) => set("address", e.target.value)} />
        {form.role === "cook" && (
          <input
            className="input"
            placeholder="Kitchen name"
            value={form.kitchenName}
            onChange={(e) => set("kitchenName", e.target.value)}
          />
        )}
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full" type="submit">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm text-ink/60">
        Already have an account? <Link to="/login" className="text-clay">Log in</Link>
      </p>
    </div>
  );
}
