import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaceholderVariant = "center" | "compact" | "corner";

// Fills its nearest positioned (and `isolate`d) parent with a photo, or with a placeholder
// until a photo is supplied. Set `image` on a business (or offering) in src/lib/site.ts.
export function CoverImage({
  src,
  alt = "",
  overlay = "from-black/80 via-black/20 to-black/30",
  variant = "center",
}: {
  src?: string;
  alt?: string;
  // Gradient that keeps text on top of the image legible.
  overlay?: string;
  // Where the placeholder label sits: "corner" keeps it clear of large banner text.
  variant?: PlaceholderVariant;
}) {
  return (
    <>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 -z-20 size-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <ImagePlaceholder variant={variant} />
      )}
      <div aria-hidden className={cn("absolute inset-0 -z-10 bg-gradient-to-t", overlay)} />
    </>
  );
}

export function ImagePlaceholder({ variant = "center" }: { variant?: PlaceholderVariant }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 -z-20 flex bg-neutral-800 bg-[linear-gradient(135deg,rgb(255_255_255/0.04)_25%,transparent_25%,transparent_50%,rgb(255_255_255/0.04)_50%,rgb(255_255_255/0.04)_75%,transparent_75%)] bg-[length:24px_24px]",
        variant === "corner" ? "items-end justify-end p-5" : "items-center justify-center",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 text-white/35",
          variant === "corner" ? "flex-row" : "flex-col",
          variant === "center" && "-translate-y-6",
          variant === "compact" && "-translate-y-2",
        )}
      >
        <ImageIcon strokeWidth={1.25} className={variant === "center" ? "size-9" : "size-5"} />
        {/* Small tiles show the icon only, so the label never collides with tile text */}
        {variant !== "compact" && <span className="text-[10px] font-medium tracking-[0.2em] uppercase">Image placeholder</span>}
      </div>
    </div>
  );
}
