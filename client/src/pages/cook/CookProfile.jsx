import { useEffect, useState } from "react";
import { api } from "../../api";

export default function CookProfilePage() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api("/api/cooks/me").then((d) => {
      const p = d.profile;
      setForm({
        kitchenName: p.kitchenName,
        bio: p.bio,
        city: p.city,
        serviceAreas: (p.serviceAreas || []).join(", "),
        cuisines: (p.cuisines || []).join(", "),
        deliveryStart: p.deliveryStart,
        deliveryEnd: p.deliveryEnd,
      });
    });
  }, []);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e) {
    e.preventDefault();
    await api("/api/cooks/me", {
      method: "PUT",
      body: JSON.stringify({
        ...form,
        serviceAreas: form.serviceAreas.split(",").map((s) => s.trim()).filter(Boolean),
        cuisines: form.cuisines.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    setMessage("Profile saved.");
  }

  if (!form) return <p>Loading…</p>;

  return (
    <form className="card max-w-xl space-y-3" onSubmit={save}>
      <h1 className="font-display text-3xl">Kitchen profile</h1>
      <input className="input" value={form.kitchenName} onChange={(e) => set("kitchenName", e.target.value)} />
      <textarea className="input min-h-24" value={form.bio} onChange={(e) => set("bio", e.target.value)} />
      <input className="input" placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
      <input
        className="input"
        placeholder="Service areas (comma separated)"
        value={form.serviceAreas}
        onChange={(e) => set("serviceAreas", e.target.value)}
      />
      <input
        className="input"
        placeholder="Cuisines"
        value={form.cuisines}
        onChange={(e) => set("cuisines", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <input className="input" type="time" value={form.deliveryStart} onChange={(e) => set("deliveryStart", e.target.value)} />
        <input className="input" type="time" value={form.deliveryEnd} onChange={(e) => set("deliveryEnd", e.target.value)} />
      </div>
      <button className="btn-primary" type="submit">
        Save
      </button>
      {message && <p className="text-sm text-sage">{message}</p>}
    </form>
  );
}
