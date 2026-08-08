import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { ReactNode } from "react";

import { MovieRow } from "@/components/media/MovieRow";
import { searchFilms } from "@/lib/omdb.functions";

/** A carousel backed by a live OMDb query, with skeleton / empty / error states. */
export function OmdbRow({
  eyebrow,
  title,
  description,
  query,
  action,
  limit = 10,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  query: string;
  action?: ReactNode;
  limit?: number;
}) {
  const search = useServerFn(searchFilms);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["omdb-row", query],
    queryFn: () => search({ data: { query } }),
    staleTime: 1000 * 60 * 30,
  });

  return (
    <MovieRow
      {...(eyebrow ? { eyebrow } : {})}
      title={title}
      {...(description ? { description } : {})}
      {...(action ? { action } : {})}
      films={(data?.results ?? []).slice(0, limit)}
      isLoading={isLoading}
      error={data?.error ?? null}
      onRetry={() => void refetch()}
      emptyMessage="No films matched this shelf right now."
    />
  );
}
