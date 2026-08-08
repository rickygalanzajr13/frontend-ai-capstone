import { SectionHeading } from "./SectionHeading";

const prompts = [
  {
    label: "Recommendation",
    text: "Recommend films like Parasite with similar social themes.",
  },
  {
    label: "Interpretation",
    text: "Explain why Arrival resonates emotionally.",
  },
  {
    label: "Visual style",
    text: "Suggest visually stunning films with minimal dialogue.",
  },
];

export function AiCompanion() {
  return (
    <section id="companion" className="relative overflow-hidden border-y border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading
          eyebrow="AI companion"
          title="A reader of film, not a recommendation engine."
          description="Ask about a director's obsessions, why a scene lingers, or what to watch after a film you can't shake. Answers cite the films they draw from."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {prompts.map((p) => (
            <button
              key={p.text}
              type="button"
              className="group rounded-lg border border-border bg-background p-6 text-left transition-colors duration-300 hover:border-primary/50"
            >
              <span className="eyebrow">{p.label}</span>
              <p className="mt-4 font-display text-base leading-snug text-balance">
                “{p.text}”
              </p>
              <span className="mt-6 inline-block text-xs text-muted-foreground transition-colors group-hover:text-primary">
                Ask companion <span aria-hidden>→</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background px-5 py-4">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
          <p className="min-w-0 flex-1 text-sm text-muted-foreground">
            Ask anything about cinema…
          </p>
          <span className="shrink-0 rounded-sm border border-border px-2 py-1 text-[11px] text-muted-foreground">
            ⌘K
          </span>
        </div>
      </div>
    </section>
  );
}
