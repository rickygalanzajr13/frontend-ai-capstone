import { supabase } from "@/lib/supabase";
import type { MockMovie } from "@/lib/mock-data";
import type { FilmRow } from "@/lib/profile-data";

export type UserCollection = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  created_at: string;
};

export type CollectionItem = FilmRow & { id: string };

/** URL-safe slug derived from the collection title. */
export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "collection"
  );
}

export async function fetchMyCollections(userId: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("id, slug, title, description, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as UserCollection[];
}

export async function fetchCollectionItemCounts(collectionIds: string[]) {
  if (!collectionIds.length) return {} as Record<string, number>;
  const { data, error } = await supabase
    .from("collection_items")
    .select("collection_id")
    .in("collection_id", collectionIds);
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const key = (row as { collection_id: string }).collection_id;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export async function fetchCollection(userId: string, id: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("id, slug, title, description, created_at")
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as UserCollection | null) ?? null;
}

export async function fetchCollectionItems(collectionId: string) {
  const { data, error } = await supabase
    .from("collection_items")
    .select("id, imdb_id, title, poster, year")
    .eq("collection_id", collectionId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CollectionItem[];
}

export async function createCollection(
  userId: string,
  values: { title: string; description?: string },
) {
  const base = slugify(values.title);
  const slug = `${base}-${Math.random().toString(36).slice(2, 7)}`;
  const { data, error } = await supabase
    .from("collections")
    .insert({
      user_id: userId,
      slug,
      title: values.title.trim(),
      description: values.description?.trim() || null,
    })
    .select("id, slug, title, description, created_at")
    .single();
  if (error) throw error;
  return data as UserCollection;
}

export async function deleteCollection(userId: string, id: string) {
  const { error: itemsError } = await supabase
    .from("collection_items")
    .delete()
    .eq("collection_id", id)
    .eq("user_id", userId);
  if (itemsError) throw itemsError;
  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function addFilmToCollection(
  userId: string,
  collectionId: string,
  film: { imdbID: string; Title: string; Poster: string; Year: string },
) {
  const { error } = await supabase.from("collection_items").insert({
    collection_id: collectionId,
    user_id: userId,
    imdb_id: film.imdbID,
    title: film.Title,
    poster: film.Poster,
    year: film.Year,
  });
  if (error) throw error;
}

export async function removeFilmFromCollection(userId: string, itemId: string) {
  const { error } = await supabase
    .from("collection_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);
  if (error) throw error;
}

/** Which of the user's collections already contain this film. */
export async function fetchCollectionIdsForFilm(userId: string, imdbId: string) {
  const { data, error } = await supabase
    .from("collection_items")
    .select("collection_id")
    .eq("user_id", userId)
    .eq("imdb_id", imdbId);
  if (error) throw error;
  return new Set((data ?? []).map((r) => (r as { collection_id: string }).collection_id));
}

export function itemToMovie(item: CollectionItem): MockMovie {
  return {
    imdbID: item.imdb_id,
    Title: item.title ?? item.imdb_id,
    Year: item.year ?? "",
    Poster: item.poster ?? "N/A",
  };
}
