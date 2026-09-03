import { Link, Outlet } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import Hint from "./Hint";

export default function PublicLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <Link to="/" className="shrink-0 font-display text-xl text-clay">
            HomeFeast
          </Link>
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
            {user && <NotificationBell />}
            <Hint text="Browse verified home cooks and their menus.">
              <Link className="btn-ghost px-3 sm:px-5" to="/browse">
                Browse
              </Link>
            </Hint>
            {user?.role === "customer" && (
              <>
                <Hint text="See your one-time tiffin orders and their status.">
                  <Link className="btn-ghost hidden sm:inline-flex" to="/orders">
                    Orders
                  </Link>
                </Hint>
                <Hint text="See your daily, weekly, or monthly meal plans.">
                  <Link className="btn-ghost hidden sm:inline-flex" to="/subscriptions">
                    Plans
                  </Link>
                </Hint>
              </>
            )}
            {user ? (
              <>
                <Hint text="Open your role dashboard (customer, cook, or admin).">
                  <Link className="btn-primary px-3 sm:px-5" to={homeFor(user.role)}>
                    Dashboard
                  </Link>
                </Hint>
                <Hint text="Sign out of your HomeFeast account on this device.">
                  <button className="btn-ghost px-3 sm:px-5" type="button" onClick={logout}>
                    Log out
                  </button>
                </Hint>
              </>
            ) : (
              <>
                <Hint text="Sign in with your existing account.">
                  <Link className="btn-ghost px-3 sm:px-5" to="/login">
                    Log in
                  </Link>
                </Hint>
                <Hint text="Create a free customer or home cook account.">
                  <Link className="btn-primary px-3 sm:px-5" to="/register">
                    Register
                  </Link>
                </Hint>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
