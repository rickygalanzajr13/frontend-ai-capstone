export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};


export const starterPrompts = [
  "Recommend a movie for tonight",
  "Something like Parasite",
  "Give me an atmospheric thriller",
  "I want a movie that will make me think",
] as const;

export const MAX_MESSAGE_LENGTH = 1000;
export const HISTORY_LIMIT = 10;
