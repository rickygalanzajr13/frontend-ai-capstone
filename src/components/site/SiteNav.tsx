import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth";
import { SprocktdMark } from "./SprocktdMark";


const links = [
  { label: "Home", to: "/" as const },
  { label: "Collections", to: "/collections" as const },
  { label: "Watchlist", to: "/watchlist" as const },
  { label: "Profile", to: "/profile" as const },
];

export function SiteNav() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4 sm:px-8 lg:py-5">
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
          <SprocktdMark
            title="Sprocktd"
            className="h-7 w-7 shrink-0 text-foreground"
          />
          <span className="truncate font-display text-[1.05rem] font-normal tracking-tight">
            Sprocktd
          </span>
        </Link>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = query.trim();
            if (q) navigate({ to: "/search", search: { q } });
          }}
          className="relative ml-auto hidden w-full max-w-xs sm:block lg:ml-6 lg:mr-auto"
        >
          <label htmlFor="site-search" className="sr-only">
            Search films, themes, collections
          </label>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            id="site-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search films, themes…"
            className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 sm:ml-0 sm:gap-6">
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    activeProps={{ className: "text-foreground" }}
                    activeOptions={{ exact: l.to === "/" }}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {loading ? (
            <div
              aria-hidden
              className="h-9 w-24 shrink-0 animate-pulse rounded-md bg-surface"
            />
          ) : user ? (
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
                className="shrink-0 rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-surface"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className="shrink-0 rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-surface"
            >
              Sign In
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}
