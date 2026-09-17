import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import Hint from "../components/Hint";

const empty = {
  q: "",
  city: "",
  cuisine: "",
  mealType: "",
  mealPlan: "",
  maxPrice: "",
  lat: "",
  lng: "",
  radiusKm: "10",
};

export default function Browse() {
  const { user } = useAuth();
  const [filters, setFilters] = useState(empty);
  const [cooks, setCooks] = useState([]);
  const [error, setError] = useState("");
  const [geoBusy, setGeoBusy] = useState(false);
  const [geoMode, setGeoMode] = useState(false);

  async function load(next = filters) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v !== "" && v != null) params.set(k, v);
    });
    try {
      const data = await api(`/api/cooks?${params.toString()}`);
      setCooks(data.cooks);
      setError("");
      setGeoMode(Boolean(data.geo));
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

  function clearGeo() {
    const next = { ...filters, lat: "", lng: "" };
    setFilters(next);
    setGeoMode(false);
    load(next);
  }

  function nearMe() {
    if (!navigator.geolocation) {
      setError("This browser does not support location.");
      return;
    }
    setGeoBusy(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          ...filters,
          city: "",
          lat: String(pos.coords.latitude),
          lng: String(pos.coords.longitude),
          radiusKm: filters.radiusKm || "10",
        };
        setFilters(next);
        setGeoBusy(false);
        load(next);
      },
      (err) => {
        setGeoBusy(false);
        setError(err.message || "Location permission denied. Allow location or search by city.");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  return (
    <div>
      <h1 className="page-title">Find a home cook</h1>
      <p className="page-subtitle">
        Search by city, or use <strong>Near me</strong> for cooks within a km radius of your phone/PC
        (simple GPS — no map).
        {user?.city && !geoMode ? ` City filter starts as ${user.city}.` : ""}
      </p>
      <form
        className="card mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <input className="input" placeholder="Search kitchen or cook" value={filters.q} onChange={(e) => set("q", e.target.value)} />
        <input
          className="input"
          placeholder="City"
          value={filters.city}
          onChange={(e) => set("city", e.target.value)}
          disabled={geoMode}
        />
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
        <select className="input" value={filters.radiusKm} onChange={(e) => set("radiusKm", e.target.value)}>
          <option value="5">Radius 5 km</option>
          <option value="10">Radius 10 km</option>
          <option value="20">Radius 20 km</option>
          <option value="50">Radius 50 km</option>
        </select>
        <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row lg:col-span-2">
          <Hint text="Use your device GPS to list cooks within the selected radius.">
            <button className="btn-sage w-full sm:w-auto" type="button" onClick={nearMe} disabled={geoBusy}>
              {geoBusy ? "Locating…" : "Near me"}
            </button>
          </Hint>
          {geoMode && (
            <Hint text="Turn off GPS search and go back to city / text filters.">
              <button className="btn-ghost w-full sm:w-auto" type="button" onClick={clearGeo}>
                Clear Near me
              </button>
            </Hint>
          )}
          <Hint text="Update the cook list using the filters you entered.">
            <button className="btn-primary w-full sm:flex-1" type="submit">
              Apply filters
            </button>
          </Hint>
        </div>
      </form>
      {geoMode && (
        <p className="mt-3 text-sm text-sage">
          Showing cooks within {filters.radiusKm || 10} km of your location
          {cooks.some((c) => c.distanceKm != null) ? " (closest first)." : "."}
        </p>
      )}
      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
        {cooks.map((cook) => (
          <Link key={cook._id} to={`/cooks/${cook._id}`} className="card transition hover:-translate-y-0.5 hover:border-clay/25 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-xl tracking-tight">{cook.kitchenName}</h2>
                <p className="mt-0.5 wrap-anywhere text-sm text-ink/55">
                  {cook.city} · {(cook.cuisines || []).join(", ")}
                  {cook.distanceKm != null ? ` · ${cook.distanceKm} km` : ""}
                </p>
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
      {!cooks.length && (
        <p className="mt-8 text-sm text-ink/50">
          {geoMode
            ? "No cooks with a saved GPS pin are within this radius. Try a larger radius, or search by city."
            : "No approved cooks match these filters."}
        </p>
      )}
    </div>
  );
}
