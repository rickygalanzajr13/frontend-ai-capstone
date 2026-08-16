import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { RecordView } from "@/components/film/RecordView";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FilmHero } from "@/components/film/FilmHero";
import { AiRecommendation } from "@/components/film/AiRecommendation";
import { CastPanel } from "@/components/film/CastPanel";
import { CrewPanel } from "@/components/film/CrewPanel";
import { RatingsPanel } from "@/components/film/RatingsPanel";

import { SimilarMovies } from "@/components/film/SimilarMovies";
import { Reviews } from "@/components/film/Reviews";
import { FilmCta } from "@/components/film/FilmCta";
import { getFilm } from "@/lib/omdb.functions";

export const Route = createFileRoute("/film/$id")({
  loader: async ({ params }) => {
    const result = await getFilm({ data: { imdbID: params.id } });
    if (!result.film) throw notFound();
    return result.film;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.Title} (${loaderData.Year}) — Sprocktd` : "Film — Sprocktd";
    const description = loaderData
      ? `${loaderData.Plot ?? ""}`.slice(0, 155)
      : "Explore this film's story, themes, and connections on Sprocktd.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "video.movie" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData?.Poster && loaderData.Poster !== "N/A"
          ? [
              { property: "og:image", content: loaderData.Poster },
              { name: "twitter:image", content: loaderData.Poster },
            ]
          : []),
      ],
    };
  },
  component: FilmPage,
});

function FilmPage() {
  const film = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <RecordView film={film} />
      <main>
        <FilmHero
          film={film}
          sidebar={
            <>
              <CastPanel film={film} />
              <CrewPanel film={film} />
              <RatingsPanel film={film} />
            </>
          }
        />
        <div className="space-y-16 py-16 sm:space-y-20 sm:py-20">
          <AiRecommendation film={film} />
          <SimilarMovies />
          <Reviews />
          <FilmCta />
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
