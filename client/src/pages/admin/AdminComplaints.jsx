import { useEffect, useState } from "react";
import { api } from "../../api";

export default function AdminComplaints() {
  const [items, setItems] = useState([]);

  async function load() {
    const data = await api("/api/complaints");
    setItems(data.complaints);
  }

  useEffect(() => {
    load();
  }, []);

  async function resolve(id) {
    const adminNotes = prompt("Resolution note", "Spoke with both parties.") || "";
    await api(`/api/complaints/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "resolved", adminNotes }),
    });
    load();
  }

  return (
    <div>
      <h1 className="page-title">Complaints</h1>
      <div className="mt-4 space-y-3">
        {items.map((c) => (
          <div key={c._id} className="card flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <p className="font-semibold">{c.subject}</p>
              <p className="wrap-anywhere text-sm text-ink/70">{c.description}</p>
              <p className="text-xs text-ink/50">From {c.raisedBy?.name}</p>
              <span className="badge mt-2 bg-sand">{c.status}</span>
            </div>
            {c.status !== "resolved" && (
              <button className="btn-primary w-full sm:w-auto" type="button" onClick={() => resolve(c._id)}>
                Resolve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
