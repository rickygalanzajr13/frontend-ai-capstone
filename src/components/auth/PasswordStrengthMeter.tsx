import { scorePassword } from "@/lib/auth-validation";

export function PasswordStrengthMeter({ password }: { password: string }) {
  const { score, label } = scorePassword(password);
  const tone =
    score >= 4
      ? "bg-success"
      : score >= 3
        ? "bg-rating"
        : score >= 1
          ? "bg-primary"
          : "bg-destructive";

  return (
    <div className="mt-2.5" aria-live="polite">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              password && i < score ? tone : "bg-border-strong"
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Password strength: {password ? label : "—"}
      </p>
    </div>
  );
}
