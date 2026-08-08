import type { OmdbFilm } from "@/lib/omdb.functions";
import { PersonCard } from "./PersonCard";
import { SidebarPanel } from "./SidebarPanel";

function split(value?: string) {
  if (!value || value === "N/A") return [];
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

export function CastPanel({ film }: { film: OmdbFilm }) {
  const cast = split(film.Actors);
  if (!cast.length) return null;

  return (
    <SidebarPanel id="cast" title="Cast">
      <ul className="space-y-2.5">
        {cast.map((name) => (
          <li key={name}>
            <PersonCard name={name} role="Cast" />
          </li>
        ))}
      </ul>
    </SidebarPanel>
  );
}
