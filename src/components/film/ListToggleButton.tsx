import { useEffect, useState } from "react";

import {
  addToWatched,
  addToWatchlist,
  isInWatchlist,
  isWatched,
  removeFromWatched,
  removeFromWatchlist,
} from "@/lib/auth";
import type { OmdbFilm } from "@/lib/omdb.functions";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type Kind = "watchlist" | "watched";

const COPY: Record<Kind, { add: string; remove: string; signedOut: string }> = {
  watchlist: {
    add: "Add to Watchlist",
    remove: "Remove from Watchlist",
    signedOut: "Sign in to save films to your watchlist.",
  },
  watched: {
    add: "Mark as Watched",
    remove: "Mark as Unwatched",
    signedOut: "Sign in to mark films as watched.",
  },
};

/** Toggle for the watchlist / watched tables; the database is the source of truth. */
export function ListToggleButton({
  film,
  kind,
  variant = "outline",
}: {
  film: OmdbFilm;
  kind: Kind;
  variant?: "primary" | "outline";
}) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const copy = COPY[kind];

  useEffect(() => {
    let active = true;
    if (!user) {
      setSaved(false);
      return;
    }

    const check =
      kind === "watchlist"
        ? isInWatchlist(film.imdbID).then((inList) => ({ saved: inList }))
        : isWatched(film.imdbID);

    void check
      .then(({ saved: next }) => {
        if (active) setSaved(next);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [film.imdbID, kind, user]);

  async function toggle() {
    setMessage(null);

    if (!user) {
      setMessage(copy.signedOut);
      return;
    }

    setBusy(true);
    try {
      if (saved) {
        if (kind === "watchlist") {
          await removeFromWatchlist(film.imdbID);
        } else {
          const { error } = await removeFromWatched(film.imdbID);
          if (error) throw error;
        }
        setSaved(false);
      } else {
        if (kind === "watchlist") {
          await addToWatchlist({
            imdbID: film.imdbID,
            Title: film.Title,
            Poster: film.Poster,
            Year: film.Year,
          });
        } else {
          const { error } = await addToWatched({
            imdbId: film.imdbID,
            title: film.Title,
            poster: film.Poster,
            year: film.Year,
          });
          if (error) throw error;
        }
        setSaved(true);
      }
    } catch (error) {
      console.error(`[${kind}] toggle failed:`, error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={saved}
        className={cn(
          "rounded-md px-5 py-2.5 text-sm transition-colors duration-200 disabled:opacity-60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          variant === "primary" && !saved
            ? "bg-primary text-primary-foreground hover:opacity-90"
            : "border border-border-strong text-foreground hover:bg-surface",
        )}
      >
        {busy ? "Saving…" : saved ? copy.remove : copy.add}
      </button>
      {message ? (
        <p role="status" className="w-full text-xs text-muted-foreground">
          {message}
        </p>
      ) : null}
    </>
  );
}
