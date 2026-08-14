import { useCallback, useState } from "react";

import { askGroq } from "@/lib/groq.functions";
import { HISTORY_LIMIT, MAX_MESSAGE_LENGTH, type ChatMessage } from "./types";

const greeting: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "I'm the Sprocktd companion. Tell me a mood, a film you loved, or how much time you have — I'll narrow the archive down to one good answer.",
};


export function useCompanionChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);

  const send = useCallback(
    async (text: string) => {
      const prompt = text.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!prompt || thinking) return;

      setError(null);
      setLastPrompt(prompt);
      setThinking(true);

      const history = messages
        .filter((m) => m.id !== "greeting")
        .slice(-HISTORY_LIMIT)
        .map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: "user", content: prompt },
      ]);

      try {
        const result = await askGroq({ data: { message: prompt, history } });

        if (result.error || !result.reply) {
          setError(result.error ?? "The companion couldn't answer that. Try again.");
          return;
        }

        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", content: result.reply },
        ]);
      } catch (err) {
        console.error("Companion request failed:", err);
        setError("Couldn't reach the Sprocktd Companion. Check your connection and try again.");
      } finally {
        setThinking(false);
      }
    },
    [messages, thinking],
  );

  const retry = useCallback(() => {
    if (!lastPrompt) return;

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      return last && last.role === "user" ? prev.slice(0, -1) : prev;
    });
    void send(lastPrompt);
  }, [lastPrompt, send]);

  const isEmpty = messages.length <= 1;

  return { messages, thinking, error, send, retry, isEmpty };
}
