import { useEffect, useState } from "react";
import { api } from "../api";
import Hint from "../components/Hint";

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
      <h1 className="page-title">Your orders</h1>
      {message && <p className="mt-2 text-sm text-sage">{message}</p>}
      <div className="mt-5 space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="card flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <p className="font-semibold">{order.cook?.kitchenName}</p>
              <p className="wrap-anywhere text-sm text-ink/60">
                ₹{order.totalAmount} · {order.items.map((i) => `${i.name}×${i.quantity}`).join(", ")}
              </p>
              <span className="badge mt-2 bg-sand">{order.status}</span>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              {order.status === "pending" && (
                <Hint text="Cancel this pending order before the cook accepts it.">
                  <button className="btn-ghost w-full sm:w-auto" type="button" onClick={() => cancel(order._id)}>
                    Cancel
                  </button>
                </Hint>
              )}
              {order.status === "completed" && (
                <Hint text="Rate this order and leave a comment for other customers.">
                  <button className="btn-primary w-full sm:w-auto" type="button" onClick={() => review(order._id)}>
                    Review
                  </button>
                </Hint>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
