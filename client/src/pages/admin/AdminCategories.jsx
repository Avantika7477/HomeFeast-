import { useEffect, useState } from "react";
import { api } from "../../api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [kind, setKind] = useState("cuisine");

  async function load() {
    const data = await api("/api/categories");
    setCategories(data.categories);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e) {
    e.preventDefault();
    await api("/api/categories", { method: "POST", body: JSON.stringify({ name, kind }) });
    setName("");
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Categories & cuisines</h1>
      <form className="mt-4 flex flex-wrap gap-2" onSubmit={add}>
        <input className="input max-w-xs" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <select className="input w-auto" value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="cuisine">Cuisine</option>
          <option value="menu">Menu</option>
        </select>
        <button className="btn-primary" type="submit">
          Add
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c._id}
            type="button"
            className="badge bg-sand"
            onClick={async () => {
              await api(`/api/categories/${c._id}`, { method: "DELETE" });
              load();
            }}
          >
            {c.name} · {c.kind} ×
          </button>
        ))}
      </div>
    </div>
  );
}
