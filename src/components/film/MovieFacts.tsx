import {
  Award,
  Clapperboard,
  Clock,
  DollarSign,
  Globe,
  Languages,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { OmdbFilm } from "@/lib/omdb.functions";

export function MovieFacts({ film }: { film: OmdbFilm }) {
  const facts: { label: string; value?: string | undefined; icon: LucideIcon }[] = [
    { label: "Rated", value: film.Rated, icon: ShieldCheck },
    { label: "Released", value: film.Released, icon: CalendarDays },
    { label: "Runtime", value: film.Runtime, icon: Clock },
    { label: "Language", value: film.Language, icon: Languages },
    { label: "Country", value: film.Country, icon: Globe },
    { label: "Awards", value: film.Awards, icon: Award },
    { label: "Box Office", value: film.BoxOffice, icon: DollarSign },
    { label: "Production", value: film.Production, icon: Clapperboard },
  ].filter((f) => f.value && f.value !== "N/A");

  if (!facts.length) return null;

  return (
    <section aria-labelledby="facts">
      <p id="facts" className="eyebrow">
        Movie Facts
      </p>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-surface p-4">
            <dt className="flex items-center gap-2">
              <Icon aria-hidden className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="eyebrow">{label}</span>
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
