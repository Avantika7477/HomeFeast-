import { useEffect, useState } from "react";
import { api } from "../../api";

export default function AdminCooks() {
  const [cooks, setCooks] = useState([]);

  async function load() {
    const data = await api("/api/admin/cooks");
    setCooks(data.cooks);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    await api(`/api/admin/cooks/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Cook approvals</h1>
      <div className="mt-5 space-y-3">
        {cooks.map((cook) => (
          <div key={cook._id} className="card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{cook.kitchenName}</p>
              <p className="text-sm text-ink/60">
                {cook.user?.name} · {cook.city} · {cook.status}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary" type="button" onClick={() => setStatus(cook._id, "approved")}>
                Approve
              </button>
              <button className="btn-ghost" type="button" onClick={() => setStatus(cook._id, "rejected")}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
