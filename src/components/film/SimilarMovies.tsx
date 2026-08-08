import { Link } from "@tanstack/react-router";

const placeholders = [
  { title: "Burning", year: "2018", note: "Slow-burn mystery" },
  { title: "Memories of Murder", year: "2003", note: "Procedural dread" },
  { title: "Under the Skin", year: "2013", note: "Cold abstraction" },
  { title: "The Handmaiden", year: "2016", note: "Layered deception" },
  { title: "Drive My Car", year: "2021", note: "Grief in motion" },
  { title: "Enemy", year: "2013", note: "Doubled identity" },
];

export function SimilarMovies() {
  return (
    <section aria-labelledby="similar" className="mx-auto max-w-6xl px-5 sm:px-8">
      <h2 id="similar" className="font-display text-2xl font-normal sm:text-3xl">
        You May Also Like
      </h2>
      <ul className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        {placeholders.map((m) => (
          <li key={m.title} className="min-w-[60%] snap-start sm:min-w-[32%] lg:min-w-[20%]">
            <Link
              to="/search"
              search={{ q: m.title }}
              className="group block h-full rounded-lg border border-border bg-surface p-4 transition-colors duration-200 hover:border-border-strong"
            >
              <div
                aria-hidden
                className="aspect-[2/3] w-full rounded-md border border-border bg-surface-raised"
              />
              <h3 className="mt-3 font-display text-sm font-normal leading-snug">{m.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {m.year} · {m.note}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
