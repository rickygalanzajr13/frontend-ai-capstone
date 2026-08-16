import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ProfileRow } from "@/components/profile/ProfileRow";
import { AvatarEditor } from "@/components/profile/AvatarEditor";
import { BioEditor } from "@/components/profile/BioEditor";
import { useProfile } from "@/hooks/use-profile";
import {
  formatJoined,
  resolveAvatarUrl,
  toMovie,
} from "@/lib/profile-data";


export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Sprocktd" },
      {
        name: "description",
        content:
          "Your Sprocktd viewing profile: films watched, watchlist, favourites, collections, recently viewed, and the genres you actually watch.",
      },
      { property: "og:title", content: "Profile — Sprocktd" },
      {
        property: "og:description",
        content: "Your viewing habits, favourites, and recently viewed films on Sprocktd.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

function ProfilePage() {
  const { user, loading, data, topGenres, genresLoading, refetch } = useProfile();
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const avatarValue = data?.profile?.avatar_url ?? null;

  useEffect(() => {
    let active = true;
    void resolveAvatarUrl(avatarValue).then((url) => {
      if (active) setAvatarSrc(url);
    });
    return () => {
      active = false;
    };
  }, [avatarValue]);


  if (loading) {
    return (
      <Shell>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div aria-hidden className="animate-pulse space-y-6">
            <div className="h-20 w-20 rounded-full bg-surface" />
            <div className="h-8 w-56 rounded bg-surface" />
            <div className="h-4 w-80 rounded bg-surface" />
            <div className="grid grid-cols-4 gap-4 pt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-surface" />
              ))}
            </div>
          </div>
          <p className="sr-only" role="status">
            Loading your profile…
          </p>
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <div className="mx-auto max-w-6xl px-5 py-24 text-center sm:px-8">
          <h1 className="font-display text-3xl font-normal">Your profile</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in to see your watchlist, favourites, and viewing history.
          </p>
          <Link
            to="/signin"
            className="mt-8 inline-block rounded-md border border-border-strong px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:bg-surface"
          >
            Sign In
          </Link>
        </div>
      </Shell>
    );
  }

  const profile = data?.profile ?? null;
  const displayName =
    profile?.display_name?.trim() ||
    profile?.username?.trim() ||
    user.email?.split("@")[0] ||
    "Your profile";
  const joined = formatJoined(profile?.created_at ?? user.created_at);
  const counts = data?.counts;

  const stats = [
    { label: "Movies watched", value: counts?.watched ?? 0 },
    { label: "Watchlist", value: counts?.watchlist ?? 0 },
    { label: "Favourites", value: counts?.favorites ?? 0 },
    { label: "Collections", value: counts?.collections ?? 0 },
  ];

  const favourites = (data?.favorites ?? []).map((f) => toMovie(f));
  const recent = (data?.recentlyViewed ?? []).map((f) => toMovie(f));

  return (
    <Shell>
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-0 aura" />
        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5">
            <AvatarEditor
              userId={user.id}
              avatarSrc={avatarSrc}
              displayName={displayName}
              username={profile?.username ?? null}
              onSaved={() => void refetch()}
            />
            <div className="min-w-0">
              <h1 className="truncate font-display text-3xl font-normal sm:text-4xl">
                {displayName}
              </h1>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {[user.email, joined].filter(Boolean).join(" · ")}
              </p>
              {profile?.username ? (
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  @{profile.username}
                </p>
              ) : null}
            </div>
          </div>

          <BioEditor
            userId={user.id}
            bio={profile?.bio ?? null}
            onSaved={() => void refetch()}
          />

          <dl className="mt-10 grid grid-cols-4 gap-4">
            {stats.map((s) => (
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
            {genresLoading ? (
              <div aria-hidden className="mt-4 flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-7 w-20 animate-pulse rounded-full bg-surface" />
                ))}
              </div>
            ) : topGenres.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {topGenres.map((g) => (
                  <li
                    key={g.genre}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {g.genre}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No genres yet — watch or favourite some films.
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="space-y-16 py-16 sm:py-20">
        <ProfileRow
          title="Favourites"
          films={favourites}
          emptyMessage="No favourite films yet."
        />
        <ProfileRow
          title="Recently viewed"
          films={recent}
          emptyMessage="No recently viewed films yet."
        />
      </div>

    </Shell>
  );
}
