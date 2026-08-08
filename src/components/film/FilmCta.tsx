import { Link } from "@tanstack/react-router";

export function FilmCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="relative overflow-hidden rounded-lg border border-border bg-surface px-6 py-14 text-center sm:px-10 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 aura" />
        <div className="relative">
          <p className="eyebrow">Keep exploring</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-normal text-balance sm:text-4xl">
            Looking for your next favorite film?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Search the archive by title, or follow a theme until it leads somewhere
            unexpected.
          </p>
          <Link
            to="/search"
            search={{ q: "" }}
            className="mt-8 inline-flex rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground transition-opacity duration-200 hover:opacity-90"
          >
            Search films
          </Link>
        </div>
      </div>
    </section>
  );
}
