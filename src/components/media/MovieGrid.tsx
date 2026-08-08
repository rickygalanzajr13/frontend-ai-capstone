import { MovieCard, MovieCardSkeleton } from "./MovieCard";
import { usePosters } from "@/hooks/use-posters";
import type { MockMovie } from "@/lib/mock-data";

/** Responsive poster grid for placeholder lists, with poster hydration + skeletons. */
export function MovieGrid({ films }: { films: MockMovie[] }) {
  const { films: hydrated, isLoading } = usePosters(films);

  return (
    <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
      {(isLoading ? films : hydrated).map((film, i) => (
        <li key={film.imdbID + i}>
          {isLoading ? <MovieCardSkeleton /> : <MovieCard film={film} />}
        </li>
      ))}
    </ul>
  );
}
