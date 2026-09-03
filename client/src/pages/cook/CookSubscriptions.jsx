import { useEffect, useState } from "react";
import { api } from "../../api";
import Hint from "../../components/Hint";

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
      <h1 className="page-title">Subscription requests</h1>
      <p className="text-sm text-ink/60">Active plan value: ₹{data.earnings}</p>
      <div className="mt-5 space-y-3">
        {data.subscriptions.map((sub) => (
          <div key={sub._id} className="card flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <p className="font-semibold">
                {sub.customer?.name} · {sub.planType}
              </p>
              <p className="text-sm text-ink/60">₹{sub.price}</p>
              <span className="badge mt-2 bg-sand">{sub.status}</span>
            </div>
            {sub.status === "pending" && (
              <div className="flex w-full gap-2 sm:w-auto">
                <Hint text="Start this recurring meal plan for the customer.">
                  <button className="btn-primary flex-1 sm:flex-none" type="button" onClick={() => setStatus(sub._id, "active")}>
                    Accept
                  </button>
                </Hint>
                <Hint text="Decline this subscription request.">
                  <button className="btn-ghost flex-1 sm:flex-none" type="button" onClick={() => setStatus(sub._id, "rejected")}>
                    Reject
                  </button>
                </Hint>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
