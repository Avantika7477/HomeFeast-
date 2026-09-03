import { Link, Outlet } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import Hint from "./Hint";

export default function PublicLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-ink/[0.07] bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="shrink-0 font-display text-xl tracking-tight text-clay">
            HomeFeast
          </Link>
          <div className="flex min-w-0 items-center justify-end gap-2">
            {user && <NotificationBell />}
            <Hint text="Browse verified home cooks and their menus.">
              <Link className="btn-ghost hidden px-3 sm:inline-flex sm:px-4" to="/browse">
                Browse
              </Link>
            </Hint>
            {user ? (
              <>
                <Hint text="Open your role dashboard (customer, cook, or admin).">
                  <Link className="btn-primary px-3 sm:px-4" to={homeFor(user.role)}>
                    Dashboard
                  </Link>
                </Hint>
                <Hint text="Sign out of your HomeFeast account on this device.">
                  <button className="btn-ghost px-3 sm:px-4" type="button" onClick={logout}>
                    Log out
                  </button>
                </Hint>
              </>
            ) : (
              <>
                <Hint text="Sign in with your existing account.">
                  <Link className="btn-ghost px-3 sm:px-4" to="/login">
                    Log in
                  </Link>
                </Hint>
                <Hint text="Create a free customer or home cook account.">
                  <Link className="btn-primary px-3 sm:px-4" to="/register">
                    Register
                  </Link>
                </Hint>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
