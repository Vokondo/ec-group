import { cn } from "@/lib/utils";
import { withBase } from "@/lib/media";

// A business logo on a small white tile, so dark and coloured logos read on photos and dark panels.
// Set the height with className (e.g. "h-14"); the logo keeps its proportions inside.
export function BrandMark({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-lg bg-white px-3 py-2 shadow-sm", className)}>
      <img src={withBase(src)} alt={alt} className="h-full w-auto object-contain" />
    </span>
  );
}
