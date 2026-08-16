import { MovieRow } from "@/components/media/MovieRow";
import { usePosters } from "@/hooks/use-posters";
import type { MockMovie } from "@/lib/mock-data";

/** Profile shelf that matches the homepage carousel rows. */
export function ProfileRow({
  title,
  films,
  emptyMessage,
}: {
  title: string;
  films: MockMovie[];
  emptyMessage: string;
}) {
  const { films: hydrated, isLoading } = usePosters(films);

  return (
    <MovieRow
      title={title}
      films={isLoading ? [] : hydrated}
      isLoading={isLoading && films.length > 0}
      emptyMessage={emptyMessage}
    />
  );
}
