import { Link } from "@tanstack/react-router";

import { FilmPoster } from "@/components/site/FilmPoster";

export type MovieCardData = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  note?: string;
};

export function MovieCard({
  film,
  className = "",
}: {
  film: MovieCardData;
  className?: string;
}) {
  return (
    <Link
      to="/film/$id"
      params={{ id: film.imdbID }}
      className={`group block focus-visible:outline-none ${className}`}
    >
      <div className="overflow-hidden rounded-lg">
        <FilmPoster
          poster={film.Poster}
          title={film.Title}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
        />
      </div>
      <h3 className="mt-3 line-clamp-2 font-display text-sm font-normal leading-snug text-foreground transition-colors group-hover:text-primary">
        {film.Title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{film.note ?? film.Year}</p>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="aspect-[2/3] w-full rounded-lg border border-border bg-surface" />
      <div className="mt-3 h-3 w-4/5 rounded bg-surface" />
      <div className="mt-2 h-2.5 w-1/3 rounded bg-surface" />
    </div>
  );
}
