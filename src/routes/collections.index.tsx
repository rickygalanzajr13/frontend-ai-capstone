import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MyCollections } from "@/components/collections/MyCollections";
import { collections } from "@/lib/mock-data";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — Sprocktd" },
      {
        name: "description",
        content:
          "Editorial film collections: hidden gems, mind-benders, Oscar winners, Ghibli, plot twists, and films under 90 minutes.",
      },
      { property: "og:title", content: "Collections — Sprocktd" },
      {
        property: "og:description",
        content: "Browse curated Sprocktd collections built around a single cinematic idea.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="eyebrow">Collections</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-normal text-balance">
          Shelves built around an idea, not a genre.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Each collection is a small argument about cinema. Open one and see the case.
        </p>

        <MyCollections />

        <p className="eyebrow mt-16">Collections by community</p>
        <h2 className="mt-3 font-display text-2xl font-normal">
          Assembled by people who watch closely.
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Editorial shelves from the Sprocktd community — browse freely, they aren't yours
          to edit.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <li key={c.slug}>
              <Link
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="group flex h-full flex-col rounded-xl border border-border bg-surface/60 p-6 transition-colors hover:border-border-strong hover:bg-surface"
              >
                <p className="eyebrow">{c.films.length} films</p>
                <h2 className="mt-3 font-display text-xl font-normal transition-colors group-hover:text-primary">
                  {c.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
                <p className="mt-auto pt-6 text-xs text-muted-foreground">{c.curator}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
