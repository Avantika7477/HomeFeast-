import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import Hint from "./Hint";

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
      <header className="sticky top-0 z-20 border-b border-ink/[0.07] bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to={user ? homeFor(user.role) : "/"} className="shrink-0 font-display text-xl tracking-tight text-clay">
            HomeFeast
          </Link>
          <nav className="hidden min-w-0 flex-1 justify-center gap-1 text-sm lg:flex">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin" || to === "/cook"}
                className={({ isActive }) => (isActive ? "nav-chip nav-chip-active" : "nav-chip")}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <NotificationBell />
            <span className="hidden max-w-[9rem] truncate text-sm text-ink/50 sm:inline">{user?.name}</span>
            <Hint text="Sign out of your HomeFeast account on this device.">
              <button type="button" className="btn-ghost px-3 sm:px-4" onClick={logout}>
                Log out
              </button>
            </Hint>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto px-4 pb-3 [scrollbar-width:none] lg:hidden">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin" || to === "/cook"}
              className={({ isActive }) => (isActive ? "nav-chip nav-chip-active" : "nav-chip")}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
