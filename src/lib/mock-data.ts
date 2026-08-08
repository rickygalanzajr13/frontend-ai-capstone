/**
 * Placeholder content for Sprocktd's UI-only surfaces.
 * No backend, no persistence — swap these for real data later.
 */

export type MockMovie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  note?: string;
};

/** Posters are hydrated client-side from OMDb (see usePosters); "N/A" renders a title tile. */
function m(imdbID: string, Title: string, Year: string, note?: string): MockMovie {
  return note
    ? { imdbID, Title, Year, Poster: "N/A", note }
    : { imdbID, Title, Year, Poster: "N/A" };
}

export type MockCollection = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  curator: string;
  films: MockMovie[];
};

export const collections: MockCollection[] = [
  {
    slug: "hidden-gems",
    title: "Hidden Gems",
    tagline: "Quietly brilliant, rarely mentioned",
    description:
      "Films that never found their crowd on release and have been waiting patiently ever since.",
    curator: "curated by the archive",
    films: [
      m("tt0338013", "Eternal Sunshine of the Spotless Mind", "2004"),
      m("tt0119174", "The Game", "1997"),
      m("tt1798709", "Her", "2013"),
      m("tt0405159", "Million Dollar Baby", "2004"),
      m("tt2543164", "Arrival", "2016"),
      m("tt0421715", "The Curious Case of Benjamin Button", "2008"),
    ],
  },
  {
    slug: "mind-bending",
    title: "Mind-Bending Films",
    tagline: "Structures that fold in on themselves",
    description:
      "Narratives built like puzzle boxes — best watched twice, discussed for years.",
    curator: "curated by oskar_v",
    films: [
      m("tt1375666", "Inception", "2010"),
      m("tt0209144", "Memento", "2000"),
      m("tt0816692", "Interstellar", "2014"),
      m("tt0246578", "Donnie Darko", "2001"),
      m("tt0910970", "WALL·E", "2008"),
      m("tt1856101", "Blade Runner 2049", "2017"),
    ],
  },
  {
    slug: "oscar-winners",
    title: "Oscar Winners",
    tagline: "Best Picture, across the decades",
    description: "The films the Academy chose — and the ones that actually held up.",
    curator: "curated by the archive",
    films: [
      m("tt6751668", "Parasite", "2019"),
      m("tt0468569", "The Dark Knight", "2008"),
      m("tt0111161", "The Shawshank Redemption", "1994"),
      m("tt0068646", "The Godfather", "1972"),
      m("tt7286456", "Joker", "2019"),
      m("tt0169547", "American Beauty", "1999"),
    ],
  },
  {
    slug: "studio-ghibli",
    title: "Studio Ghibli",
    tagline: "Hand-drawn worlds, unhurried",
    description:
      "Wind, food, flight and grief. The full run of Ghibli's most beloved features.",
    curator: "curated by hana.k",
    films: [
      m("tt0245429", "Spirited Away", "2001"),
      m("tt0347149", "Howl's Moving Castle", "2004"),
      m("tt0096283", "My Neighbor Totoro", "1988"),
      m("tt0095327", "Grave of the Fireflies", "1988"),
      m("tt0119698", "Princess Mononoke", "1997"),
      m("tt0087544", "Nausicaä of the Valley of the Wind", "1984"),
    ],
  },
  {
    slug: "best-plot-twists",
    title: "Best Plot Twists",
    tagline: "The floor drops out",
    description: "Go in cold. Every one of these earns its final turn.",
    curator: "curated by mireille",
    films: [
      m("tt0167404", "The Sixth Sense", "1999"),
      m("tt0137523", "Fight Club", "1999"),
      m("tt0114814", "The Usual Suspects", "1995"),
      m("tt0482571", "The Prestige", "2006"),
      m("tt0209144", "Memento", "2000"),
      m("tt2267998", "Gone Girl", "2014"),
    ],
  },
  {
    slug: "under-90-minutes",
    title: "Movies Under 90 Minutes",
    tagline: "Short, sharp, complete",
    description: "Everything you need, nothing you don't. All in under an hour and a half.",
    curator: "curated by the archive",
    films: [
      m("tt0910970", "WALL·E", "2008"),
      m("tt0116629", "Before Sunrise", "1995"),
      m("tt1049413", "Up", "2009"),
      m("tt0032138", "The Wizard of Oz", "1939"),
      m("tt0107048", "Groundhog Day", "1993"),
      m("tt0245429", "Spirited Away", "2001"),
    ],
  },
];

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export const watchlistPlaceholder: MockMovie[] = [
  m("tt15398776", "Oppenheimer", "2023", "Saved 2 days ago"),
  m("tt1160419", "Dune", "2021", "Saved last week"),
  m("tt0816692", "Interstellar", "2014", "Saved last week"),
  m("tt6751668", "Parasite", "2019", "Saved in March"),
  m("tt2543164", "Arrival", "2016", "Saved in March"),
];

export const profile = {
  username: "aurelia.k",
  displayName: "Aurelia Kim",
  bio: "Chasing quiet endings and long takes. Mostly watching 70s thrillers this month.",
  joined: "Joined March 2024",
  favouriteGenres: ["Drama", "Sci-Fi", "Neo-Noir", "Animation", "Documentary"],
  stats: [
    { label: "Movies watched", value: "412" },
    { label: "Watchlist", value: "38" },
    { label: "Favourites", value: "27" },
    { label: "Collections", value: "9" },
  ],
  favourites: [
    m("tt0245429", "Spirited Away", "2001"),
    m("tt6751668", "Parasite", "2019"),
    m("tt0482571", "The Prestige", "2006"),
    m("tt1798709", "Her", "2013"),
    m("tt2543164", "Arrival", "2016"),
  ],
  recentlyViewed: [
    m("tt0816692", "Interstellar", "2014"),
    m("tt1375666", "Inception", "2010"),
    m("tt0468569", "The Dark Knight", "2008"),
    m("tt1856101", "Blade Runner 2049", "2017"),
    m("tt0209144", "Memento", "2000"),
  ],
};

export const recentSearches = [
  "Interstellar",
  "Wong Kar-wai",
  "Neo-noir",
  "Dune",
  "Studio Ghibli",
];

export const searchSuggestions = [
  "Blade Runner 2049",
  "Parasite",
  "Arrival",
  "The Prestige",
  "Spirited Away",
  "Oppenheimer",
  "Memento",
  "Her",
  "Whiplash",
  "Dune",
  "Inception",
  "The Godfather",
];

export const assistantPrompts = [
  "Recommend a movie like Interstellar",
  "Suggest a horror movie under 2 hours",
  "What should I watch tonight?",
  "Explain why people love this movie",
  "Recommend movies based on my mood",
];

const fallbackReplies = [
  "Here's where I'd start: **Arrival** (2016). Same patient awe as your favourites, but it trades spectacle for grief and language. Pair it with **Under the Skin** if you want the colder version of that feeling.",
  "Three that fit, in order of how safe they are: **The Prestige** (tight, twisty), **Enemy** (slow and strange), **Coherence** (one room, no budget, ruthless idea).",
  "Give me a mood — restless, tender, or wide awake at 2am — and I'll narrow it to one film instead of five.",
];

/** Deterministic mocked assistant replies. Replace with a real model later. */
export function mockAssistantReply(prompt: string): string {
  const q = prompt.toLowerCase();

  if (q.includes("interstellar") || q.includes("like ")) {
    return "If **Interstellar** is the reference point, try **Arrival** (2016) for the same ache at a smaller scale, **Contact** (1997) for the science-as-faith argument, and **Ad Astra** (2019) if you want the father-son thread pulled tight. All three are on the archive — open any one for its themes.";
  }
  if (q.includes("horror")) {
    return "Under two hours, all genuinely unsettling: **Hereditary** is the heavyweight, **The Witch** the slowest burn, **Talk to Me** the most modern, and **Session 9** the one nobody warns you about. Start with **The Witch** if you'd rather be uneasy than startled.";
  }
  if (q.includes("tonight") || q.includes("watch now")) {
    return "Tonight I'd say **Past Lives** — 106 minutes, no homework required, and it will sit with you for a week. If you want something with more pulse, **Sicario**. If you want to laugh, **Paddington 2**, unironically.";
  }
  if (q.includes("why") || q.includes("explain")) {
    return "People tend to love it for one specific reason: it makes a structural idea feel emotional. The formal trick — the timeline, the reveal, the framing — isn't decoration; it *is* the feeling. That's rare, and it's why the film keeps getting rewatched rather than just remembered.";
  }
  if (q.includes("mood") || q.includes("feel")) {
    return "Tell me which one you're in and I'll pick:\n\n- **Restless** → *Uncut Gems*\n- **Tender** → *In the Mood for Love*\n- **Curious** → *Everything Everywhere All at Once*\n- **Numb** → *Paterson*\n- **Wide awake** → *Mulholland Drive*";
  }

  const index = Math.abs(prompt.length) % fallbackReplies.length;
  return fallbackReplies[index] as string;
}
