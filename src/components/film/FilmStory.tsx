import type { OmdbFilm } from "@/lib/omdb.functions";

export function FilmStory({ film }: { film: OmdbFilm }) {
  if (!film.Plot || film.Plot === "N/A") return null;

  const paragraphs = film.Plot.split(/(?<=\.)\s+(?=[A-Z])/).reduce<string[]>(
    (acc, sentence, i) => {
      const idx = Math.floor(i / 2);
      acc[idx] = acc[idx] ? `${acc[idx]} ${sentence}` : sentence;
      return acc;
    },
    [],
  );

  return (
    <section aria-labelledby="story">
      <p id="story" className="eyebrow">
        Story Overview
      </p>
      <div className="mt-4 max-w-[65ch] space-y-4">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 24)} className="text-base leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
