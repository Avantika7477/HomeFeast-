import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import Hint from "../components/Hint";

export default function CookPublic() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [qty, setQty] = useState({});
  const [address, setAddress] = useState(user?.address || "");
  const [planType, setPlanType] = useState("weekly");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api(`/api/cooks/${id}`).then(setData).catch((err) => setMessage(err.message));
  }, [id]);

  if (!data) return <p className="text-sm text-ink/60">{message || "Loading…"}</p>;
  const { cook, menu, plans, reviews } = data;

  async function placeOrder() {
    const items = menu
      .filter((item) => qty[item._id] > 0)
      .map((item) => ({ menuItem: item._id, quantity: qty[item._id] }));
    if (!items.length) return setMessage("Pick at least one dish");
    try {
      await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({ cookId: cook._id, items, deliveryAddress: address }),
      });
      setMessage("Order requested. The cook will accept or reject it.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function subscribe() {
    try {
      await api("/api/subscriptions", {
        method: "POST",
        body: JSON.stringify({ cookId: cook._id, planType, deliveryAddress: address }),
      });
      setMessage(`${planType} subscription requested.`);
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="page-title">{cook.kitchenName}</h1>
        <p className="wrap-anywhere text-sm text-ink/60">
          {cook.city} · {cook.cuisines?.join(", ")} · {cook.ratingAvg} ★ ({cook.ratingCount} reviews)
        </p>
        <p className="mt-3 text-ink/80">{cook.bio}</p>
        <p className="mt-2 text-sm text-ink/60">
          Areas: {cook.serviceAreas?.join(", ")} · Delivery {cook.deliveryStart}–{cook.deliveryEnd}
        </p>
      </div>

      <section className="card">
        <h2 className="font-display text-2xl">Menu</h2>
        <div className="mt-4 space-y-3">
          {menu.map((item) => (
            <div key={item._id} className="flex flex-col items-start justify-between gap-3 border-b border-ink/5 pb-3 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <p className="font-semibold">{item.name}</p>
                <p className="wrap-anywhere text-sm text-ink/60">
                  {item.mealType} · ₹{item.price} · {item.description}
                </p>
              </div>
              {user?.role === "customer" && (
                <input
                  className="w-24"
                  type="number"
                  min="0"
                  value={qty[item._id] || 0}
                  onChange={(e) => setQty({ ...qty, [item._id]: Number(e.target.value) })}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="font-display text-2xl">Meal plans</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan._id} className="rounded-xl bg-sand p-4">
              <p className="font-semibold capitalize">{plan.type}</p>
              <p className="text-2xl">₹{plan.price}</p>
              <p className="text-sm text-ink/60">{plan.description}</p>
            </div>
          ))}
        </div>
      </section>

      {!user && (
        <p className="text-sm">
          <Link className="font-semibold text-clay" to="/login">
            Log in
          </Link>{" "}
          as a customer to request an order or subscription.
        </p>
      )}

      {user?.role === "customer" && (
        <section className="card space-y-3">
          <h2 className="font-display text-2xl">Place a request</h2>
          <input
            className="input"
            placeholder="Delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="grid gap-2 sm:flex sm:flex-wrap">
            <Hint text="Send a one-time tiffin order. Pay the cook in cash on delivery.">
              <button type="button" className="btn-primary w-full sm:w-auto" onClick={placeOrder}>
                Request order (cash)
              </button>
            </Hint>
            <select className="input w-full sm:w-auto" value={planType} onChange={(e) => setPlanType(e.target.value)}>
              {plans.map((p) => (
                <option key={p._id} value={p.type}>
                  {p.type}
                </option>
              ))}
            </select>
            <Hint text="Request a daily, weekly, or monthly meal plan from this cook.">
              <button type="button" className="btn-sage w-full sm:w-auto" onClick={subscribe} disabled={!plans.length}>
                Request subscription
              </button>
            </Hint>
          </div>
        </section>
      )}

      {message && <p className="text-sm text-sage">{message}</p>}

      <section>
        <h2 className="font-display text-2xl">Reviews</h2>
        <div className="mt-3 space-y-3">
          {reviews.map((review) => (
            <div key={review._id} className="card">
              <p className="font-semibold">
                {review.customer?.name} · {review.rating} ★
              </p>
              <p className="text-sm text-ink/70">{review.comment}</p>
            </div>
          ))}
          {!reviews.length && <p className="text-sm text-ink/50">No reviews yet.</p>}
        </div>
      </section>
    </div>
  );
}
