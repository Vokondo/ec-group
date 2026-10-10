import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { CoverImage } from "@/components/business-image";

// The founder's portrait, shared by the home page founder card and the Founder page.
// Set `founderImage` in src/lib/site.ts to show a photo; until then a "Founder portrait" placeholder shows.
export function FounderPortrait({ className }: { className?: string }) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      {SITE.founderImage ? (
        <CoverImage src={SITE.founderImage} alt={SITE.founderName} overlay="from-transparent" />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-sm text-neutral-500">
          Founder portrait
        </div>
      )}
    </div>
  );
}
