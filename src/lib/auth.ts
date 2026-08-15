import { supabase } from "@/lib/supabase";

export async function signUpWithEmail({
  email,
  password,
  name,
  username,
}: {
  email: string;
  password: string;
  name: string;
  username: string;
}) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        username,
      },
    },
  });
}

export async function signInWithEmail(
  email: string,
  password: string,
) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signInWithGoogle() {
  const redirectTo =
    typeof window !== "undefined" ? window.location.origin : "";

  return supabase.auth.signInWithOAuth({
    provider: "google",
    ...(redirectTo ? { options: { redirectTo } } : {}),
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export type WatchlistItem = {
  id: string;
  imdb_id: string;
  title: string;
  poster: string | null;
  year: string | null;
  created_at: string;
};

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/** The signed-in user's watchlist, newest first. Returns [] when signed out. */
export async function getCurrentWatchlist(): Promise<WatchlistItem[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("watchlist")
    .select("id, imdb_id, title, poster, year, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    imdb_id: row.imdb_id,
    title: row.title ?? row.imdb_id,
    poster: row.poster,
    year: row.year,
    created_at: row.created_at,
  }));
}

export async function isInWatchlist(imdbId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("imdb_id", imdbId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

/** Adds a film once per user; no-ops when it's already saved. */
export async function addToWatchlist(film: {
  imdbID: string;
  Title: string;
  Poster?: string | null;
  Year?: string | null;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("You must be signed in to save films.");

  if (await isInWatchlist(film.imdbID)) return { added: false };

  const { error } = await supabase.from("watchlist").insert({
    user_id: user.id,
    imdb_id: film.imdbID,
    title: film.Title,
    poster: film.Poster ?? null,
    year: film.Year ?? null,
  });

  if (error) throw error;
  return { added: true };
}

export async function removeFromWatchlist(imdbId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("You must be signed in to edit your watchlist.");

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", user.id)
    .eq("imdb_id", imdbId);

  if (error) throw error;
}

export type FavoriteItem = {
  id: string;
  imdb_id: string;
  title: string | null;
  poster: string | null;
  year: string | null;
  created_at: string;
};

/** Whether the film is in the signed-in user's favorites. */
export async function isFavorite(imdbId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { saved: false, error: new Error("You must be signed in to use favorites.") };
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("imdb_id", imdbId)
    .maybeSingle();

  return { saved: Boolean(data), error };
}

export async function addToFavorites({
  imdbId,
  title,
  poster,
  year,
}: {
  imdbId: string;
  title: string;
  poster?: string | null;
  year?: string | null;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      data: null,
      error: new Error("Sign in to add films to your favorites."),
    };
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert({
      user_id: user.id,
      imdb_id: imdbId,
      title,
      poster: poster ?? null,
      year: year ?? null,
    })
    .select("id, imdb_id, title, poster, year, created_at")
    .single();

  if (error) {
    console.error("[favorites] Supabase insert error:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
  }

  return {
    data: data as FavoriteItem | null,
    error,
  };
}

export async function removeFromFavorites(imdbId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: new Error("You must be signed in to edit your favorites.") };
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("imdb_id", imdbId);

  return { error };
}

/** The signed-in user's favorites, newest first. */
export async function getCurrentFavorites() {
  const user = await getCurrentUser();
  if (!user) return { favorites: [] as FavoriteItem[], error: null };

  const { data, error } = await supabase
    .from("favorites")
    .select("id, imdb_id, title, poster, year, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return { favorites: (data ?? []) as FavoriteItem[], error };
}

export type WatchedItem = {
  id: string;
  imdb_id: string;
  title: string | null;
  poster: string | null;
  year: string | null;
  watched_at: string;
};

/** Whether the film is marked watched by the signed-in user. */
export async function isWatched(imdbId: string) {
  const user = await getCurrentUser();
  if (!user) return { saved: false, error: null };

  const { data, error } = await supabase
    .from("watched")
    .select("id")
    .eq("user_id", user.id)
    .eq("imdb_id", imdbId)
    .maybeSingle();

  return { saved: Boolean(data), error };
}

export async function addToWatched({
  imdbId,
  title,
  poster,
  year,
}: {
  imdbId: string;
  title: string;
  poster?: string | null;
  year?: string | null;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: new Error("Sign in to mark films as watched.") };
  }

  const { error } = await supabase.from("watched").insert({
    user_id: user.id,
    imdb_id: imdbId,
    title,
    poster: poster ?? null,
    year: year ?? null,
  });

  return { error };
}

export async function removeFromWatched(imdbId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: new Error("You must be signed in to edit your watched films.") };
  }

  const { error } = await supabase
    .from("watched")
    .delete()
    .eq("user_id", user.id)
    .eq("imdb_id", imdbId);

  return { error };
}
