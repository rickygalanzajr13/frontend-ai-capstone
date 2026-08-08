import { createServerFn } from "@tanstack/react-start";

type GroqMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const SYSTEM_PROMPT = `You are the Sprocktd Companion, an AI movie recommendation assistant.

Sprocktd helps people discover movies based on their mood, interests, favorite films, available time, and preferences.

Your job is to give useful, concise movie recommendations and help users decide what to watch.

Guidelines:
- Be conversational and helpful.
- Keep responses concise and easy to scan.
- When recommending movies, explain briefly why each movie fits.
- Do not invent movie information.
- If you are unsure about a specific movie fact, say so.
- Prefer a small number of strong recommendations rather than a huge list.
- Use simple markdown when helpful, especially **bold** text and bullet points.
`;

async function groqChat(messages: GroqMessage[]) {
  const apiKey = process.env["GROQ_API_KEY"];

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Groq request failed [${response.status}]: ${await response.text()}`,
    );
  }

  return (await response.json()) as GroqResponse;
}

export const askGroq = createServerFn({ method: "POST" })
  .inputValidator((input: { message: string; history?: GroqMessage[] }) => ({
    message: String(input.message ?? "").slice(0, 1000).trim(),
    history: Array.isArray(input.history)
      ? input.history.slice(-10)
      : [],
  }))
  .handler(async ({ data }) => {
    if (!data.message) {
      return {
        reply: "",
        error: "Please enter a message.",
      };
    }

    try {
      const messages: GroqMessage[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...data.history,
        { role: "user", content: data.message },
      ];

      const json = await groqChat(messages);

      const reply = json.choices?.[0]?.message?.content?.trim();

      if (!reply) {
        return {
          reply: "",
          error: "The AI assistant did not return a response.",
        };
      }

      return {
        reply,
        error: null as string | null,
      };
    } catch (err) {
      console.error("Groq assistant error:", err);

      return {
        reply: "",
        error: "The Sprocktd Companion is unavailable right now.",
      };
    }
  });