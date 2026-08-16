import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef, type ReactNode } from "react";

import { FilmPoster } from "@/components/site/FilmPoster";
import { usePosters } from "@/hooks/use-posters";
import { collections, type MockMovie } from "@/lib/mock-data";
import type { OmdbFilm } from "@/lib/omdb.functions";

/**
 * Picks recommendations for the current film from the curated catalog:
 * collections whose title/tagline/description echo the film's genres rank first,
 * the current film is always excluded, and duplicates are removed.
 */
function recommendationsFor(film: OmdbFilm, limit = 6): MockMovie[] {
  const genres = (film.Genre ?? "")
    .split(",")
    .map((g) => g.trim().toLowerCase())
    .filter(Boolean);

  const ranked = [...collections].sort((a, b) => score(b) - score(a));

  function score(c: (typeof collections)[number]) {
    const haystack = `${c.title} ${c.tagline} ${c.description}`.toLowerCase();
    return genres.reduce((n, g) => (haystack.includes(g) ? n + 1 : n), 0);
  }

  const seen = new Set<string>([film.imdbID]);
  const picks: MockMovie[] = [];
  for (const collection of ranked) {
    for (const movie of collection.films) {
      if (seen.has(movie.imdbID)) continue;
      seen.add(movie.imdbID);
      picks.push({ ...movie, note: movie.note ?? collection.title });
      if (picks.length >= limit) return picks;
    }
  }
  return picks;
}

function ScrollButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/70 text-muted-foreground backdrop-blur transition-colors hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {children}
    </button>
  );
}

export function SimilarMovies({ film }: { film: OmdbFilm }) {
  const suggestions = recommendationsFor(film);
  const { films: hydrated, isLoading } = usePosters(suggestions);
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  }, []);

  if (!suggestions.length) return null;

  return (
    <section aria-labelledby="similar" className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="flex items-end justify-between gap-4">
        <h2 id="similar" className="font-display text-2xl font-normal sm:text-3xl">
          You May Also Like
        </h2>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <ScrollButton label="Scroll recommendations left" onClick={() => scrollBy(-1)}>
            <ChevronLeft aria-hidden className="h-4 w-4" />
          </ScrollButton>
          <ScrollButton label="Scroll recommendations right" onClick={() => scrollBy(1)}>
            <ChevronRight aria-hidden className="h-4 w-4" />
          </ScrollButton>
        </div>
      </div>
            <ul
        ref={trackRef}
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {(isLoading ? suggestions : hydrated).map((m) => (
          <li key={m.imdbID} className="min-w-[60%] snap-start sm:min-w-[32%] lg:min-w-[20%]">
            <Link
              to="/film/$id"
              params={{ id: m.imdbID }}
              className="group block h-full rounded-lg border border-border bg-surface p-4 transition-colors duration-200 hover:border-border-strong"
            >
              {isLoading ? (
                <div
                  aria-hidden
                  className="aspect-[2/3] w-full animate-pulse rounded-md border border-border bg-surface-raised"
                />
              ) : (
                <div className="overflow-hidden rounded-md">
                  <FilmPoster poster={m.Poster} title={m.Title} />
                </div>
              )}
              <h3 className="mt-3 line-clamp-2 font-display text-sm font-normal leading-snug">
                {m.Title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {m.note ? `${m.Year} · ${m.note}` : m.Year}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
