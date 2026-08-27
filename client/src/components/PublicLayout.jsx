import { Link, Outlet } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";

export default function PublicLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <Link to="/" className="shrink-0 font-display text-xl text-clay">
            HomeFeast
          </Link>
          <div className="flex min-w-0 flex-1 flex-wrap justify-end gap-2">
            <Link className="btn-ghost px-3 sm:px-5" to="/browse">
              Browse
            </Link>
            {user?.role === "customer" && (
              <>
                <Link className="btn-ghost hidden sm:inline-flex" to="/orders">
                  Orders
                </Link>
                <Link className="btn-ghost hidden sm:inline-flex" to="/subscriptions">
                  Plans
                </Link>
              </>
            )}
            {user ? (
              <>
                <Link className="btn-primary px-3 sm:px-5" to={homeFor(user.role)}>
                  Dashboard
                </Link>
                <button className="btn-ghost px-3 sm:px-5" type="button" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link className="btn-ghost px-3 sm:px-5" to="/login">
                  Log in
                </Link>
                <Link className="btn-primary px-3 sm:px-5" to="/register">
                  Register
                </Link>
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
