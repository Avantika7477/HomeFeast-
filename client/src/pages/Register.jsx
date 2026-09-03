import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";
import Hint from "../components/Hint";

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
      <Link to="/" className="mb-8 font-display text-2xl tracking-tight text-clay">
        HomeFeast
      </Link>
      <h1 className="page-title">Create your account</h1>
      <p className="page-subtitle">Join as a customer or list your home kitchen.</p>
      <form className="card mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-sand/50 p-1">
          {["customer", "cook"].map((role) => (
            <Hint
              key={role}
              text={
                role === "customer"
                  ? "Register as a customer to browse cooks and request tiffin."
                  : "Register as a home cook to list your kitchen and receive orders."
              }
            >
              <button
                type="button"
                className={form.role === role ? "btn-primary w-full" : "btn-ghost w-full border-transparent bg-transparent shadow-none"}
                onClick={() => set("role", role)}
              >
                {role === "customer" ? "I want food" : "I cook"}
              </button>
            </Hint>
          ))}
        </div>
        <div>
          <label className="label">Full name</label>
          <input className="input" placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" placeholder="Create a password" value={form.password} onChange={(e) => set("password", e.target.value)} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Phone</label>
            <input className="input" placeholder="Optional" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className="label">City</label>
            <input className="input" placeholder="Pune" value={form.city} onChange={(e) => set("city", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Address</label>
          <input className="input" placeholder="Delivery address" value={form.address} onChange={(e) => set("address", e.target.value)} />
        </div>
        {form.role === "cook" && (
          <div>
            <label className="label">Kitchen name</label>
            <input
              className="input"
              placeholder="e.g. Aai’s Thali"
              value={form.kitchenName}
              onChange={(e) => set("kitchenName", e.target.value)}
            />
          </div>
        )}
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Hint text="Create your account. Cooks stay hidden until an admin approves them.">
          <button className="btn-primary w-full" type="submit">
            Register
          </button>
        </Hint>
      </form>
      <p className="mt-5 text-sm text-ink/55">
        Already have an account? <Link to="/login" className="font-semibold text-clay hover:underline">Log in</Link>
      </p>
    </div>
  );
}
