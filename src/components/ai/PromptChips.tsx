import { starterPrompts } from "./types";

export function PromptChips({
  onSelect,
  disabled,
}: {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="px-5 pb-3">
      <ul className="flex flex-wrap gap-2">
        {starterPrompts.map((p) => (
          <li key={p}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelect(p)}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              {p}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
