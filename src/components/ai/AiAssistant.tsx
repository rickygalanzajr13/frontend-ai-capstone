import { useEffect, useRef, useState } from "react";
import { MessageSquare, X } from "lucide-react";

import { SprocktdMark } from "@/components/site/SprocktdMark";
import { ChatBubble } from "./ChatBubble";
import { ChatComposer } from "./ChatComposer";
import { PromptChips } from "./PromptChips";
import { useCompanionChat } from "./useCompanionChat";

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const { messages, thinking, error, send, retry, isEmpty } = useCompanionChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, error]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="sprocktd-assistant"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-border-strong bg-surface/80 px-4 py-3 text-sm text-foreground shadow-[var(--shadow-soft)] backdrop-blur-xl transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:bottom-7 sm:right-7"
      >
        {open ? (
          <X aria-hidden className="h-4 w-4" />
        ) : (
          <MessageSquare aria-hidden className="h-4 w-4 text-primary" />
        )}
        <span className="hidden sm:inline">{open ? "Close" : "Ask Sprocktd"}</span>
        <span className="sr-only sm:hidden">{open ? "Close assistant" : "Ask Sprocktd"}</span>
      </button>

      {open ? (
        <div
          id="sprocktd-assistant"
          role="dialog"
          aria-label="Sprocktd AI Companion"
          className="fixed inset-x-3 bottom-20 z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-border bg-background/95 shadow-[var(--shadow-soft)] backdrop-blur-2xl sm:inset-x-auto sm:right-7 sm:bottom-24 sm:w-[26rem] rise"
        >
          <header className="flex items-center gap-3 border-b border-border px-5 py-4">
            <SprocktdMark title="" className="h-6 w-6 shrink-0 text-primary" />
            <div className="min-w-0">
              <h2 className="truncate font-display text-base font-normal">AI Sprocktd Companion</h2>
              <p className="truncate text-xs text-muted-foreground">
                Ask for a film by mood, theme, or a title you loved.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </header>

          {isEmpty ? (
            <div className="px-5 pt-5">
              <ChatBubble message={messages[0]!} />
            </div>
          ) : null}

          <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages
              .filter((msg) => msg.id !== "greeting")
              .map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}

            {thinking ? (
              <p className="text-sm text-muted-foreground" aria-live="polite">
                <span className="inline-block animate-pulse">Thinking…</span>
              </p>
            ) : null}

            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground"
              >
                <p>{error}</p>
                <button
                  type="button"
                  onClick={retry}
                  className="mt-2 rounded-md border border-border-strong px-3 py-1.5 text-xs transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Try again
                </button>
              </div>
            ) : null}
          </div>

          {isEmpty ? <PromptChips onSelect={send} disabled={thinking} /> : null}

          <ChatComposer onSend={send} thinking={thinking} autoFocus={open} />
        </div>
      ) : null}
    </>
  );
}
