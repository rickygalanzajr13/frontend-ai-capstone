import { createFileRoute } from "@tanstack/react-router";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { HomeHero } from "@/components/home/HomeHero";
import { OmdbRow } from "@/components/home/OmdbRow";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { getFilm } from "@/lib/omdb.functions";

export const Route = createFileRoute("/")({
  loader: async () => {
    const { film } = await getFilm({ data: { imdbID: "tt15239678" } });
    return { film };
  },
  head: ({ loaderData }) => {
    const title = "Sprocktd — Discover films through stories and themes";
    const description =
      "A cinematic film discovery platform: trending shelves, curated collections, and an AI companion that reads your mood.";
    const poster = loaderData?.film?.Poster;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(poster && poster !== "N/A"
          ? [
              { property: "og:image", content: poster },
              { name: "twitter:image", content: poster },
            ]
          : []),
      ],
    };
  },
  component: Index,
});

function Index() {
  const { film } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <HomeHero film={film} />
        <div className="space-y-16 py-16 sm:space-y-20 sm:py-20">
          <OmdbRow
            eyebrow="Right now"
            title="Trending Movies"
            description="What the archive is circling this week."
            query="Dune"
          />
          <OmdbRow eyebrow="Always watched" title="Popular Movies" query="Batman" />
          <OmdbRow eyebrow="Fresh prints" title="New Releases" query="2025" />
          <OmdbRow
            eyebrow="Placeholder"
            title="Because You Liked Interstellar"
            description="Personalised shelves are coming — this row is illustrative for now."
            query="Interstellar"
          />
          <FeaturedCollections />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
