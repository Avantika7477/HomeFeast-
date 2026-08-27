import { Link } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-4 sm:px-4 sm:py-5">
        <span className="shrink-0 font-display text-xl text-clay sm:text-2xl">HomeFeast</span>
        <div className="flex gap-2">
          {user ? (
            <Link className="btn-primary px-3 sm:px-5" to={homeFor(user.role)}>
              Go to app
            </Link>
          ) : (
            <>
              <Link className="btn-ghost px-3 sm:px-5" to="/login">
                Log in
              </Link>
              <Link className="btn-primary px-3 sm:px-5" to="/register">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-8 px-3 py-10 sm:gap-10 sm:px-4 sm:py-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-sage">Homemade tiffin</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl leading-[1.08] sm:text-5xl">
            Fresh home food, without the restaurant bill.
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-ink/70">
            Find verified home cooks near you. Subscribe daily, weekly, or monthly. Built for
            students, working professionals, and anyone who misses a home kitchen.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary w-full sm:w-auto" to="/browse">
              Browse cooks
            </Link>
            <Link className="btn-sage w-full sm:w-auto" to="/register">
              Join as a cook
            </Link>
          </div>
        </div>
        <div className="card bg-sand">
          <h2 className="font-display text-2xl">How it works</h2>
          <ol className="mt-4 space-y-3 text-sm text-ink/80">
            <li>1. Register as a customer or home cook.</li>
            <li>2. Search by city, veg/non-veg, cuisine, and meal plan.</li>
            <li>3. Place a one-time order or subscribe.</li>
            <li>4. The cook accepts. Pay in cash when the tiffin arrives.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
