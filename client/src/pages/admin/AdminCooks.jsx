import { useEffect, useState } from "react";
import { api } from "../../api";
import Hint from "../../components/Hint";

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
      <h1 className="page-title">Cook approvals</h1>
      <div className="mt-5 space-y-3">
        {cooks.map((cook) => (
          <div key={cook._id} className="card flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <p className="font-semibold">{cook.kitchenName}</p>
              <p className="text-sm text-ink/60">
                {cook.user?.name} · {cook.city} · {cook.status}
              </p>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <Hint text="Make this kitchen visible to customers on Browse.">
                <button className="btn-primary flex-1 sm:flex-none" type="button" onClick={() => setStatus(cook._id, "approved")}>
                  Approve
                </button>
              </Hint>
              <Hint text="Keep this cook hidden from customers.">
                <button className="btn-ghost flex-1 sm:flex-none" type="button" onClick={() => setStatus(cook._id, "rejected")}>
                  Reject
                </button>
              </Hint>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
