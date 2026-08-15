import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { addToFavorites, isFavorite, removeFromFavorites } from "@/lib/auth";
import type { OmdbFilm } from "@/lib/omdb.functions";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

/** Star toggle backed by the favorites table; DB is the source of truth. */
export function FavoriteButton({ film }: { film: OmdbFilm }) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!user) {
      setFavorited(false);
      return;
    }
    void isFavorite(film.imdbID).then(({ saved }) => {
      if (active) setFavorited(saved);
    });
    return () => {
      active = false;
    };
  }, [film.imdbID, user]);

  async function toggle() {
    setMessage(null);

    if (!user) {
      setMessage("Sign in to add films to your favorites.");
      return;
    }

    setBusy(true);
    try {
      if (favorited) {
        const { error } = await removeFromFavorites(film.imdbID);
        if (error) {
        console.error("[favorites] remove failed:", error);

        setMessage(
            error.message || "Could not remove from favorites. Try again.",
        );

        return;
        }
        setFavorited(false);
      } else {
        const { error } = await addToFavorites({
          imdbId: film.imdbID,
          title: film.Title,
          poster: film.Poster,
          year: film.Year,
        });
        if (error) {
        console.error("[favorites] add failed:", error);

        setMessage(
            error.message || "Could not add to favorites. Try again.",
        );

        return;
        }
        setFavorited(true);
      }
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
        aria-label={favorited ? "Remove from Favorites" : "Add to Favorites"}
        aria-pressed={favorited}
        className={cn(
          "grid h-[42px] w-[42px] place-items-center rounded-md border border-border-strong transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "hover:bg-surface disabled:opacity-60",
          favorited ? "text-rating" : "text-foreground",
        )}
      >
        <Star
          aria-hidden
          className={cn("h-4.5 w-4.5", busy && "animate-pulse")}
          strokeWidth={1.75}
          fill={favorited ? "currentColor" : "none"}
        />
      </button>
      {message ? (
        <p role="status" className="w-full text-xs text-muted-foreground">
          {message}
        </p>
      ) : null}
    </>
  );
}
