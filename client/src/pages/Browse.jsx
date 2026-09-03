import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import Hint from "../components/Hint";

const empty = { q: "", city: "", cuisine: "", mealType: "", mealPlan: "", maxPrice: "" };

export default function Browse() {
  const { user } = useAuth();
  const [filters, setFilters] = useState(empty);
  const [cooks, setCooks] = useState([]);
  const [error, setError] = useState("");

  async function load(next = filters) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    try {
      const data = await api(`/api/cooks?${params.toString()}`);
      setCooks(data.cooks);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (user?.city) {
      const next = { ...empty, city: user.city };
      setFilters(next);
      load(next);
      return;
    }
    load();
  }, [user?.city]);

  function set(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  return (
    <div>
      <h1 className="page-title">Find a home cook</h1>
      <p className="page-subtitle">
        Browse cooks in your city and service area. {user?.city ? `Showing results near ${user.city}.` : "Enter your city to find nearby tiffin providers."}
      </p>
      <form
        className="card mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <input className="input" placeholder="Search kitchen or cook" value={filters.q} onChange={(e) => set("q", e.target.value)} />
        <input className="input" placeholder="City" value={filters.city} onChange={(e) => set("city", e.target.value)} />
        <input className="input" placeholder="Cuisine" value={filters.cuisine} onChange={(e) => set("cuisine", e.target.value)} />
        <select className="input" value={filters.mealType} onChange={(e) => set("mealType", e.target.value)}>
          <option value="">Meal type</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-veg</option>
        </select>
        <select className="input" value={filters.mealPlan} onChange={(e) => set("mealPlan", e.target.value)}>
          <option value="">Meal plan</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <input className="input" type="number" placeholder="Max price (₹)" value={filters.maxPrice} onChange={(e) => set("maxPrice", e.target.value)} />
        <Hint text="Update the cook list using the city, cuisine, meal type, plan, and price you entered.">
          <button className="btn-primary w-full sm:col-span-2 lg:col-span-3" type="submit">
            Apply filters
          </button>
        </Hint>
      </form>
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
        {cooks.map((cook) => (
          <Link key={cook._id} to={`/cooks/${cook._id}`} className="card transition hover:-translate-y-0.5 hover:border-clay/25 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-xl tracking-tight">{cook.kitchenName}</h2>
                <p className="mt-0.5 wrap-anywhere text-sm text-ink/55">{cook.city} · {(cook.cuisines || []).join(", ")}</p>
              </div>
              <span className="badge shrink-0">{cook.ratingAvg || "New"} ★</span>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/65">{cook.bio}</p>
            <p className="mt-3 text-xs text-ink/40">
              {cook.serviceAreas?.join(", ") || cook.city} · {cook.deliveryStart}–{cook.deliveryEnd}
            </p>
          </Link>
        ))}
      </div>
      {!cooks.length && <p className="mt-8 text-sm text-ink/50">No approved cooks match these filters.</p>}
    </div>
  );
}
