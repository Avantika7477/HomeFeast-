import { useEffect, useState } from "react";
import { api } from "../../api";

export default function CookSubscriptions() {
  const [data, setData] = useState({ subscriptions: [], earnings: 0 });

  async function load() {
    setData(await api("/api/subscriptions/cook"));
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    await api(`/api/subscriptions/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Subscription requests</h1>
      <p className="text-sm text-ink/60">Active plan value: ₹{data.earnings}</p>
      <div className="mt-5 space-y-3">
        {data.subscriptions.map((sub) => (
          <div key={sub._id} className="card flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-semibold">
                {sub.customer?.name} · {sub.planType}
              </p>
              <p className="text-sm text-ink/60">₹{sub.price}</p>
              <span className="badge mt-2 bg-sand">{sub.status}</span>
            </div>
            {sub.status === "pending" && (
              <div className="flex gap-2">
                <button className="btn-primary" type="button" onClick={() => setStatus(sub._id, "active")}>
                  Accept
                </button>
                <button className="btn-ghost" type="button" onClick={() => setStatus(sub._id, "rejected")}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
