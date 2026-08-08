import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SprocktdMark } from "@/components/site/SprocktdMark";
import backdrop from "@/assets/card-1.jpg";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-14">
      <img
        src={backdrop}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl motion-safe:transition-opacity"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 veil" />
      <div aria-hidden className="pointer-events-none absolute inset-0 aura" />

      <main className="relative w-full max-w-md">
        <div className="rise rounded-xl border border-border bg-surface/60 p-7 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-9">
          <Link to="/" className="flex items-center justify-center gap-2.5">
            <SprocktdMark title="Sprocktd" className="h-7 w-7 text-foreground" />
            <span className="font-display text-[1.05rem] tracking-tight">Sprocktd</span>
          </Link>

          <h1 className="mt-8 text-center font-display text-3xl font-normal">{title}</h1>
          <p className="mt-3 text-center text-sm text-muted-foreground">{subtitle}</p>

          {children}
        </div>

        {footer ? <div className="mt-6 text-center">{footer}</div> : null}

        <p className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
