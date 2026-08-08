import { useId, useState, type InputHTMLAttributes } from "react";

type BaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  error?: string | undefined;
  hint?: React.ReactNode;
};

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary aria-[invalid=true]:border-destructive";

export function AuthField({ label, error, hint, className, ...props }: BaseProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-xs text-muted-foreground">
          {label}
        </label>
        {hint}
      </div>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 ${inputClass}`}
        {...props}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function PasswordField({ label, error, hint, className, ...props }: BaseProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-xs text-muted-foreground">
          {label}
        </label>
        {hint}
      </div>
      <div className="relative mt-2">
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${inputClass} pr-20`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-destructive">
      {message}
    </p>
  );
}
