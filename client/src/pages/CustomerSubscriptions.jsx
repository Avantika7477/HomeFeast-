import { useEffect, useState } from "react";
import { api } from "../api";
import Hint from "../components/Hint";

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
      <h1 className="page-title">Subscriptions</h1>
      <div className="mt-5 space-y-3">
        {items.map((sub) => (
          <div key={sub._id} className="card flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
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
              <Hint text="Stop this meal plan. You will not be billed for future days.">
                <button className="btn-ghost w-full sm:w-auto" type="button" onClick={() => cancel(sub._id)}>
                  Cancel
                </button>
              </Hint>
            )}
          </div>
        ))}
        {!items.length && <p className="text-sm text-ink/50">No subscriptions yet.</p>}
      </div>
    </div>
  );
}
