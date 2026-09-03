import { useEffect, useState } from "react";
import { api } from "../../api";
import Hint from "../../components/Hint";

export default function CookOrders() {
  const [data, setData] = useState({ orders: [], earnings: 0 });

  async function load() {
    setData(await api("/api/orders/cook"));
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    await api(`/api/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  }

  return (
    <div>
      <h1 className="page-title">Incoming orders</h1>
      <p className="text-sm text-ink/60">Accepted + completed earnings: ₹{data.earnings}</p>
      <div className="mt-5 space-y-3">
        {data.orders.map((order) => (
          <div key={order._id} className="card">
            <div className="flex flex-wrap justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">{order.customer?.name}</p>
                <p className="wrap-anywhere text-sm text-ink/60">
                  ₹{order.totalAmount} · {order.items.map((i) => i.name).join(", ")}
                </p>
                <p className="text-xs text-ink/50">{order.deliveryAddress}</p>
                <span className="badge mt-2 bg-sand">{order.status}</span>
              </div>
              {order.status === "pending" && (
                <div className="flex w-full gap-2 sm:w-auto">
                  <Hint text="Accept this order so you can prepare and deliver the tiffin.">
                    <button className="btn-primary flex-1 sm:flex-none" type="button" onClick={() => setStatus(order._id, "accepted")}>
                      Accept
                    </button>
                  </Hint>
                  <Hint text="Decline this order. The customer will be notified.">
                    <button className="btn-ghost flex-1 sm:flex-none" type="button" onClick={() => setStatus(order._id, "rejected")}>
                      Reject
                    </button>
                  </Hint>
                </div>
              )}
              {order.status === "accepted" && (
                <Hint text="Mark the order as delivered so the customer can leave a review.">
                  <button className="btn-sage w-full sm:w-auto" type="button" onClick={() => setStatus(order._id, "completed")}>
                    Mark completed
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
