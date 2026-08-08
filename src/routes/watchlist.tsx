import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { useState } from "react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MovieGrid } from "@/components/media/MovieGrid";
import { EmptyState } from "@/components/media/EmptyState";
import { watchlistPlaceholder } from "@/lib/mock-data";

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Your Watchlist — Sprocktd" },
      {
        name: "description",
        content: "Everything you've saved for later, kept in one calm cinematic list on Sprocktd.",
      },
      { property: "og:title", content: "Your Watchlist — Sprocktd" },
      {
        property: "og:description",
        content: "Keep the films you mean to watch in one place on Sprocktd.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  // UI-only toggle — no persistence yet.
  const [showEmpty, setShowEmpty] = useState(false);
  const films = showEmpty ? [] : watchlistPlaceholder;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <p className="eyebrow">Saved</p>
            <h1 className="mt-3 font-display text-4xl font-normal text-balance">
              Your Watchlist
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {films.length} film{films.length === 1 ? "" : "s"} waiting. Placeholder data —
              saving isn't wired up yet.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowEmpty((v) => !v)}
            className="shrink-0 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {showEmpty ? "Show sample" : "Preview empty"}
          </button>
        </div>

        <div className="mt-12">
          {films.length ? (
            <MovieGrid films={films} />
          ) : (
            <EmptyState
              icon={<Bookmark aria-hidden className="h-5 w-5" />}
              title="Nothing saved yet"
              description="Films you save from the archive will collect here, ready for the next quiet evening."
              action={
                <Link
                  to="/collections"
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Browse collections
                </Link>
              }
            />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
