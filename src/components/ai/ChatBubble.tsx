import type { ChatMessage } from "./types";


export function RichText({ text }: { text: string }) {
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

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={isUser ? "flex justify-end" : ""}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
            : "max-w-[95%] text-sm leading-relaxed text-muted-foreground"
        }
      >
        <RichText text={message.content} />
      </div>
    </div>
  );
}
