import { useEffect, useState } from "react";
import { api } from "../../api";

const blankItem = { name: "", description: "", mealType: "veg", price: "", category: "Thali", available: true };
const blankPlan = { type: "weekly", price: "", description: "", includedMeals: "Lunch" };

export default function CookMenu() {
  const [items, setItems] = useState([]);
  const [plans, setPlans] = useState([]);
  const [item, setItem] = useState(blankItem);
  const [plan, setPlan] = useState(blankPlan);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  async function load() {
    const data = await api("/api/menus/mine");
    setItems(data.items);
    setPlans(data.plans);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(row) {
    setEditingId(row._id);
    setItem({
      name: row.name,
      description: row.description || "",
      mealType: row.mealType,
      price: String(row.price),
      category: row.category || "Thali",
      available: row.available,
    });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setItem(blankItem);
  }

  async function saveItem(e) {
    e.preventDefault();
    const payload = { ...item, price: Number(item.price) };
    if (editingId) {
      await api(`/api/menus/items/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setMessage("Dish updated.");
    } else {
      await api("/api/menus/items", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setMessage("Dish added.");
    }
    cancelEdit();
    load();
  }

  async function toggleAvailability(row) {
    await api(`/api/menus/items/${row._id}`, {
      method: "PUT",
      body: JSON.stringify({ available: !row.available }),
    });
    load();
  }

  async function addPlan(e) {
    e.preventDefault();
    await api("/api/menus/plans", {
      method: "POST",
      body: JSON.stringify({ ...plan, price: Number(plan.price) }),
    });
    setPlan(blankPlan);
    load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h1 className="page-title">Menu</h1>
        <p className="page-subtitle">Add dishes, edit details, and mark items available or unavailable.</p>
        <form className="card mt-4 space-y-2" onSubmit={saveItem}>
          <p className="text-sm font-semibold text-ink/70">{editingId ? "Edit dish" : "Add new dish"}</p>
          <input className="input" placeholder="Dish name" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} required />
          <input className="input" placeholder="Description" value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} />
          <select className="input" value={item.mealType} onChange={(e) => setItem({ ...item, mealType: e.target.value })}>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-veg</option>
          </select>
          <input className="input" placeholder="Category" value={item.category} onChange={(e) => setItem({ ...item, category: e.target.value })} />
          <input className="input" type="number" placeholder="Price" value={item.price} onChange={(e) => setItem({ ...item, price: e.target.value })} required />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={item.available}
              onChange={(e) => setItem({ ...item, available: e.target.checked })}
            />
            Available for customers
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button className="btn-primary w-full sm:w-auto" type="submit">
              {editingId ? "Save changes" : "Add dish"}
            </button>
            {editingId && (
              <button className="btn-ghost w-full sm:w-auto" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
        {message && <p className="mt-2 text-sm text-sage">{message}</p>}
        <div className="mt-4 space-y-2">
          {items.map((row) => (
            <div key={row._id} className="card flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{row.name}</p>
                  <span className={`badge ${row.available ? "bg-sage/15 text-sage" : "bg-ink/10 text-ink/50"}`}>
                    {row.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="text-sm text-ink/60">
                  {row.mealType} · ₹{row.price} · {row.category}
                </p>
                {row.description && <p className="wrap-anywhere text-sm text-ink/50">{row.description}</p>}
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <button className="btn-ghost w-full sm:w-auto" type="button" onClick={() => toggleAvailability(row)}>
                  {row.available ? "Mark unavailable" : "Mark available"}
                </button>
                <button className="btn-ghost w-full sm:w-auto" type="button" onClick={() => startEdit(row)}>
                  Edit
                </button>
                <button
                  className="btn-ghost w-full sm:w-auto"
                  type="button"
                  onClick={async () => {
                    await api(`/api/menus/items/${row._id}`, { method: "DELETE" });
                    if (editingId === row._id) cancelEdit();
                    load();
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="page-title">Meal plans</h2>
        <form className="card mt-4 space-y-2" onSubmit={addPlan}>
          <select className="input" value={plan.type} onChange={(e) => setPlan({ ...plan, type: e.target.value })}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <input className="input" type="number" placeholder="Price" value={plan.price} onChange={(e) => setPlan({ ...plan, price: e.target.value })} required />
          <input className="input" placeholder="Description" value={plan.description} onChange={(e) => setPlan({ ...plan, description: e.target.value })} />
          <button className="btn-sage w-full sm:w-auto" type="submit">
            Save plan
          </button>
        </form>
        <div className="mt-4 space-y-2">
          {plans.map((row) => (
            <div key={row._id} className="card flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="capitalize">
                {row.type} · ₹{row.price}
              </p>
              <button
                className="btn-ghost w-full sm:w-auto"
                type="button"
                onClick={async () => {
                  await api(`/api/menus/plans/${row._id}`, { method: "DELETE" });
                  load();
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
