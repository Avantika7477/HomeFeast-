import { useEffect, useState } from "react";
import { api } from "../../api";

export default function AdminSubscriptions() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api("/api/admin/subscriptions").then((d) => setItems(d.subscriptions));
  }, []);

  return (
    <div>
      <h1 className="page-title">All subscriptions</h1>
      <div className="mt-4 space-y-2">
        {items.map((s) => (
          <div key={s._id} className="card text-sm">
            <p className="wrap-anywhere font-semibold">
              {s.customer?.name} → {s.cook?.kitchenName} · {s.planType}
            </p>
            <p>
              ₹{s.price} · {s.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
