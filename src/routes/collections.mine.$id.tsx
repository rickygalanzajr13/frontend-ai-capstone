import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EmptyState } from "@/components/media/EmptyState";
import { FilmPoster } from "@/components/site/FilmPoster";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchCollection,
  fetchCollectionItems,
  removeFilmFromCollection,
  type CollectionItem,
  type UserCollection,
} from "@/lib/collections-data";

export const Route = createFileRoute("/collections/mine/$id")({
  head: () => ({
    meta: [
      { title: "Your Collection — Sprocktd" },
      {
        name: "description",
        content: "A collection you built yourself on Sprocktd — private to your account.",
      },
      { property: "og:title", content: "Your Collection — Sprocktd" },
      {
        property: "og:description",
        content: "Films you gathered into your own Sprocktd collection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyCollectionPage,
});

function MyCollectionPage() {
  const { id } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const [collection, setCollection] = useState<UserCollection | null>(null);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      try {
        const found = await fetchCollection(userId, id);
        setCollection(found);
        setItems(found ? await fetchCollectionItems(found.id) : []);
      } catch (err) {
        console.error("[collections] load failed:", err);
        setError("We couldn't load this collection.");
      } finally {
        setLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    void load(user.id);
  }, [authLoading, user, load]);

  async function remove(itemId: string) {
    if (!user) return;
    try {
      await removeFilmFromCollection(user.id, itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      console.error("[collections] remove failed:", err);
      setError("We couldn't remove that film.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <Link
          to="/collections"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← All collections
        </Link>

        {authLoading || loading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
        ) : !user ? (
          <div className="mt-10">
            <EmptyState
              title="Sign in to view this collection"
              description="Collections are private to the account that created them."
              action={
                <Link
                  to="/signin"
                  className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Sign in
                </Link>
              }
            />
          </div>
        ) : !collection ? (
          <div className="mt-10">
            <EmptyState
              title="Collection not found"
              description="It may have been deleted, or it belongs to another account."
            />
          </div>
        ) : (
          <>
            <p className="eyebrow mt-8">Your collection</p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-normal text-balance">
              {collection.title}
            </h1>
            {collection.description ? (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {collection.description}
              </p>
            ) : null}
            <p className="mt-3 text-xs text-muted-foreground">{items.length} films</p>

            {error ? (
              <p role="alert" className="mt-4 text-xs text-destructive">
                {error}
              </p>
            ) : null}

            {items.length === 0 ? (
              <div className="mt-12">
                <EmptyState
                  title="No films yet"
                  description="Open any film page and use “Add to Collection”."
                />
              </div>
            ) : (
              <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {items.map((item) => (
                  <li key={item.id} className="min-w-0">
                    <Link to="/film/$id" params={{ id: item.imdb_id }} className="block">
                      <FilmPoster
                        poster={item.poster ?? "N/A"}
                        title={item.title ?? item.imdb_id}
                      />
                      <p className="mt-2 truncate text-sm">{item.title ?? item.imdb_id}</p>
                      <p className="text-xs text-muted-foreground">{item.year}</p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="mt-2 text-xs text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
