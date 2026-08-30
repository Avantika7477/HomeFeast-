import { useEffect, useState } from "react";
import { api } from "../../api";

const primaryLabels = {
  users: "Registered users",
  cooks: "Approved cooks",
  pendingCooks: "Pending cooks",
  orders: "Total orders",
  activeSubscriptions: "Active subscriptions",
  openComplaints: "Open complaints",
};

const advancedLabels = {
  orderConversionRate: "Order conversion rate",
  cookOnboardingRate: "Cook onboarding rate",
  monthlyActiveUsers: "Monthly active users",
  customerRetentionRate: "Customer retention rate",
};

function formatValue(key, value) {
  if (key.endsWith("Rate")) return `${value}%`;
  return value;
}

export default function AdminHome() {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    api("/api/admin/kpis").then((d) => setKpis(d.kpis));
  }, []);

  if (!kpis) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="page-title">Admin overview</h1>
      <p className="page-subtitle">Platform health, growth, and engagement metrics.</p>

      <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink/50">Core counts</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(primaryLabels).map(([key, label]) => (
          <div key={key} className="card">
            <p className="text-sm text-ink/60">{label}</p>
            <p className="font-display text-3xl">{kpis[key]}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ink/50">Advanced KPIs</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(advancedLabels).map(([key, label]) => (
          <div key={key} className="card bg-sand/50">
            <p className="text-sm text-ink/60">{label}</p>
            <p className="font-display text-3xl">{formatValue(key, kpis[key])}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
