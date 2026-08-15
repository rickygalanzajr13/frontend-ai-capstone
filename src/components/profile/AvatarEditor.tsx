import { useRef, useState } from "react";

import { avatarInitial, updateProfileDetails, uploadAvatar } from "@/lib/profile-data";

const MAX_BYTES = 3 * 1024 * 1024;

/** Avatar circle with a hover pencil affordance that opens a file picker. */
export function AvatarEditor({
  userId,
  avatarSrc,
  displayName,
  username,
  onSaved,
}: {
  userId: string;
  avatarSrc: string | null;
  displayName: string;
  username?: string | null;
  onSaved: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file (PNG, JPG, GIF or WebP).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is larger than 3 MB. Pick a smaller one.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const avatar_url = await uploadAvatar(userId, file);
      await updateProfileDetails(userId, { avatar_url });
      onSaved();
    } catch (err) {
      console.error("[profile] avatar upload failed:", err);
      setError("Could not update your avatar. Please try again.");
    } finally {
      setSaving(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={saving}
        aria-label="Change avatar"
        className="group relative h-16 w-16 shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-20 sm:w-20"
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={`${displayName}'s avatar`}
            className="h-full w-full rounded-full border border-border-strong object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="grid h-full w-full place-items-center rounded-full border border-border-strong bg-surface font-display text-2xl"
          >
            {avatarInitial(displayName, username)}
          </span>
        )}
        <span
          aria-hidden
          className="absolute inset-0 grid place-items-center rounded-full bg-background/70 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <PencilIcon className="h-5 w-5" />
        </span>
      </button>
      <input
        ref={input}
        id="avatar-file"
        type="file"
        className="sr-only"
        accept="image/png,image/jpeg,image/gif,image/webp"
        onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
      />
      {saving ? (
        <p role="status" className="mt-2 text-xs text-muted-foreground">
          Uploading…
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
