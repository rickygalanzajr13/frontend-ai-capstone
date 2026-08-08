import rain from "@/assets/collection-rain.jpg";
import oneRoom from "@/assets/collection-oneroom.jpg";
import cinema from "@/assets/collection-cinema.jpg";
import quiet from "@/assets/collection-quiet.jpg";
import { SectionHeading } from "./SectionHeading";

const collections = [
  {
    title: "Great Rain Scenes",
    description: "Downpours that carry the weight a script won't say out loud.",
    count: 24,
    curator: "by mireille",
    src: rain,
  },
  {
    title: "Best One-Room Films",
    description: "Single spaces, rising pressure, nowhere left to look.",
    count: 18,
    curator: "by oskar_v",
    src: oneRoom,
  },
  {
    title: "Movies That Changed Cinema",
    description: "Films after which the medium simply worked differently.",
    count: 41,
    curator: "by the archive",
    src: cinema,
  },
  {
    title: "Quiet Masterpieces",
    description: "Restraint as an argument. Very little happens, entirely.",
    count: 33,
    curator: "by hana.k",
    src: quiet,
  },
];

export function CommunityCollections() {
  return (
    <section
      id="collections"
      className="border-t border-border bg-surface/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Community collections"
          title="Assembled by people who watch closely."
          description="Collections are edited, argued over, and revised — closer to a reading list than a queue."
          action="All collections"
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {collections.map((c) => (
            <li key={c.title}>
              <a
                href="#collections"
                className="group block overflow-hidden rounded-lg border border-border bg-background transition-colors duration-300 hover:border-border-strong"
              >
                <img
                  src={c.src}
                  alt={`Cover image for ${c.title}`}
                  loading="lazy"
                  width={960}
                  height={640}
                  className="aspect-[16/9] w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 p-6">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-normal">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {c.description}
                    </p>
                    <p className="mt-4 text-xs text-muted-foreground">{c.curator}</p>
                  </div>
                  <span className="shrink-0 rounded-sm border border-border px-2 py-1 text-[11px] text-muted-foreground">
                    {c.count} films
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
