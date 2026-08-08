import { createFileRoute } from "@tanstack/react-router";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MovieGrid } from "@/components/media/MovieGrid";
import { profile } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: `${profile.displayName} — Sprocktd Profile` },
      {
        name: "description",
        content:
          "A Sprocktd viewing profile: favourite genres, films watched, watchlist size, favourites, and recently viewed.",
      },
      { property: "og:title", content: `${profile.displayName} — Sprocktd Profile` },
      {
        property: "og:description",
        content: "Viewing habits, favourites, and recently viewed films on Sprocktd.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div aria-hidden className="absolute inset-0 aura" />
          <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5">
              <div
                aria-hidden
                className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-border-strong bg-surface font-display text-2xl sm:h-20 sm:w-20"
              >
                {profile.displayName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h1 className="truncate font-display text-3xl font-normal sm:text-4xl">
                  {profile.displayName}
                </h1>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  @{profile.username} · {profile.joined}
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {profile.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur"
                >
                  <dt className="eyebrow">{s.label}</dt>
                  <dd className="mt-2 font-display text-2xl font-normal">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <p className="eyebrow">Favourite genres</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {profile.favouriteGenres.map((g) => (
                  <li
                    key={g}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl space-y-16 px-5 py-16 sm:px-8 sm:py-20">
          <section>
            <h2 className="font-display text-2xl font-normal sm:text-3xl">Favourites</h2>
            <div className="mt-8">
              <MovieGrid films={profile.favourites} />
            </div>
          </section>
          <section>
            <h2 className="font-display text-2xl font-normal sm:text-3xl">Recently viewed</h2>
            <div className="mt-8">
              <MovieGrid films={profile.recentlyViewed} />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
