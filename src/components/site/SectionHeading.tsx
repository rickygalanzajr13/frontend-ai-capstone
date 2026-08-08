export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div className="min-w-0 max-w-xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-display text-2xl font-normal text-balance sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <a
          href="#collections"
          className="shrink-0 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {action} <span aria-hidden>→</span>
        </a>
      ) : null}
    </div>
  );
}
