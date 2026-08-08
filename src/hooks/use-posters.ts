import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getPosters } from "@/lib/omdb.functions";
import type { MockMovie } from "@/lib/mock-data";

/**
 * Hydrates placeholder movie lists with real poster art from OMDb.
 * Falls back to the title tile when a poster is unavailable.
 */
export function usePosters(films: MockMovie[]) {
  const fetchPosters = useServerFn(getPosters);
  const ids = films.map((f) => f.imdbID);

  const { data, isLoading } = useQuery({
    queryKey: ["posters", ids],
    queryFn: () => fetchPosters({ data: { ids } }),
    staleTime: 1000 * 60 * 60,
  });

  const posters = data?.posters ?? {};
  return {
    films: films.map((f) => ({ ...f, Poster: posters[f.imdbID] ?? f.Poster })),
    isLoading,
  };
}
