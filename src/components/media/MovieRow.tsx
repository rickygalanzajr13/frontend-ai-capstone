import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef, type ReactNode } from "react";

import { MovieCard, MovieCardSkeleton, type MovieCardData } from "./MovieCard";
import { EmptyState, ErrorState } from "./EmptyState";

export function RowHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="mt-2 font-display text-2xl font-normal text-balance sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function MovieRow({
  eyebrow,
  title,
  description,
  action,
  films,
  isLoading = false,
  error = null,
  onRetry,
  emptyMessage = "Nothing here yet.",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  films: MovieCardData[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  }, []);

  return (
    <section aria-label={title} className="mx-auto max-w-6xl px-5 sm:px-8">
      <RowHeader
        {...(eyebrow ? { eyebrow } : {})}
        title={title}
        {...(description ? { description } : {})}
        action={
          <div className="flex items-center gap-2">
            {action}
            <div className="hidden gap-2 sm:flex">
              <RowButton label={`Scroll ${title} left`} onClick={() => scrollBy(-1)}>
                <ChevronLeft aria-hidden className="h-4 w-4" />
              </RowButton>
              <RowButton label={`Scroll ${title} right`} onClick={() => scrollBy(1)}>
                <ChevronRight aria-hidden className="h-4 w-4" />
              </RowButton>
            </div>
          </div>
        }
      />

      <div className="mt-7">
        {error ? (
          <ErrorState
            description={error}
            {...(onRetry ? { onRetry } : {})}
            title="This row didn't load"
          />
        ) : !isLoading && films.length === 0 ? (
          <EmptyState title="Nothing to show" description={emptyMessage} />
        ) : (
          <ul
            ref={trackRef}
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:gap-5 sm:px-8 [&::-webkit-scrollbar]:hidden"
          >
            {(isLoading ? Array.from({ length: 8 }) : films).map((film, i) => (
              <li
                key={isLoading ? i : (film as MovieCardData).imdbID + i}
                className="w-[42vw] shrink-0 snap-start sm:w-44 lg:w-48"
              >
                {isLoading ? (
                  <MovieCardSkeleton />
                ) : (
                  <MovieCard film={film as MovieCardData} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function RowButton({
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
      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/70 text-muted-foreground backdrop-blur transition-colors hover:border-border-strong hover:text-foreground"
    >
      {children}
    </button>
  );
}
