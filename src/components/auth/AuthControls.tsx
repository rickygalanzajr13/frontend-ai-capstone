import { signInWithGoogle } from "@/lib/auth";

export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="my-6 flex items-center gap-3" role="separator" aria-hidden>
      <span className="h-px flex-1 bg-border" />
      <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        const { error } = await signInWithGoogle();

        if (error) {
          console.error("Google sign-in failed:", error);
        }
      }}
      className="flex w-full items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-foreground transition-colors hover:border-border-strong hover:bg-surface/80"
    >
      {label}
    </button>
  );
}

export function AuthSubmit({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function AuthCheckbox({
  id,
  checked,
  onChange,
  children,
  error,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  error?: string | undefined;
}) {
  return (
    <div>
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
        />
        <label htmlFor={id} className="text-xs leading-relaxed text-muted-foreground">
          {children}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
