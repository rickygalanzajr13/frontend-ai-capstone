import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

import { MAX_MESSAGE_LENGTH } from "./types";

export function ChatComposer({
  onSend,
  thinking,
  autoFocus,
}: {
  onSend: (text: string) => void;
  thinking: boolean;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && !thinking) ref.current?.focus();
  }, [autoFocus, thinking]);

  function submit() {
    if (!value.trim() || thinking) return;
    onSend(value);
    setValue("");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="border-t border-border p-3"
    >
      <div className="flex items-end gap-2 rounded-xl border border-border bg-surface px-3 py-2 focus-within:border-primary">
        <label htmlFor="assistant-input" className="sr-only">
          Ask the Sprocktd companion
        </label>
        <textarea
          id="assistant-input"
          ref={ref}
          rows={1}
          value={value}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.stopPropagation();
              submit();
            }
          }}
          placeholder="Ask for a recommendation…"
          className="max-h-28 min-h-[1.5rem] flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!value.trim() || thinking}
          aria-label="Send message"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40"
        >
          <ArrowUp aria-hidden className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 px-1 text-[11px] text-muted-foreground">
        Enter to send · Shift + Enter for a new line
      </p>
    </form>
  );
}
