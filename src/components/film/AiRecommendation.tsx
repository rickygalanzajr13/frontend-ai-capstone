import type { OmdbFilm } from "@/lib/omdb.functions";

type Verdict = "Must Watch" | "Worth Watching" | "Skip";

function verdictFor(film: OmdbFilm): Verdict {
  const score = Number(film.imdbRating);
  if (!Number.isFinite(score)) return "Worth Watching";
  if (score >= 7.5) return "Must Watch";
  if (score >= 6) return "Worth Watching";
  return "Skip";
}

export function AiRecommendation({ film }: { film: OmdbFilm }) {
  const verdict = verdictFor(film);
  const genre = (film.Genre ?? "").split(",")[0]?.trim().toLowerCase() || "cinema";

  return (
    <section aria-labelledby="ai-rec" className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="relative overflow-hidden rounded-lg border border-border-strong bg-surface p-6 sm:p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 aura opacity-70" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p id="ai-rec" className="eyebrow">
              AI Watch Recommendation
            </p>
            <span className="rounded-full border border-primary/50 bg-primary/15 px-3 py-1 text-xs text-foreground">
              {verdict}
            </span>
          </div>

          <p className="mt-4 max-w-2xl font-display text-xl font-normal text-balance sm:text-2xl">
            Recommended for viewers who enjoy slow-burn {genre} storytelling with strong
            performances.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Sprocktd weighs tone, pacing, and thematic overlap with films you already
            care about — not crowd scores. Expect deliberate rhythm, restrained visual
            language, and a payoff that rewards attention.
          </p>
        </div>
      </div>
    </section>
  );
}
