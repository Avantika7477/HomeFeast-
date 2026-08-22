import { useEffect, useState } from "react";
import { api } from "../../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api("/api/admin/orders").then((d) => setOrders(d.orders));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl">All orders</h1>
      <div className="mt-4 space-y-2">
        {orders.map((o) => (
          <div key={o._id} className="card text-sm">
            <p className="font-semibold">
              {o.customer?.name} → {o.cook?.kitchenName}
            </p>
            <p>
              ₹{o.totalAmount} · {o.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
