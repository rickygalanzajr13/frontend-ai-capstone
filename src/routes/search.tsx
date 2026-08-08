import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MovieCard, MovieCardSkeleton } from "@/components/media/MovieCard";
import { EmptyState } from "@/components/media/EmptyState";
import { recentSearches, searchSuggestions } from "@/lib/mock-data";
import { searchFilms, type OmdbSearchItem } from "@/lib/omdb.functions";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: ({ deps }) => searchFilms({ data: { query: deps.q } }),
  head: () => ({
    meta: [
      { title: "Search the archive — Sprocktd" },
      {
        name: "description",
        content:
          "Search thousands of films by title and open each one for its story, cast, and themes inside the Sprocktd archive.",
      },
      { property: "og:title", content: "Search the archive — Sprocktd" },
      {
        property: "og:description",
        content: "Find films by title and explore their stories, themes, and connections on Sprocktd.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { results, total, error } = Route.useLoaderData();
  const navigate = useNavigate();

  const [value, setValue] = useState(q);
  const [pending, setPending] = useState(false);

  useEffect(() => setValue(q), [q]);

  // Debounced navigation — the route loader does the fetching.
  useEffect(() => {
    const next = value.trim();
    if (next === q) {
      setPending(false);
      return;
    }
    setPending(true);
    const t = window.setTimeout(() => {
      void navigate({ to: "/search", search: { q: next }, replace: true });
    }, 400);
    return () => window.clearTimeout(t);
  }, [value, q, navigate]);

  const suggestions = useMemo(() => {
    const term = value.trim().toLowerCase();
    if (!term) return [];
    return searchSuggestions
      .filter((s) => s.toLowerCase().includes(term) && s.toLowerCase() !== term)
      .slice(0, 5);
  }, [value]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="eyebrow">Search</p>
        <h1 className="mt-3 font-display text-3xl font-normal text-balance sm:text-4xl">
          {q ? `Results for “${q}”` : "Search the archive"}
        </h1>

        <div className="relative mt-8 max-w-2xl">
          <label htmlFor="archive-search" className="sr-only">
            Search films
          </label>
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="archive-search"
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search a title…"
            className="w-full rounded-full border border-border bg-surface/70 py-3.5 pl-12 pr-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
          {suggestions.length ? (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Suggestions">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => setValue(s)}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {!q ? (
          <div className="mt-8 max-w-2xl">
            <p className="eyebrow">Recent searches</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {recentSearches.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => setValue(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            {pending ? "Searching…" : error ? error : `${total} film${total === 1 ? "" : "s"} found.`}
          </p>
        )}

        <div className="mt-10">
          {pending ? (
            <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <li key={i}>
                  <MovieCardSkeleton />
                </li>
              ))}
            </ul>
          ) : q && results.length === 0 ? (
            <EmptyState
              icon={<SearchIcon aria-hidden className="h-5 w-5" />}
              title="No films matched"
              description="Try a shorter title, a different spelling, or one of the suggestions above."
            />
          ) : results.length ? (
            <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {results.map((film: OmdbSearchItem) => (
                <li key={film.imdbID}>
                  <MovieCard film={film} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
