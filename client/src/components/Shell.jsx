import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";

const customerLinks = [
  ["Browse cooks", "/browse"],
  ["Orders", "/orders"],
  ["Subscriptions", "/subscriptions"],
  ["Complaints", "/complaints"],
];

const cookLinks = [
  ["Dashboard", "/cook"],
  ["Profile", "/cook/profile"],
  ["Menu", "/cook/menu"],
  ["Orders", "/cook/orders"],
  ["Subscriptions", "/cook/subscriptions"],
];

const adminLinks = [
  ["Overview", "/admin"],
  ["Users", "/admin/users"],
  ["Cooks", "/admin/cooks"],
  ["Orders", "/admin/orders"],
  ["Subscriptions", "/admin/subscriptions"],
  ["Categories", "/admin/categories"],
  ["Complaints", "/admin/complaints"],
];

export default function Shell() {
  const { user, logout } = useAuth();
  const links =
    user?.role === "admin" ? adminLinks : user?.role === "cook" ? cookLinks : customerLinks;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to={user ? homeFor(user.role) : "/"} className="font-display text-xl text-clay">
            HomeFeast
          </Link>
          <nav className="hidden gap-4 text-sm md:flex">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin" || to === "/cook"}
                className={({ isActive }) =>
                  isActive ? "font-semibold text-clay" : "text-ink/70 hover:text-ink"
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink/60 sm:inline">{user?.name}</span>
            <button type="button" className="btn-ghost" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-3 text-sm md:hidden">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} className="whitespace-nowrap text-ink/70">
              {label}
            </NavLink>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
