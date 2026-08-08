
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 aura" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 pt-20 pb-24 text-center sm:px-8 lg:pt-32 lg:pb-40">
        <div className="rise">
          <p className="eyebrow">A curated film archive</p>
          <h1 className="mt-5 font-display text-4xl leading-[1.08] font-normal text-balance sm:text-5xl lg:text-[3.5rem]">
            Discover films through stories, themes, and connections.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            Explore cinema beyond ratings. Find films through emotions, visual styles,
            themes, and meaningful relationships powered by intelligent recommendations.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#discover"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explore Films
            </a>
            <a
              href="#companion"
              className="rounded-md border border-border-strong px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              Try AI Companion
            </a>
          </div>

          <dl className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
            {[
              ["12,400", "Films indexed"],
              ["840", "Themes mapped"],
              ["3,100", "Collections"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-lg font-normal">{n}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
