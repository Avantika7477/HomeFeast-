import { Link } from "react-router-dom";
import { useAuth, homeFor } from "../context/AuthContext";
import Hint from "../components/Hint";

const steps = [
  {
    num: "01",
    title: "Sign up free",
    text: "Create a customer account in under a minute, or register as a home cook.",
  },
  {
    num: "02",
    title: "Find a cook nearby",
    text: "Search by city, veg/non-veg, cuisine, price, and daily or monthly plans.",
  },
  {
    num: "03",
    title: "Order or subscribe",
    text: "Pick dishes for today or choose a tiffin plan that fits your routine.",
  },
  {
    num: "04",
    title: "Enjoy home food",
    text: "The cook accepts your request. Pay in cash when your meal arrives.",
  },
];

const audiences = [
  { title: "Students", text: "Affordable, hygienic meals away from home." },
  { title: "Working professionals", text: "Skip expensive restaurant food every day." },
  { title: "Elderly & families", text: "Simple, home-style food you can trust." },
  { title: "Home cooks", text: "Grow your kitchen business with zero listing fees." },
];

const perks = [
  "Verified home cooks",
  "Daily · weekly · monthly plans",
  "Transparent menus & prices",
  "Cash on delivery",
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-ink/[0.07] bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="shrink-0 font-display text-xl tracking-tight text-clay sm:text-2xl">
            HomeFeast
          </Link>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <a href="#how-it-works" className="nav-chip">
              How it works
            </a>
            <a href="#for-you" className="nav-chip">
              Who it&apos;s for
            </a>
            <Link to="/browse" className="nav-chip">
              Browse cooks
            </Link>
          </nav>
          <div className="flex gap-2">
            {user ? (
              <Hint text="Open your customer, cook, or admin dashboard.">
                <Link className="btn-primary px-3 sm:px-5" to={homeFor(user.role)}>
                  My dashboard
                </Link>
              </Hint>
            ) : (
              <>
                <Hint text="Sign in with your existing HomeFeast account.">
                  <Link className="btn-ghost hidden px-3 sm:inline-flex sm:px-5" to="/login">
                    Log in
                  </Link>
                </Hint>
                <Hint text="Create a free customer or home cook account.">
                  <Link className="btn-primary px-3 sm:px-5" to="/register">
                    Get started
                  </Link>
                </Hint>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-clay/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-sage/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <div className="flex flex-wrap gap-2">
              {perks.slice(0, 3).map((perk) => (
                <span key={perk} className="badge bg-white/80">
                  {perk}
                </span>
              ))}
            </div>

            <h1 className="mt-6 max-w-xl font-display text-4xl leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.15rem]">
              Homemade tiffin, delivered by people who cook like home.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-ink/70 sm:text-lg">
              HomeFeast connects you with verified home cooks for fresh, affordable meals — on a
              one-time order or a daily, weekly, or monthly plan.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Hint text="Browse verified home cooks near you and view menus.">
                <Link className="btn-primary w-full sm:w-auto" to="/browse">
                  Find tiffin near me
                </Link>
              </Hint>
              <Hint text="Register as a home cook and start receiving tiffin requests.">
                <Link className="btn-sage w-full sm:w-auto" to="/register">
                  I&apos;m a home cook
                </Link>
              </Hint>
            </div>

            {!user && (
              <p className="mt-4 text-sm text-ink/50">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-clay hover:underline">
                  Log in here
                </Link>
              </p>
            )}
          </div>

          {/* Quick-start card */}
          <div className="card border-clay/20 bg-gradient-to-br from-white to-sand/60 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-sage">Start today</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl">Your next meal is 4 steps away</h2>
            <ol className="mt-6 space-y-4">
              {steps.map((step) => (
                <li key={step.num} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clay/15 text-sm font-bold text-clay">
                    {step.num}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{step.title}</p>
                    <p className="mt-0.5 text-sm leading-6 text-ink/65">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Hint text={user ? "See approved cooks, menus, and meal plans." : "Create an account so you can order or list your kitchen."}>
              <Link className="btn-primary mt-8 w-full" to={user ? "/browse" : "/register"}>
                {user ? "Browse cooks now" : "Create free account"}
              </Link>
            </Hint>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-ink/[0.07] bg-white/50 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-sage">
            Simple process
          </p>
          <h2 className="mt-2 text-center font-display text-3xl sm:text-4xl">How HomeFeast works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-ink/65">
            No complicated apps or long calls. Discover cooks, choose a plan, and let them handle the
            rest.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.num} className="card text-center sm:text-left">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sage/15 text-sm font-bold text-sage">
                  {step.num}
                </span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section id="for-you" className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl sm:text-4xl">Made for everyone who misses home food</h2>
          <p className="mt-2 max-w-2xl text-ink/65">
            Whether you need lunch every day or want to share your cooking with the neighbourhood.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {audiences.map((item) => (
              <div key={item.title} className="card flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-clay/10 text-xl">
                  🍱
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink/65">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="border-t border-ink/[0.07] bg-sand/30 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Why people choose HomeFeast</h2>
              <ul className="mt-6 space-y-4">
                {[
                  "Cheaper than restaurant delivery, healthier than fast food.",
                  "See full menus, prices, and meal plans before you order.",
                  "Cooks are reviewed and approved by our admin team.",
                  "Flexible subscriptions — pause or cancel when you need to.",
                ].map((line) => (
                  <li key={line} className="flex gap-3 text-ink/75">
                    <span className="mt-1 text-sage">✓</span>
                    <span className="leading-6">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card bg-white p-6 sm:p-8">
              <p className="text-sm font-semibold text-clay">Ready to eat better?</p>
              <p className="mt-2 font-display text-2xl">Browse cooks in your city and start today.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Hint text="Open the cook list and filter by city, cuisine, or price.">
                  <Link className="btn-primary w-full sm:flex-1" to="/browse">
                    Browse cooks
                  </Link>
                </Hint>
                <Hint text="Create a free account as a customer or home cook.">
                  <Link className="btn-ghost w-full sm:flex-1" to="/register">
                    Sign up free
                  </Link>
                </Hint>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/[0.07] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-ink/45 sm:flex-row">
          <p className="font-display text-lg text-clay">HomeFeast</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/browse" className="hover:text-ink">
              Browse
            </Link>
            <Link to="/login" className="hover:text-ink">
              Log in
            </Link>
            <Link to="/register" className="hover:text-ink">
              Register
            </Link>
          </div>
          <p>Homemade tiffin, closer to home.</p>
        </div>
      </footer>
    </div>
  );
}
