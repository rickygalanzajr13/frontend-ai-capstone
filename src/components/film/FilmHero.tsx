import type { ReactNode } from "react";

import { FilmPoster } from "@/components/site/FilmPoster";
import type { OmdbFilm } from "@/lib/omdb.functions";
import { FavoriteButton } from "./FavoriteButton";
import { ListToggleButton } from "./ListToggleButton";
import { AddToCollectionButton } from "./AddToCollectionButton";
import { FilmStory } from "./FilmStory";
import { MovieFacts } from "./MovieFacts";

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
      {children}
    </span>
  );
}

export function FilmHero({ film, sidebar }: { film: OmdbFilm; sidebar?: ReactNode }) {
  const hasPoster = film.Poster && film.Poster !== "N/A";
  const genres = (film.Genre ?? "")
    .split(",")
    .map((g) => g.trim())
    .filter((g) => g && g !== "N/A");

  return (
    <section className="relative overflow-hidden border-b border-border">
      {hasPoster ? (
        <div aria-hidden className="absolute inset-0">
          <img
            src={film.Poster}
            alt=""
            className="h-full w-full scale-110 object-cover opacity-25 blur-3xl"
          />
          <div className="absolute inset-0 veil" />
        </div>
      ) : (
        <div aria-hidden className="absolute inset-0 aura" />
      )}

      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          {/* Left column */}
          <div className="min-w-0">
            <div className="grid gap-8 sm:grid-cols-[200px_minmax(0,1fr)]">
              <div className="mx-auto w-40 sm:mx-0 sm:w-full">
                <FilmPoster
                  poster={film.Poster}
                  title={film.Title}
                  className="shadow-[var(--shadow-soft)]"
                />
              </div>

              <div className="min-w-0">
                <h1 className="font-display text-3xl font-normal text-balance sm:text-4xl">
                  {film.Title}
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  {[film.Year, film.Runtime, film.Rated]
                    .filter((v) => v && v !== "N/A")
                    .join(" · ")}
                </p>

                {genres.length ? (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {genres.map((g) => (
                      <li key={g}>
                        <Chip>{g}</Chip>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {film.imdbRating && film.imdbRating !== "N/A" ? (
                    <p className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-rating" />
                      <span className="text-muted-foreground">IMDb</span>
                      <span>{film.imdbRating}</span>
                    </p>
                  ) : null}
                  {film.Metascore && film.Metascore !== "N/A" ? (
                    <p className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />
                      <span className="text-muted-foreground">Metascore</span>
                      <span>{film.Metascore}</span>
                    </p>
                  ) : null}
                </div>

                <div className="mt-8 flex flex-wrap items-start gap-3">
                  <ListToggleButton
                    film={film}
                    kind="watchlist"
                    variant="primary"
                    iconOnly
                  />
                  <ListToggleButton film={film} kind="watched" iconOnly />
                  <FavoriteButton film={film} />
                  <AddToCollectionButton film={film} iconOnly />
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-10">
              <FilmStory film={film} />
              <MovieFacts film={film} />
            </div>
          </div>

          {/* Right column */}
          {sidebar ? <aside className="min-w-0 space-y-6">{sidebar}</aside> : null}
        </div>
      </div>
    </section>
  );
}
