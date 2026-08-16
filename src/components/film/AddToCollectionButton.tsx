import { useEffect, useRef, useState } from "react";
import { FolderPlus } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import type { OmdbFilm } from "@/lib/omdb.functions";
import {
  addFilmToCollection,
  fetchCollectionIdsForFilm,
  fetchMyCollections,
  type UserCollection,
} from "@/lib/collections-data";
import { cn } from "@/lib/utils";

/** Adds the current film to one of the signed-in user's collections. */
export function AddToCollectionButton({
  film,
  iconOnly = false,
}: {
  film: OmdbFilm;
  iconOnly?: boolean;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !open) return;
    let active = true;
    void Promise.all([
      fetchMyCollections(user.id),
      fetchCollectionIdsForFilm(user.id, film.imdbID),
    ])
      .then(([rows, ids]) => {
        if (!active) return;
        setCollections(rows);
        setSaved(ids);
      })
      .catch((err) => {
        console.error("[collections] load failed:", err);
        if (active) setMessage("We couldn't load your collections.");
      });
    return () => {
      active = false;
    };
  }, [user, open, film.imdbID]);

  async function add(collectionId: string) {
    if (!user) return;
    setBusy(collectionId);
    setMessage(null);
    try {
      await addFilmToCollection(user.id, collectionId, {
        imdbID: film.imdbID,
        Title: film.Title,
        Poster: film.Poster,
        Year: film.Year,
      });
      setSaved((prev) => new Set(prev).add(collectionId));
      setMessage("Added to your collection.");
    } catch (err) {
      console.error("[collections] add failed:", err);
      setMessage("We couldn't add that film. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Add to Collection"
        onClick={() => {
          if (!user) {
            setMessage("Sign in to save films to a collection.");
            return;
          }
          setOpen((v) => !v);
        }}
        className={cn(
          "rounded-md border border-border-strong text-foreground transition-colors hover:bg-surface",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          iconOnly
            ? "grid h-[42px] w-[42px] place-items-center"
            : "px-5 py-2.5 text-sm",
        )}
      >
        {iconOnly ? (
          <FolderPlus aria-hidden className="h-4.5 w-4.5" strokeWidth={1.75} />
        ) : (
          "Add to Collection"
        )}
      </button>

      {open && user ? (
        <div
          ref={panelRef}
          className="absolute left-0 z-20 mt-2 w-72 rounded-lg border border-border bg-background p-3 shadow-[var(--shadow-soft)]"
        >
          {collections.length === 0 ? (
            <p className="p-2 text-xs text-muted-foreground">
              No collections yet. Create one on the Collections page.
            </p>
          ) : (
            <ul className="max-h-64 space-y-1 overflow-y-auto">
              {collections.map((c) => {
                const inList = saved.has(c.id);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      disabled={inList || busy === c.id}
                      onClick={() => add(c.id)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-surface disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="truncate">{c.title}</span>
                      <span className="ml-3 shrink-0 text-xs text-muted-foreground">
                        {inList ? "Added" : busy === c.id ? "Saving…" : "Add"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}

      {message ? (
        <p role="status" className="mt-2 text-xs text-muted-foreground">
          {message}
        </p>
      ) : null}
    </div>
  );
}
