import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

export function BigSearch({
  placeholder = "Search a title, a director, a feeling…",
  autoFocus = false,
}: {
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (q) void navigate({ to: "/search", search: { q } });
      }}
      className="relative w-full"
    >
      <label htmlFor="big-search" className="sr-only">
        Search films
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
      />
      <input
        id="big-search"
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-border bg-surface/70 py-4 pl-14 pr-28 text-base text-foreground shadow-[var(--shadow-soft)] backdrop-blur-xl outline-none transition-colors placeholder:text-muted-foreground focus:border-primary sm:py-5"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}
