const groups = [
  { title: "Explore", items: ["Discover", "Collections", "Themes", "Directors"] },
  { title: "Companion", items: ["Ask", "Connections", "Reading lists"] },
  { title: "About", items: ["Manifesto", "Editorial policy", "Contact"] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="font-display text-base font-normal">Sprocktd</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A quiet archive for people who think about films after they end.
            </p>
          </div>

          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title} className="min-w-0">
              <h2 className="eyebrow">{g.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((i) => (
                  <li key={i}>
                    <a
                      href="#top"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sprocktd
          </p>
          <p className="text-xs text-muted-foreground">Built for the long watchlist.</p>
        </div>
      </div>
    </footer>
  );
}
