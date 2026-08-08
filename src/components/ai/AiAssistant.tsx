import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, ArrowUp } from "lucide-react";

import { SprocktdMark } from "@/components/site/SprocktdMark";
import { assistantPrompts } from "@/lib/mock-data";
import { askGroq } from "@/lib/groq.functions.ts";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

const greeting: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "I'm the Sprocktd companion. Tell me a mood, a film you loved, or how much time you have — I'll narrow the archive down to one good answer.",
};

/** Renders very light markdown (**bold** and - bullets) from mocked replies. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        const isBullet = line.trimStart().startsWith("- ");
        const body = isBullet ? line.trimStart().slice(2) : line;
        const parts = body.split(/\*\*(.+?)\*\*/g);
        const rendered = parts.map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="font-medium text-foreground">
              {part}
            </strong>
          ) : (
            <span key={j}>{part}</span>
          ),
        );
        if (!body.trim()) return <span key={i} className="block h-2" />;
        return isBullet ? (
          <span key={i} className="mt-1 block pl-4 -indent-4">
            <span aria-hidden>· </span>
            {rendered}
          </span>
        ) : (
          <span key={i} className="mt-1 block first:mt-0">
            {rendered}
          </span>
        );
      })}
    </>
  );
}

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, thinking]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Mocked round-trip — swap this for a streaming AI endpoint later.
 async function send(text: string) {
  const prompt = text.trim();

  if (!prompt || thinking) return;

  setThinking(true);

  const userMessage: ChatMessage = {
    id: `u-${Date.now()}`,
    role: "user",
    content: prompt,
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  try {
    const history = messages
      .filter((message) => message.id !== "greeting")
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    const result = await askGroq({
      data: {
        message: prompt,
        history,
      },
    });

    if (result.error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: result.error ?? "Something went wrong.",
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: result.reply ?? "I couldn't generate a response right now.",
      },
    ]);
  } catch (error) {
    console.error("Assistant request failed:", error);

    setMessages((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: "assistant",
        content:
          "Sorry, I couldn't connect to the Sprocktd Companion right now. Please try again.",
      },
    ]);
  } finally {
    setThinking(false);
  }
}

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="sprocktd-assistant"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-border-strong bg-surface/80 px-4 py-3 text-sm text-foreground shadow-[var(--shadow-soft)] backdrop-blur-xl transition-colors hover:border-primary sm:bottom-7 sm:right-7"
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
          aria-label="Sprocktd AI assistant"
          className="fixed inset-x-3 bottom-20 z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-border bg-background/95 shadow-[var(--shadow-soft)] backdrop-blur-2xl sm:inset-x-auto sm:right-7 sm:bottom-24 sm:w-[26rem] rise"
        >
          <header className="flex items-center gap-3 border-b border-border px-5 py-4">
            <SprocktdMark title="" className="h-6 w-6 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="truncate font-display text-base font-normal">Sprocktd Companion</p>
              <p className="truncate text-xs text-muted-foreground">
                Preview — responses are illustrative
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </header>

          <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((msg) => (
              <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "max-w-[95%] text-sm leading-relaxed text-muted-foreground"
                  }
                >
                  <RichText text={msg.content} />
                </div>
              </div>
            ))}
            {thinking ? (
              <p className="text-sm text-muted-foreground" aria-live="polite">
                <span className="inline-block animate-pulse">Thinking…</span>
              </p>
            ) : null}
          </div>

          {messages.length <= 1 ? (
            <div className="px-5 pb-3">
              <p className="eyebrow">Try asking</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {assistantPrompts.map((p) => (
                  <li key={p}>
                    <button
                      type="button"
                      onClick={() => send(p)}
                      className="rounded-full border border-border bg-surface px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                    >
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-3"
          >
            <div className="flex items-end gap-2 rounded-xl border border-border bg-surface px-3 py-2 focus-within:border-primary">
              <label htmlFor="assistant-input" className="sr-only">
                Ask the Sprocktd companion
              </label>
              <textarea
                id="assistant-input"
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          e.stopPropagation();
                    send(input);
                                                          }
            }}
                placeholder="Ask for a recommendation…"
                className="max-h-28 min-h-[1.5rem] flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                aria-label="Send message"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <ArrowUp aria-hidden className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
