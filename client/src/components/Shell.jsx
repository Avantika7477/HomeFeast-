import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

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
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 py-3 sm:px-4">
          <Link to={user ? homeFor(user.role) : "/"} className="shrink-0 font-display text-xl text-clay">
            HomeFeast
          </Link>
          <nav className="hidden min-w-0 flex-1 justify-center gap-4 text-sm lg:flex">
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
          <div className="flex shrink-0 items-center gap-2 text-sm sm:gap-3">
            <NotificationBell />
            <span className="hidden text-ink/60 sm:inline">{user?.name}</span>
            <button type="button" className="btn-ghost px-3 sm:px-5" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto px-3 pb-3 text-sm [scrollbar-width:none] lg:hidden sm:px-4">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap ${isActive ? "font-semibold text-clay" : "text-ink/70"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
