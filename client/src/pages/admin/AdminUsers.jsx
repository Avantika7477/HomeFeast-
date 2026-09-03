import { useEffect, useState } from "react";
import { api } from "../../api";
import Hint from "../../components/Hint";

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
      <h1 className="page-title">Users</h1>
      <div className="scroll-table mt-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              <th>Name</th>
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
                  <Hint text="Delete this user account from HomeFeast.">
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
                  </Hint>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
