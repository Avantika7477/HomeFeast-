import { useEffect, useState } from "react";
import { api } from "../../api";

const labels = {
  users: "Registered users",
  cooks: "Approved cooks",
  pendingCooks: "Pending cooks",
  orders: "Orders",
  activeSubscriptions: "Active subscriptions",
  openComplaints: "Open complaints",
};

export default function AdminHome() {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    api("/api/admin/kpis").then((d) => setKpis(d.kpis));
  }, []);

  if (!kpis) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="page-title">Admin overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(labels).map(([key, label]) => (
          <div key={key} className="card">
            <p className="text-sm text-ink/60">{label}</p>
            <p className="font-display text-3xl">{kpis[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
