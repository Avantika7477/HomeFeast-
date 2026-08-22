import { Link, Outlet } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";

export default function PublicLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-display text-xl text-clay">
            HomeFeast
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Link className="btn-ghost" to="/browse">
              Browse
            </Link>
            {user?.role === "customer" && (
              <>
                <Link className="btn-ghost" to="/orders">
                  Orders
                </Link>
                <Link className="btn-ghost" to="/subscriptions">
                  Plans
                </Link>
              </>
            )}
            {user ? (
              <>
                <Link className="btn-primary" to={homeFor(user.role)}>
                  Dashboard
                </Link>
                <button className="btn-ghost" type="button" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link className="btn-ghost" to="/login">
                  Log in
                </Link>
                <Link className="btn-primary" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
