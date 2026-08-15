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

/** Keep only the newest N films in a user's recently viewed history. */
export const RECENTLY_VIEWED_LIMIT = 10;

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

type CountableTable =
  | "favorites"
  | "watchlist"
  | "watched"
  | "recently_viewed"
  | "collections";

async function count(table: CountableTable, userId: string) {
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
          .limit(RECENTLY_VIEWED_LIMIT);
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
  else await pruneRecentlyViewed(userId);
}

/** Drop anything older than the newest RECENTLY_VIEWED_LIMIT entries. */
async function pruneRecentlyViewed(userId: string) {
  const { data, error } = await supabase
    .from("recently_viewed")
    .select("id")
    .eq("user_id", userId)
    .order("viewed_at", { ascending: false });
  if (error || !data || data.length <= RECENTLY_VIEWED_LIMIT) return;
  const stale = data.slice(RECENTLY_VIEWED_LIMIT).map((r) => r.id);
  const { error: delError } = await supabase
    .from("recently_viewed")
    .delete()
    .in("id", stale);
  if (delError) console.error("[profile] pruning recently viewed failed:", delError);
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

const AVATAR_BUCKET = "avatars";

/** Avatar values are either an absolute URL or a private storage path. */
export async function resolveAvatarUrl(value: string | null | undefined) {
  if (!value) return null;
  if (/^(https?:|data:|blob:)/.test(value)) return value;
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(value, 60 * 60);
  if (error) {
    console.error("[profile] signing avatar url failed:", error);
    return null;
  }
  return data?.signedUrl ?? null;
}

function logSupabaseError(label: string, error: unknown) {
  const e = error as { message?: string; code?: string; details?: string; hint?: string };
  console.error(`[profile] ${label}:`, {
    message: e?.message,
    code: e?.code,
    details: e?.details,
    hint: e?.hint,
    error,
  });
}

export async function uploadAvatar(userId: string, file: File) {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().slice(0, 5);
  const path = `${userId}/avatar-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) {
    logSupabaseError("avatar upload failed", error);
    throw error;
  }
  return path;
}

export async function updateProfileDetails(
  userId: string,
  values: { bio?: string | null; avatar_url?: string | null },
) {
  // Update the caller's own row first; RLS keeps this scoped to auth.uid() = id.
  const { data, error } = await supabase
    .from("profiles")
    .update(values)
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    logSupabaseError("profile update failed", error);
    throw error;
  }
  if (data) return;

  // No row yet for this user: create it.
  const { error: insertError } = await supabase
    .from("profiles")
    .insert({ id: userId, ...values });
  if (insertError) {
    logSupabaseError("profile insert failed", insertError);
    throw insertError;
  }
}
