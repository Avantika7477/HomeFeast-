import { useEffect, useState } from "react";
import { api } from "../api";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    const data = await api("/api/orders/mine");
    setOrders(data.orders);
  }

  useEffect(() => {
    load().catch((err) => setMessage(err.message));
  }, []);

  async function cancel(id) {
    await api(`/api/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "cancelled" }) });
    load();
  }

  async function review(orderId) {
    const rating = Number(prompt("Rating 1–5", "5"));
    if (!rating) return;
    const comment = prompt("Comment", "Tasted like home") || "";
    try {
      await api("/api/reviews", { method: "POST", body: JSON.stringify({ orderId, rating, comment }) });
      setMessage("Review saved.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Your orders</h1>
      {message && <p className="mt-2 text-sm text-sage">{message}</p>}
      <div className="mt-5 space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{order.cook?.kitchenName}</p>
              <p className="text-sm text-ink/60">
                ₹{order.totalAmount} · {order.items.map((i) => `${i.name}×${i.quantity}`).join(", ")}
              </p>
              <span className="badge mt-2 bg-sand">{order.status}</span>
            </div>
            <div className="flex gap-2">
              {order.status === "pending" && (
                <button className="btn-ghost" type="button" onClick={() => cancel(order._id)}>
                  Cancel
                </button>
              )}
              {order.status === "completed" && (
                <button className="btn-primary" type="button" onClick={() => review(order._id)}>
                  Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
