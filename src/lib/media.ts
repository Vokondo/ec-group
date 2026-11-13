// Photos dropped into src/media/<business-slug>/ appear on the site automatically, matched by
// file name (any of .jpg, .jpeg, .png, .webp, .avif). See src/media/README.md for every slot.
const files = import.meta.glob("/src/media/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const bySlot = new Map<string, string>();
for (const [path, url] of Object.entries(files)) {
  const match = path.match(/\/src\/media\/([^/]+)\/([^/]+)\.\w+$/);
  if (match) bySlot.set(`${match[1]}/${match[2].toLowerCase()}`, url);
}

// The photo for a slot, e.g. media("green-foods", "gallery-2"), or undefined if none was added.
export const media = (folder: string, slot: string) => bySlot.get(`${folder}/${slot}`);

// Where a slot's photo goes, shown on placeholders while developing locally.
export const mediaPath = (folder: string, slot: string) => `src/media/${folder}/${slot}.jpg`;

// Prefixes root-relative paths ("/images/...") with the deploy base path. Photos from src/media
// already carry it once built, so they are left alone.
export const withBase = (src: string) => {
  const base = import.meta.env.BASE_URL;
  if (!src.startsWith("/") || (base !== "/" && src.startsWith(base))) return src;
  return base + src.slice(1);
};
