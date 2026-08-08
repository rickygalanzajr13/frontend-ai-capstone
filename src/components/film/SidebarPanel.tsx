import type { ReactNode } from "react";

export function SidebarPanel({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="rounded-lg border border-border bg-surface/70 p-5">
      <h2 id={id} className="eyebrow">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
