import { createServerFn } from "@tanstack/react-start";

export type OmdbSearchItem = {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
};

export type OmdbFilm = {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Poster: string;
  imdbRating: string;
  imdbVotes?: string;
  Metascore?: string;
  Awards?: string;
  BoxOffice?: string;
  Production?: string;
  Ratings?: { Source: string; Value: string }[];
  Response: string;
};

async function omdb(params: Record<string, string>) {
  const apiKey = process.env["OMDB_API_KEY"];
  if (!apiKey) throw new Error("OMDB_API_KEY is not configured");
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", apiKey);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`OMDb request failed [${res.status}]: ${await res.text()}`);
  }
  return (await res.json()) as Record<string, unknown>;
}

export const searchFilms = createServerFn({ method: "GET" })
  .inputValidator((input: { query: string; page?: number }) => ({
    query: String(input.query ?? "").slice(0, 100).trim(),
    page: Math.min(Math.max(Number(input.page ?? 1) || 1, 1), 100),
  }))
  .handler(async ({ data }) => {
    if (!data.query) return { results: [] as OmdbSearchItem[], total: 0, error: null };
    try {
      const json = await omdb({
        s: data.query,
        type: "movie",
        page: String(data.page),
      });
      if (json["Response"] === "False") {
        return {
          results: [] as OmdbSearchItem[],
          total: 0,
          error: String(json["Error"] ?? "No results"),
        };
      }
      return {
        results: (json["Search"] as OmdbSearchItem[]) ?? [],
        total: Number(json["totalResults"] ?? 0),
        error: null as string | null,
      };
    } catch (err) {
      console.error(err);
      return { results: [] as OmdbSearchItem[], total: 0, error: "Search is unavailable right now." };
    }
  });

export const getFilm = createServerFn({ method: "GET" })
  .inputValidator((input: { imdbID: string }) => ({
    imdbID: String(input.imdbID ?? "").slice(0, 20),
  }))
  .handler(async ({ data }) => {
    try {
      const json = await omdb({ i: data.imdbID, plot: "full" });
      if (json["Response"] === "False") return { film: null, error: String(json["Error"] ?? "Not found") };
      return { film: json as unknown as OmdbFilm, error: null as string | null };
    } catch (err) {
      console.error(err);
      return { film: null, error: "Film details are unavailable right now." };
    }
  });

export const getPosters = createServerFn({ method: "GET" })
  .inputValidator((input: { ids: string[] }) => ({
    ids: (Array.isArray(input.ids) ? input.ids : []).slice(0, 12).map((id) => String(id).slice(0, 20)),
  }))
  .handler(async ({ data }) => {
    const entries = await Promise.all(
      data.ids.map(async (id) => {
        try {
          const json = await omdb({ i: id });
          const poster = String(json["Poster"] ?? "N/A");
          return [id, poster] as const;
        } catch {
          return [id, "N/A"] as const;
        }
      }),
    );
    return { posters: Object.fromEntries(entries) as Record<string, string> };
  });

  export const getGenres = createServerFn({ method: "GET" })
  .inputValidator((input: { ids: string[] }) => ({
    ids: (Array.isArray(input.ids) ? input.ids : []).slice(0, 24).map((id) => String(id).slice(0, 20)),
  }))
  .handler(async ({ data }) => {
    const entries = await Promise.all(
      data.ids.map(async (id) => {
        try {
          const json = await omdb({ i: id });
          const genre = String(json["Genre"] ?? "");
          return [id, genre] as const;
        } catch {
          return [id, ""] as const;
        }
      }),
    );
    return { genres: Object.fromEntries(entries) as Record<string, string> };
  });
