import { Link } from "@tanstack/react-router";

import { SectionHeading } from "./SectionHeading";

const categories = [
  { title: "Mind-Bending Films", query: "inception", note: "Perception, time, memory" },
  { title: "Films About Isolation", query: "solaris", note: "Solitude and distance" },
  { title: "Slow Cinema", query: "stalker", note: "Duration as language" },
  { title: "Coming-of-Age", query: "moonlight", note: "Thresholds and firsts" },
  { title: "Best Directorial Debuts", query: "reservoir dogs", note: "First and fully formed" },
  { title: "Neo-Noir Essentials", query: "blade runner", note: "Moral fog, wet streets" },
];

export function FeaturedDiscovery() {
  return (
    <section id="discover" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
      <SectionHeading
        eyebrow="Featured discovery"
        title="Enter through a theme, not a genre."
        description="Curated entry points into the archive, each one assembled and annotated by editors and readers of film."
        action="Browse all"
      />

      <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:pb-0">
        {categories.map((c) => (
          <li
            key={c.title}
            className="min-w-[75%] snap-start sm:min-w-[42%] lg:min-w-0"
          >
            <Link
              to="/search"
              search={{ q: c.query }}
              className="group flex h-full flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-colors duration-300 hover:border-border-strong"
            >
              <div>
                <h3 className="font-display text-lg font-normal">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.note}</p>
              </div>
              <div className="mt-10 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">Explore films</span>
                <span
                  aria-hidden
                  className="text-sm text-muted-foreground transition-colors group-hover:text-primary"
                >
                  →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
