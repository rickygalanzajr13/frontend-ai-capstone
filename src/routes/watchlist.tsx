import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EmptyState, ErrorState } from "@/components/media/EmptyState";
import { FilmPoster } from "@/components/site/FilmPoster";
import { useAuth } from "@/hooks/use-auth";
import {
  getCurrentWatchlist,
  removeFromWatchlist,
  type WatchlistItem,
} from "@/lib/auth";

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
  const { user, loading: authLoading } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setWatchlist(await getCurrentWatchlist());
    } catch (err) {
      console.error("[watchlist] load failed:", err);
      setError("We couldn't load your watchlist just now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setWatchlist([]);
      setLoading(false);
      return;
    }
    void load();
  }, [authLoading, user, load]);

  async function handleRemove(imdbId: string) {
    setRemoving(imdbId);
    try {
      await removeFromWatchlist(imdbId);
      setWatchlist((prev) => prev.filter((f) => f.imdb_id !== imdbId));
    } catch (err) {
      console.error("[watchlist] remove failed:", err);
    } finally {
      setRemoving(null);
    }
  }

  const busy = authLoading || loading;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="min-w-0">
          <p className="eyebrow">Saved</p>
          <h1 className="mt-3 font-display text-4xl font-normal text-balance">
            Your Watchlist
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {busy
              ? "Loading your watchlist…"
              : !user
                ? "Sign in to view your watchlist."
                : `${watchlist.length} film${watchlist.length === 1 ? "" : "s"} waiting.`}
          </p>
        </div>

        <div className="mt-12">
          {busy ? (
            <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} aria-hidden className="animate-pulse">
                  <div className="aspect-[2/3] w-full rounded-lg border border-border bg-surface" />
                  <div className="mt-3 h-3 w-4/5 rounded bg-surface" />
                  <div className="mt-2 h-2.5 w-1/3 rounded bg-surface" />
                </li>
              ))}
            </ul>
          ) : !user ? (
            <EmptyState
              icon={<Bookmark aria-hidden className="h-5 w-5" />}
              title="Sign in to view your watchlist"
              description="Your saved films are tied to your account, so they follow you everywhere."
              action={
                <Link
                  to="/signin"
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Sign in
                </Link>
              }
            />
          ) : error ? (
            <ErrorState description={error} onRetry={() => void load()} />
          ) : watchlist.length ? (
            <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {watchlist.map((film) => (
                <li key={film.id}>
                  <Link
                    to="/film/$id"
                    params={{ id: film.imdb_id }}
                    className="group block focus-visible:outline-none"
                  >
                    <div className="overflow-hidden rounded-lg">
                      <FilmPoster
                        poster={film.poster ?? "N/A"}
                        title={film.title}
                        className="transition-transform duration-500 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
                      />
                    </div>
                    <h3 className="mt-3 line-clamp-2 font-display text-sm font-normal leading-snug text-foreground transition-colors group-hover:text-primary">
                      {film.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{film.year ?? ""}</p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleRemove(film.imdb_id)}
                    disabled={removing === film.imdb_id}
                    className="mt-3 w-full rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
                  >
                    {removing === film.imdb_id ? "Removing…" : "Remove from Watchlist"}
                  </button>
                </li>
              ))}
            </ul>
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
