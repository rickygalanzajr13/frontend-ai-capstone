import { supabase } from "@/lib/supabase";
import type { MockMovie } from "@/lib/mock-data";

export type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string | null;
};

export type FilmRow = {
  imdb_id: string;
  title: string | null;
  poster: string | null;
  year: string | null;
};

/** DB row -> the shape MovieGrid / MovieCard expects. */
export function toMovie(row: FilmRow, note?: string): MockMovie {
  return {
    imdbID: row.imdb_id,
    Title: row.title ?? row.imdb_id,
    Year: row.year ?? "",
    Poster: row.poster ?? "N/A",
    ...(note ? { note } : {}),
  };
}

async function count(table: string, userId: string) {
  const { count: n, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) throw error;
  return n ?? 0;
}

/** Optional datasets must not take the whole page down. */
async function safe<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (err) {
    console.error(`[profile] ${label} failed:`, err);
    return fallback;
  }
}

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, created_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as ProfileRow | null) ?? null;
}

export async function fetchProfileData(userId: string) {
  const [
    profile,
    favorites,
    recentlyViewed,
    watchedFilms,
    watchlistCount,
    watchedCount,
    collectionsCount,
  ] = await Promise.all([
    safe("profiles", () => fetchProfile(userId), null as ProfileRow | null),
    safe(
      "favorites",
      async () => {
        const { data, error } = await supabase
          .from("favorites")
          .select("imdb_id, title, poster, year")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(12);
        if (error) throw error;
        return (data ?? []) as FilmRow[];
      },
      [] as FilmRow[],
    ),
    safe(
      "recently_viewed",
      async () => {
        const { data, error } = await supabase
          .from("recently_viewed")
          .select("imdb_id, title, poster, year")
          .eq("user_id", userId)
          .order("viewed_at", { ascending: false })
          .limit(12);
        if (error) throw error;
        return (data ?? []) as FilmRow[];
      },
      [] as FilmRow[],
    ),
    safe(
      "watched films",
      async () => {
        const { data, error } = await supabase
          .from("watched")
          .select("imdb_id, title, poster, year")
          .eq("user_id", userId)
          .limit(50);
        if (error) throw error;
        return (data ?? []) as FilmRow[];
      },
      [] as FilmRow[],
    ),
    safe("watchlist count", () => count("watchlist", userId), 0),
    safe("watched count", () => count("watched", userId), 0),
    safe("collections count", () => count("collections", userId), 0),
  ]);

  const recentlyViewedCount = await safe(
    "recently viewed count",
    () => count("recently_viewed", userId),
    recentlyViewed.length,
  );
  const favoritesCount = await safe(
    "favorites count",
    () => count("favorites", userId),
    favorites.length,
  );

  return {
    profile,
    favorites,
    recentlyViewed,
    watchedFilms,
    counts: {
      watched: watchedCount,
      watchlist: watchlistCount,
      favorites: favoritesCount,
      collections: collectionsCount,
      recentlyViewed: recentlyViewedCount,
    },
  };
}

/** Upsert the film into the user's recently viewed history. */
export async function recordRecentlyViewed(
  userId: string,
  film: { imdbID: string; Title: string; Poster: string; Year: string },
) {
  const { error } = await supabase.from("recently_viewed").upsert(
    {
      user_id: userId,
      imdb_id: film.imdbID,
      title: film.Title,
      poster: film.Poster,
      year: film.Year,
      viewed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,imdb_id" },
  );
  if (error) console.error("[profile] recording recently viewed failed:", error);
}

export function formatJoined(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `Joined ${d.toLocaleString("en-US", { month: "long", year: "numeric" })}`;
}

export function avatarInitial(
  displayName?: string | null,
  username?: string | null,
) {
  return (displayName?.trim()?.[0] ?? username?.trim()?.[0] ?? "?").toUpperCase();
}
