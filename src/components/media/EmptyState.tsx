import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-14 text-center">
      {icon ? (
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <h3 className="font-display text-lg font-normal text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Something didn't load",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 px-6 py-10 text-center">
      <h3 className="font-display text-lg font-normal text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-md border border-border-strong px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
