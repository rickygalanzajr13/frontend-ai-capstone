import { Link } from "@tanstack/react-router";
import { Play, Bookmark } from "lucide-react";

import { FilmPoster } from "@/components/site/FilmPoster";
import { BigSearch } from "./BigSearch";
import type { OmdbFilm } from "@/lib/omdb.functions";

export function HomeHero({ film }: { film: OmdbFilm | null }) {
  const hasPoster = Boolean(film?.Poster && film.Poster !== "N/A");
  const genres = (film?.Genre ?? "")
    .split(",")
    .map((g) => g.trim())
    .filter((g) => g && g !== "N/A")
    .slice(0, 3);

  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      {hasPoster && film ? (
        <div aria-hidden className="absolute inset-0">
          <img
            src={film.Poster}
            alt=""
            loading="eager"
            className="h-full w-full scale-110 object-cover opacity-20 blur-3xl"
          />
          <div className="absolute inset-0 veil" />
        </div>
      ) : (
        <div aria-hidden className="absolute inset-0 aura" />
      )}

      <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-20">
        <div className="rise mx-auto max-w-2xl text-center">
          <p className="eyebrow">Trending on Sprocktd</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] font-normal text-balance sm:text-5xl">
            Find the film you didn't know you were looking for.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            Search the archive, follow a theme, or let the companion read your mood.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <BigSearch />
          </div>
        </div>

        {film ? (
          <div className="mt-14 grid gap-8 rounded-2xl border border-border bg-surface/50 p-5 backdrop-blur-xl sm:grid-cols-[160px_minmax(0,1fr)] sm:p-7 lg:grid-cols-[200px_minmax(0,1fr)]">
            <div className="mx-auto w-36 sm:mx-0 sm:w-full">
              <FilmPoster
                poster={film.Poster}
                title={film.Title}
                className="shadow-[var(--shadow-soft)]"
              />
            </div>
            <div className="min-w-0 self-center">
              <p className="eyebrow">Featured this week</p>
              <h2 className="mt-3 font-display text-2xl font-normal text-balance sm:text-3xl">
                {film.Title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {[film.Year, film.Runtime, film.Rated]
                  .filter((v) => v && v !== "N/A")
                  .join(" · ")}
              </p>
              {genres.length ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <li
                      key={g}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
                    >
                      {g}
                    </li>
                  ))}
                </ul>
              ) : null}
              {film.Plot && film.Plot !== "N/A" ? (
                <p className="mt-4 line-clamp-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {film.Plot}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/film/$id"
                  params={{ id: film.imdbID }}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Play aria-hidden className="h-4 w-4" />
                  View film
                </Link>
                <Link
                  to="/watchlist"
                  className="inline-flex items-center gap-2 rounded-md border border-border-strong px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-surface"
                >
                  <Bookmark aria-hidden className="h-4 w-4" />
                  Add to Watchlist
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
