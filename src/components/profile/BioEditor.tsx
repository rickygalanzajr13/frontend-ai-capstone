import { useState } from "react";

import { PencilIcon } from "@/components/profile/AvatarEditor";
import { updateProfileDetails } from "@/lib/profile-data";

const MAX_BIO = 280;

/** Bio text with an inline pencil toggle that reveals an edit field. */
export function BioEditor({
  userId,
  bio,
  onSaved,
}: {
  userId: string;
  bio: string | null;
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(bio ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.length > MAX_BIO) {
      setError(`Bio must be ${MAX_BIO} characters or fewer.`);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateProfileDetails(userId, { bio: value.trim() ? value.trim() : null });
      setEditing(false);
      onSaved();
    } catch (err) {
      console.error("[profile] saving bio failed:", err);
      setError("Could not save your bio. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleSubmit} className="mt-6 max-w-lg">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="profile-bio" className="text-xs text-muted-foreground">
            Bio
          </label>
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {value.length}/{MAX_BIO}
          </span>
        </div>
        <textarea
          id="profile-bio"
          autoFocus
          rows={4}
          maxLength={MAX_BIO}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="A line or two about the films you love."
          className="mt-2 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
        {error ? (
          <p role="alert" className="mt-2 text-xs text-destructive">
            {error}
          </p>
        ) : null}
        <div className="mt-3 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save bio"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              setValue(bio ?? "");
              setError(null);
              setEditing(false);
            }}
            className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-border-strong disabled:opacity-40"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-6 flex max-w-lg items-start gap-2">
      <p className="text-sm leading-relaxed text-muted-foreground">
        {bio?.trim() ? bio : "No bio yet."}
      </p>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label="Edit bio"
        className="mt-0.5 shrink-0 rounded-md border border-transparent p-1 text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
