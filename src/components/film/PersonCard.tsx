function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function PersonCard({
  name,
  role,
}: {
  name: string;
  role?: string | undefined;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 transition-colors duration-200 hover:border-border-strong">
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs text-muted-foreground"
      >
        {initials(name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm text-foreground">{name}</span>
        {role ? (
          <span className="block truncate text-xs text-muted-foreground">{role}</span>
        ) : null}
      </span>
    </div>
  );
}
