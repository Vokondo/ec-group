import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { withBase } from "@/lib/media";

type PlaceholderVariant = "center" | "compact" | "corner" | "top";

// Fills its nearest positioned (and `isolate`d) parent with a photo, or with a placeholder
// until a photo is supplied (see src/media/README.md). `slot` names the file that fills it, shown on
// the placeholder while developing locally.
export function CoverImage({
  src,
  alt = "",
  overlay = "from-black/80 via-black/20 to-black/30",
  variant = "center",
  slot,
}: {
  src?: string;
  alt?: string;
  // Gradient that keeps text on top of the image legible.
  overlay?: string;
  // Where the placeholder label sits: "corner" (bottom-right) and "top" (top-right, below the header)
  // keep it clear of large banner text.
  variant?: PlaceholderVariant;
  slot?: string;
}) {
  return (
    <>
      {src ? (
        <img
          src={withBase(src)}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 -z-20 size-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <ImagePlaceholder variant={variant} slot={slot} />
      )}
      <div aria-hidden className={cn("absolute inset-0 -z-10 bg-gradient-to-t", overlay)} />
    </>
  );
}

export function ImagePlaceholder({ variant = "center", slot }: { variant?: PlaceholderVariant; slot?: string }) {
  // Locally, name the file that belongs here; visitors only ever see "Image placeholder".
  const showSlot = import.meta.env.DEV && Boolean(slot);
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 -z-20 flex bg-ink bg-[linear-gradient(135deg,rgb(255_255_255/0.04)_25%,transparent_25%,transparent_50%,rgb(255_255_255/0.04)_50%,rgb(255_255_255/0.04)_75%,transparent_75%)] bg-[length:24px_24px]",
        variant === "corner" ? "items-end justify-end p-5" : variant === "top" ? "items-start justify-end px-5 pt-6" : "items-center justify-center",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 text-white/35",
          variant === "corner" || variant === "top" ? "flex-row" : "flex-col",
          variant === "center" && "-translate-y-6",
          variant === "compact" && "-translate-y-2",
        )}
      >
        <ImageIcon strokeWidth={1.25} className={variant === "center" ? "size-9" : "size-5"} />
        {/* Small tiles show the icon only, so the label never collides with tile text */}
        {variant !== "compact" &&
          (showSlot ? (
            <span className="text-[11px] tracking-wide">{slot}</span>
          ) : (
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase">Image placeholder</span>
          ))}
        {variant === "compact" && showSlot && <span className="text-[9px] tracking-wide">{slot}</span>}
      </div>
    </div>
  );
}
