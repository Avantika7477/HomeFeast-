import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api";

export default function CookDashboard() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState({ orders: [], earnings: 0 });
  const [subs, setSubs] = useState({ subscriptions: [], earnings: 0 });

  useEffect(() => {
    api("/api/cooks/me").then((d) => setProfile(d.profile));
    api("/api/orders/cook").then(setOrders);
    api("/api/subscriptions/cook").then(setSubs);
  }, []);

  if (!profile) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-3xl">{profile.kitchenName}</h1>
      <p className="mt-1 text-sm text-ink/60">
        Status: <span className="badge bg-sand">{profile.status}</span>
        {profile.status === "pending" && " — customers will see you after admin approval."}
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm text-ink/60">Order earnings</p>
          <p className="font-display text-3xl">₹{orders.earnings}</p>
        </div>
        <div className="card">
          <p className="text-sm text-ink/60">Active plan value</p>
          <p className="font-display text-3xl">₹{subs.earnings}</p>
        </div>
        <div className="card">
          <p className="text-sm text-ink/60">Rating</p>
          <p className="font-display text-3xl">{profile.ratingAvg} ★</p>
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <Link className="btn-primary" to="/cook/menu">
          Edit menu
        </Link>
        <Link className="btn-ghost" to="/cook/orders">
          Review requests
        </Link>
      </div>
    </div>
  );
}
