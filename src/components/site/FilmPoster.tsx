export function FilmPoster({
  poster,
  title,
  className = "",
}: {
  poster: string;
  title: string;
  className?: string;
}) {
  const hasPoster = poster && poster !== "N/A";

  if (!hasPoster) {
    return (
      <div
        className={`flex aspect-[2/3] w-full items-center justify-center rounded-md border border-border bg-surface px-4 text-center ${className}`}
      >
        <span className="font-display text-sm text-muted-foreground">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={poster}
      alt={`Poster for ${title}`}
      loading="lazy"
      className={`aspect-[2/3] w-full rounded-md border border-border object-cover ${className}`}
    />
  );
}
