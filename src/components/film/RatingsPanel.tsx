import type { OmdbFilm } from "@/lib/omdb.functions";
import { SidebarPanel } from "./SidebarPanel";

function Bar({
  label,
  display,
  percent,
  tone,
}: {
  label: string;
  display: string;
  percent: number | null;
  tone: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">{display}</span>
      </div>
      <div
        className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-raised"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        {...(percent !== null ? { "aria-valuenow": Math.round(percent) } : {})}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${tone}`}
          style={{ width: `${percent ?? 0}%` }}
        />
      </div>
    </div>
  );
}

export function RatingsPanel({ film }: { film: OmdbFilm }) {
  const imdb = Number(film.imdbRating);
  const meta = Number(film.Metascore);
  const rt = film.Ratings?.find((r) => r.Source === "Rotten Tomatoes")?.Value;
  const rtPercent = rt ? Number(rt.replace("%", "")) : null;

  return (
    <SidebarPanel id="ratings" title="Ratings">
      <div className="space-y-5">
        <Bar
          label="IMDb"
          display={Number.isFinite(imdb) ? `${film.imdbRating} / 10` : "Not rated"}
          percent={Number.isFinite(imdb) ? imdb * 10 : null}
          tone="bg-rating"
        />
        <Bar
          label="Metascore"
          display={Number.isFinite(meta) ? `${film.Metascore} / 100` : "Unavailable"}
          percent={Number.isFinite(meta) ? meta : null}
          tone="bg-primary"
        />
        <Bar
          label="Rotten Tomatoes"
          display={rtPercent !== null ? `${rtPercent}%` : "Unavailable"}
          percent={rtPercent}
          tone="bg-success"
        />
      </div>
    </SidebarPanel>
  );
}
