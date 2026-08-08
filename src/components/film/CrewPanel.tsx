import type { OmdbFilm } from "@/lib/omdb.functions";
import { SidebarPanel } from "./SidebarPanel";

function split(value?: string) {
  if (!value || value === "N/A") return [];
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

function CrewRow({ label, people }: { label: string; people: string[] }) {
  if (!people.length) return null;
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2.5 transition-colors duration-200 hover:border-border-strong">
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-foreground">{people.join(", ")}</dd>
    </div>
  );
}

export function CrewPanel({ film }: { film: OmdbFilm }) {
  const directors = split(film.Director);
  const writersRaw = split(film.Writer);
  const screenplay = writersRaw.filter((w) => /screenplay/i.test(w));
  const writers = writersRaw.filter((w) => !/screenplay/i.test(w));

  if (!directors.length && !writersRaw.length) return null;

  return (
    <SidebarPanel id="crew" title="Crew">
      <dl className="space-y-2.5">
        <CrewRow label="Director" people={directors} />
        <CrewRow label="Writer" people={writers} />
        <CrewRow label="Screenplay" people={screenplay} />
      </dl>
    </SidebarPanel>
  );
}
