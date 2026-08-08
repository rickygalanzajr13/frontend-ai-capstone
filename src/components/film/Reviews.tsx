const reviews = [
  {
    user: "mara_k",
    rating: "9 / 10",
    date: "12 Mar 2026",
    text: "Patient, precise, and quietly devastating. The final act reframes everything that came before it without raising its voice once.",
  },
  {
    user: "j.reyes",
    rating: "7 / 10",
    date: "28 Feb 2026",
    text: "Beautiful to look at and superbly acted, though the middle stretch tests your patience more than it needs to.",
  },
  {
    user: "nightprojector",
    rating: "8 / 10",
    date: "04 Feb 2026",
    text: "One of those films that keeps unfolding for days afterwards. The sound design alone is worth the watch.",
  },
];

export function Reviews() {
  return (
    <section aria-labelledby="reviews" className="mx-auto max-w-6xl px-5 sm:px-8">
      <h2 id="reviews" className="font-display text-2xl font-normal sm:text-3xl">
        Reviews
      </h2>
      <ul className="mt-8 grid gap-4 lg:grid-cols-3">
        {reviews.map((r) => (
          <li key={r.user} className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised text-xs text-muted-foreground"
              >
                {r.user.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{r.user}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-rating" />
                {r.rating}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
