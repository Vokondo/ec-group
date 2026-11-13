import { cn } from "@/lib/utils";

// Styles for the buttons used across the site.
const VARIANTS = {
  // Black for primary actions; the faint light border keeps it visible on dark photos and panels.
  solid: "border-white/20 bg-brand text-brand-foreground hover:bg-brand/80",
  "outline-dark": "border-white/40 text-white hover:border-white/70 hover:bg-white/10",
  "outline-light": "border-foreground/25 bg-white/50 text-foreground backdrop-blur-md hover:border-foreground/50 hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10",
  pill: "rounded-full border-white/70 bg-white/60 px-6 text-ink shadow-sm backdrop-blur-md hover:bg-white/80 sm:px-8",
};

export type MonoVariant = keyof typeof VARIANTS;

// Shared by MonoLink and by real <button>s (e.g. form submits) so both look the same.
export const monoButtonClass = (variant: MonoVariant = "solid", className?: string) =>
  cn(
    "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 sm:px-5",
    VARIANTS[variant],
    className,
  );
