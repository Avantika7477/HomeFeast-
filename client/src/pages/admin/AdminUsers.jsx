import { useEffect, useState } from "react";
import { api } from "../../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  async function load() {
    const data = await api("/api/admin/users");
    setUsers(data.users);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl">Users</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/50">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>City</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-ink/5">
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.city}</td>
                <td>
                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={async () => {
                      await api(`/api/admin/users/${u._id}`, { method: "DELETE" });
                      load();
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
