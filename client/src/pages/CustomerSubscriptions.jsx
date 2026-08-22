import { useEffect, useState } from "react";
import { api } from "../api";

export default function CustomerSubscriptions() {
  const [items, setItems] = useState([]);

  async function load() {
    const data = await api("/api/subscriptions/mine");
    setItems(data.subscriptions);
  }

  useEffect(() => {
    load();
  }, []);

  async function cancel(id) {
    await api(`/api/subscriptions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "cancelled" }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Subscriptions</h1>
      <div className="mt-5 space-y-3">
        {items.map((sub) => (
          <div key={sub._id} className="card flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">
                {sub.cook?.kitchenName} · {sub.planType}
              </p>
              <p className="text-sm text-ink/60">
                ₹{sub.price} · {new Date(sub.startDate).toLocaleDateString()} –{" "}
                {new Date(sub.endDate).toLocaleDateString()}
              </p>
              <span className="badge mt-2 bg-sand">{sub.status}</span>
            </div>
            {sub.status !== "cancelled" && sub.status !== "rejected" && (
              <button className="btn-ghost" type="button" onClick={() => cancel(sub._id)}>
                Cancel
              </button>
            )}
          </div>
        ))}
        {!items.length && <p className="text-sm text-ink/50">No subscriptions yet.</p>}
      </div>
    </div>
  );
}
