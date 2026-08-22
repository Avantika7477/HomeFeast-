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
      <h1 className="font-display text-3xl">Complaints</h1>
      <div className="mt-4 space-y-3">
        {items.map((c) => (
          <div key={c._id} className="card flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-semibold">{c.subject}</p>
              <p className="text-sm text-ink/70">{c.description}</p>
              <p className="text-xs text-ink/50">From {c.raisedBy?.name}</p>
              <span className="badge mt-2 bg-sand">{c.status}</span>
            </div>
            {c.status !== "resolved" && (
              <button className="btn-primary" type="button" onClick={() => resolve(c._id)}>
                Resolve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
