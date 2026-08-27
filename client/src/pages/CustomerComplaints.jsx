import { useEffect, useState } from "react";
import { api } from "../api";

export default function CustomerComplaints() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ subject: "", description: "" });
  const [message, setMessage] = useState("");

  async function load() {
    const data = await api("/api/complaints/mine");
    setItems(data.complaints);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      await api("/api/complaints", { method: "POST", body: JSON.stringify(form) });
      setForm({ subject: "", description: "" });
      setMessage("Complaint submitted.");
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form className="card space-y-3" onSubmit={submit}>
        <h1 className="page-title text-2xl">Raise a complaint</h1>
        <input
          className="input"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
        />
        <textarea
          className="input min-h-28"
          placeholder="What happened?"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <button className="btn-primary" type="submit">
          Submit
        </button>
        {message && <p className="text-sm text-sage">{message}</p>}
      </form>
      <div>
        <h2 className="page-title text-2xl">Your tickets</h2>
        <div className="mt-3 space-y-3">
          {items.map((c) => (
            <div key={c._id} className="card">
              <p className="font-semibold">{c.subject}</p>
              <p className="wrap-anywhere text-sm text-ink/70">{c.description}</p>
              <span className="badge mt-2 bg-sand">{c.status}</span>
              {c.adminNotes && <p className="mt-2 text-xs text-ink/50">Admin: {c.adminNotes}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
