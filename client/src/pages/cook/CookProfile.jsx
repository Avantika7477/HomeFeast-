import { useEffect, useState } from "react";
import { api } from "../../api";
import Hint from "../../components/Hint";

export default function CookProfilePage() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [locBusy, setLocBusy] = useState(false);

  useEffect(() => {
    api("/api/cooks/me").then((d) => {
      const p = d.profile;
      const coords = p.location?.coordinates;
      setForm({
        kitchenName: p.kitchenName,
        bio: p.bio,
        city: p.city,
        serviceAreas: (p.serviceAreas || []).join(", "),
        cuisines: (p.cuisines || []).join(", "),
        deliveryStart: p.deliveryStart,
        deliveryEnd: p.deliveryEnd,
        lat: coords?.[1] ?? "",
        lng: coords?.[0] ?? "",
      });
    });
  }, []);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setMessage("This browser does not support location.");
      return;
    }
    setLocBusy(true);
    setMessage("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        }));
        setLocBusy(false);
        setMessage("Location captured. Click Save to store it.");
      },
      (err) => {
        setLocBusy(false);
        setMessage(err.message || "Could not read your location. Allow location permission and try again.");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  async function save(e) {
    e.preventDefault();
    const payload = {
      kitchenName: form.kitchenName,
      bio: form.bio,
      city: form.city,
      serviceAreas: form.serviceAreas.split(",").map((s) => s.trim()).filter(Boolean),
      cuisines: form.cuisines.split(",").map((s) => s.trim()).filter(Boolean),
      deliveryStart: form.deliveryStart,
      deliveryEnd: form.deliveryEnd,
    };
    if (form.lat !== "" && form.lng !== "") {
      payload.lat = Number(form.lat);
      payload.lng = Number(form.lng);
    } else {
      payload.clearLocation = true;
    }
    const data = await api("/api/cooks/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    const coords = data.profile.location?.coordinates;
    setForm((f) => ({
      ...f,
      lat: coords?.[1] ?? "",
      lng: coords?.[0] ?? "",
    }));
    setMessage("Profile saved.");
  }

  if (!form) return <p>Loading…</p>;

  const hasCoords = form.lat !== "" && form.lng !== "";

  return (
    <form className="card max-w-xl space-y-3" onSubmit={save}>
      <h1 className="page-title">Kitchen profile</h1>
      <input className="input" value={form.kitchenName} onChange={(e) => set("kitchenName", e.target.value)} />
      <textarea className="input min-h-24" value={form.bio} onChange={(e) => set("bio", e.target.value)} />
      <input className="input" placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
      <input
        className="input"
        placeholder="Service areas (comma separated)"
        value={form.serviceAreas}
        onChange={(e) => set("serviceAreas", e.target.value)}
      />
      <input
        className="input"
        placeholder="Cuisines"
        value={form.cuisines}
        onChange={(e) => set("cuisines", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <input className="input" type="time" value={form.deliveryStart} onChange={(e) => set("deliveryStart", e.target.value)} />
        <input className="input" type="time" value={form.deliveryEnd} onChange={(e) => set("deliveryEnd", e.target.value)} />
      </div>

      <div className="rounded-2xl border border-ink/10 bg-sand/40 p-3 space-y-2">
        <p className="text-sm font-semibold text-ink/70">Kitchen location (for Near me)</p>
        <p className="text-xs text-ink/50">
          Customers can find you within a km radius. No map API — we only store your coordinates.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="input"
            type="number"
            step="any"
            placeholder="Latitude"
            value={form.lat}
            onChange={(e) => set("lat", e.target.value)}
          />
          <input
            className="input"
            type="number"
            step="any"
            placeholder="Longitude"
            value={form.lng}
            onChange={(e) => set("lng", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Hint text="Ask the browser for your current GPS position and fill lat/lng.">
            <button className="btn-ghost w-full sm:w-auto" type="button" onClick={useMyLocation} disabled={locBusy}>
              {locBusy ? "Getting location…" : "Use my location"}
            </button>
          </Hint>
          {hasCoords && (
            <Hint text="Remove saved coordinates so you only appear in city search.">
              <button
                className="btn-ghost w-full sm:w-auto"
                type="button"
                onClick={() => setForm((f) => ({ ...f, lat: "", lng: "" }))}
              >
                Clear location
              </button>
            </Hint>
          )}
        </div>
        {hasCoords && (
          <p className="text-xs text-sage">
            Saved pin: {Number(form.lat).toFixed(4)}, {Number(form.lng).toFixed(4)}
          </p>
        )}
      </div>

      <Hint text="Update your kitchen name, city, service areas, delivery hours, and GPS pin.">
        <button className="btn-primary w-full sm:w-auto" type="submit">
          Save
        </button>
      </Hint>
      {message && <p className="text-sm text-sage">{message}</p>}
    </form>
  );
}
