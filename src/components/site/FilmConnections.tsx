import { SectionHeading } from "./SectionHeading";

const chain = [
  { label: "Parasite", kind: "film", meta: "Bong Joon-ho · 2019" },
  { label: "Class Inequality", kind: "theme", meta: "Shared thematic thread" },
  { label: "Burning", kind: "film", meta: "Lee Chang-dong · 2018" },
  { label: "Memories of Murder", kind: "film", meta: "Bong Joon-ho · 2003" },
  { label: "Snowpiercer", kind: "film", meta: "Bong Joon-ho · 2013" },
];

export function FilmConnections() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
      <SectionHeading
        eyebrow="Film connections"
        title="Every film is a door into another."
        description="Sprocktd maps films to each other through themes, authorship, imagery, and mood — so a single title becomes a path through cinema."
      />

      <ol className="mt-12 grid gap-0 lg:grid-cols-[repeat(5,minmax(0,1fr))] lg:gap-4">
        {chain.map((node, i) => (
          <li key={node.label} className="relative">
            <div
              className={`rounded-lg border p-5 ${
                node.kind === "theme"
                  ? "border-primary/40 bg-primary/8"
                  : "border-border bg-surface"
              }`}
            >
              <span className="eyebrow">{node.kind}</span>
              <h3 className="mt-3 font-display text-base font-normal">{node.label}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">{node.meta}</p>
            </div>
            {i < chain.length - 1 ? (
              <span
                aria-hidden
                className="flex justify-center py-3 text-muted-foreground lg:absolute lg:top-1/2 lg:-right-4 lg:z-10 lg:-translate-y-1/2 lg:py-0"
              >
                <span className="lg:hidden">↓</span>
                <span className="hidden lg:inline">→</span>
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
