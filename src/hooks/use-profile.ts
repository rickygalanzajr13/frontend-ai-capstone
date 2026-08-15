import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { useAuth } from "@/hooks/use-auth";
import { fetchProfileData } from "@/lib/profile-data";
import { getGenres } from "@/lib/omdb.functions";

export function useProfile() {
  const { user, loading: authLoading } = useAuth();
  const fetchGenres = useServerFn(getGenres);

  const profileQuery = useQuery({
    queryKey: ["profile-data", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchProfileData(user!.id),
    staleTime: 1000 * 30,
  });

  const genreIds = [
    ...new Set(
      [
        ...(profileQuery.data?.favorites ?? []),
        ...(profileQuery.data?.watchedFilms ?? []),
      ].map((f) => f.imdb_id),
    ),
  ].slice(0, 24);

  const genresQuery = useQuery({
    queryKey: ["profile-genres", genreIds],
    enabled: genreIds.length > 0,
    queryFn: () => fetchGenres({ data: { ids: genreIds } }),
    staleTime: 1000 * 60 * 60,
  });

  const tally = new Map<string, number>();
  for (const genreString of Object.values(genresQuery.data?.genres ?? {})) {
    for (const raw of String(genreString).split(",")) {
      const genre = raw.trim();
      if (!genre || genre === "N/A") continue;
      tally.set(genre, (tally.get(genre) ?? 0) + 1);
    }
  }
  const topGenres = [...tally.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([genre, count]) => ({ genre, count }));

  return {
    user,
    loading: authLoading || (Boolean(user) && profileQuery.isLoading),
    error: profileQuery.error,
    data: profileQuery.data,
    refetch: profileQuery.refetch,
    topGenres,
    genresLoading: genresQuery.isLoading,
  };

}
