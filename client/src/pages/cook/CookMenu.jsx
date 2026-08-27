import { useEffect, useState } from "react";
import { api } from "../../api";

const blankItem = { name: "", description: "", mealType: "veg", price: "", category: "Thali" };
const blankPlan = { type: "weekly", price: "", description: "", includedMeals: "Lunch" };

export default function CookMenu() {
  const [items, setItems] = useState([]);
  const [plans, setPlans] = useState([]);
  const [item, setItem] = useState(blankItem);
  const [plan, setPlan] = useState(blankPlan);

  async function load() {
    const data = await api("/api/menus/mine");
    setItems(data.items);
    setPlans(data.plans);
  }

  useEffect(() => {
    load();
  }, []);

  async function addItem(e) {
    e.preventDefault();
    await api("/api/menus/items", {
      method: "POST",
      body: JSON.stringify({ ...item, price: Number(item.price) }),
    });
    setItem(blankItem);
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
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h1 className="page-title">Menu</h1>
        <form className="card mt-4 space-y-2" onSubmit={addItem}>
          <input className="input" placeholder="Dish name" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} required />
          <input className="input" placeholder="Description" value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} />
          <select className="input" value={item.mealType} onChange={(e) => setItem({ ...item, mealType: e.target.value })}>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-veg</option>
          </select>
          <input className="input" type="number" placeholder="Price" value={item.price} onChange={(e) => setItem({ ...item, price: e.target.value })} required />
          <button className="btn-primary" type="submit">
            Add dish
          </button>
        </form>
        <div className="mt-4 space-y-2">
          {items.map((row) => (
            <div key={row._id} className="card flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <p className="font-semibold">{row.name}</p>
                <p className="text-sm text-ink/60">
                  {row.mealType} · ₹{row.price}
                </p>
              </div>
              <button
                className="btn-ghost w-full sm:w-auto"
                type="button"
                onClick={async () => {
                  await api(`/api/menus/items/${row._id}`, { method: "DELETE" });
                  load();
                }}
              >
                Remove
              </button>
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
          <button className="btn-sage" type="submit">
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
