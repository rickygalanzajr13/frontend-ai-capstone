import { useId, useState } from "react";

/** Accessible create-collection form with inline validation. */
export function CreateCollectionForm({
  onCreate,
}: {
  onCreate: (values: { title: string; description: string }) => Promise<void>;
}) {
  const titleId = useId();
  const descId = useId();
  const errorId = useId();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus(null);

    const trimmed = title.trim();
    if (!trimmed) {
      setError("Give your collection a name.");
      return;
    }
    if (trimmed.length > 80) {
      setError("Keep the name under 80 characters.");
      return;
    }
    setError(null);

    setBusy(true);
    try {
      await onCreate({ title: trimmed, description: description.trim() });
      setTitle("");
      setDescription("");
      setStatus("Collection created.");
    } catch (err) {
      console.error("[collections] create failed:", err);
      setError("We couldn't create that collection. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-xl border border-border bg-surface/60 p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor={titleId} className="text-xs text-muted-foreground">
            Collection name
          </label>
          <input
            id={titleId}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={80}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            placeholder="Late-night rewatches"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor={descId} className="text-xs text-muted-foreground">
            Description <span className="opacity-70">(optional)</span>
          </label>
          <input
            id={descId}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={160}
            placeholder="What ties these films together?"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      ) : null}
      {status ? (
        <p role="status" className="mt-3 text-xs text-muted-foreground">
          {status}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-4 rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {busy ? "Creating…" : "Create collection"}
      </button>
    </form>
  );
}
