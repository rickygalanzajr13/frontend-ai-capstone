import { Link } from "@tanstack/react-router";

import { RowHeader } from "@/components/media/MovieRow";
import { collections } from "@/lib/mock-data";

export function FeaturedCollections({ limit = 4 }: { limit?: number }) {
  return (
    <section id="collections" className="mx-auto max-w-6xl px-5 sm:px-8">
      <RowHeader
        eyebrow="Curated"
        title="Featured Collections"
        description="Editorial shelves built around a single idea — not a genre tag."
        action={
          <Link
            to="/collections"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            All collections <span aria-hidden>→</span>
          </Link>
        }
      />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {collections.slice(0, limit).map((c) => (
          <li key={c.slug}>
            <Link
              to="/collections/$slug"
              params={{ slug: c.slug }}
              className="group flex h-full flex-col rounded-xl border border-border bg-surface/60 p-5 transition-colors hover:border-border-strong hover:bg-surface"
            >
              <p className="eyebrow">{c.films.length} films</p>
              <h3 className="mt-3 font-display text-lg font-normal transition-colors group-hover:text-primary">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.tagline}
              </p>
              <p className="mt-auto pt-5 text-xs text-muted-foreground">{c.curator}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
