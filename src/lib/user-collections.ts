import { supabase } from "@/lib/supabase";
import type { MockMovie } from "@/lib/mock-data";

export type UserCollection = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  created_at: string;
};

export type CollectionItem = {
  id: string;
  imdb_id: string;
  title: string | null;
  poster: string | null;
  year: string | null;
};

export function toSlug(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || `collection-${Date.now()}`
  );
}

export function itemToMovie(item: CollectionItem): MockMovie {
  return {
    imdbID: item.imdb_id,
    Title: item.title ?? item.imdb_id,
    Year: item.year ?? "",
    Poster: item.poster ?? "N/A",
  };
}

export async function listCollections(userId: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("id, slug, title, description, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as UserCollection[];
}

export async function getCollectionById(userId: string, id: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("id, slug, title, description, created_at")
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as UserCollection | null) ?? null;
}

export async function createCollection(
  userId: string,
  values: { title: string; description?: string },
) {
  const title = values.title.trim();
  const { data, error } = await supabase
    .from("collections")
    .insert({
      user_id: userId,
      title,
      slug: `${toSlug(title)}-${Math.random().toString(36).slice(2, 6)}`,
      description: values.description?.trim() || null,
    })
    .select("id, slug, title, description, created_at")
    .single();
  if (error) throw error;
  return data as UserCollection;
}

export async function deleteCollection(userId: string, id: string) {
  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
  if (error) throw error;
}

export async function listCollectionItems(collectionId: string) {
  const { data, error } = await supabase
    .from("collection_items")
    .select("id, imdb_id, title, poster, year")
    .eq("collection_id", collectionId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CollectionItem[];
}

/** Counts for every collection of a user, keyed by collection id. */
export async function collectionCounts(userId: string) {
  const { data, error } = await supabase
    .from("collection_items")
    .select("collection_id")
    .eq("user_id", userId);
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { collection_id: string }[]) {
    counts[row.collection_id] = (counts[row.collection_id] ?? 0) + 1;
  }
  return counts;
}

export async function addFilmToCollection(
  userId: string,
  collectionId: string,
  film: { imdbID: string; Title: string; Poster: string; Year: string },
) {
  const { error } = await supabase.from("collection_items").upsert(
    {
      collection_id: collectionId,
      user_id: userId,
      imdb_id: film.imdbID,
      title: film.Title,
      poster: film.Poster,
      year: film.Year,
    },
    { onConflict: "collection_id,imdb_id" },
  );
  if (error) throw error;
}

export async function removeFilmFromCollection(
  userId: string,
  collectionId: string,
  imdbId: string,
) {
  const { error } = await supabase
    .from("collection_items")
    .delete()
    .eq("user_id", userId)
    .eq("collection_id", collectionId)
    .eq("imdb_id", imdbId);
  if (error) throw error;
}
