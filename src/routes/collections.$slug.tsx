import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MovieGrid } from "@/components/media/MovieGrid";
import { getCollection } from "@/lib/mock-data";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const collection = getCollection(params.slug);
    if (!collection) throw notFound();
    return collection;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — Sprocktd Collections` : "Collection — Sprocktd";
    const description = loaderData?.description ?? "A curated Sprocktd film collection.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const collection = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <Link
          to="/collections"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← All collections
        </Link>
        <p className="eyebrow mt-8">{collection.tagline}</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-normal text-balance">
          {collection.title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {collection.description}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          {collection.films.length} films · {collection.curator}
        </p>

        <div className="mt-12">
          <MovieGrid films={collection.films} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
