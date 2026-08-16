import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { EmptyState } from "@/components/media/EmptyState";
import { CreateCollectionForm } from "./CreateCollectionForm";
import { useAuth } from "@/hooks/use-auth";
import {
  createCollection,
  deleteCollection,
  fetchCollectionItemCounts,
  fetchMyCollections,
  type UserCollection,
} from "@/lib/collections-data";

/** Signed-in user's own collections: create, browse, delete. */
export function MyCollections() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<UserCollection[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchMyCollections(userId);
      setItems(rows);
      setCounts(await fetchCollectionItemCounts(rows.map((r) => r.id)));
    } catch (err) {
      console.error("[collections] load failed:", err);
      setError("We couldn't load your collections just now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    void load(user.id);
  }, [authLoading, user, load]);

  async function handleCreate(values: { title: string; description: string }) {
    if (!user) return;
    await createCollection(user.id, values);
    await load(user.id);
  }

  async function handleDelete(id: string) {
    if (!user) return;
    try {
      await deleteCollection(user.id, id);
      await load(user.id);
    } catch (err) {
      console.error("[collections] delete failed:", err);
      setError("We couldn't delete that collection.");
    }
  }

  return (
    <section aria-labelledby="your-collections" className="mt-14">
      <p className="eyebrow">Your collections</p>
      <h2 id="your-collections" className="mt-3 font-display text-2xl font-normal">
        Shelves you build yourself.
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Private to your account. Add films from any film page.
      </p>

      {authLoading ? null : !user ? (
        <div className="mt-6">
          <EmptyState
            title="Sign in to build collections"
            description="Your collections are saved to your account and visible only to you."
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
      ) : (
        <>
          <div className="mt-6">
            <CreateCollectionForm onCreate={handleCreate} />
          </div>

          {error ? (
            <p role="alert" className="mt-4 text-xs text-destructive">
              {error}
            </p>
          ) : null}

          {loading ? (
            <p className="mt-6 text-sm text-muted-foreground">Loading your collections…</p>
          ) : items.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No collections yet — create one above.
            </p>
          ) : (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <li
                  key={c.id}
                  className="flex h-full flex-col rounded-xl border border-border bg-surface/60 p-6"
                >
                  <p className="eyebrow">{counts[c.id] ?? 0} films</p>
                  <Link
                    to="/collections/mine/$id"
                    params={{ id: c.id }}
                    className="mt-3 font-display text-xl font-normal transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {c.title}
                  </Link>
                  {c.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {c.description}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="mt-auto pt-6 text-left text-xs text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Delete collection
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
