import { cn } from "@/lib/utils";

// Styles for the small, square-cornered monospace buttons used across the site.
const VARIANTS = {
  // Steel blue for primary actions, as in the reference.
  solid: "border-brand bg-brand text-brand-foreground hover:bg-brand/85",
  "outline-dark": "border-white/40 text-white hover:border-white/70 hover:bg-white/10",
  "outline-light": "border-foreground/25 bg-card text-foreground hover:border-foreground/50",
  pill: "rounded-full border-transparent bg-white px-6 text-ink shadow-sm hover:bg-white/90 sm:px-8",
};

export type MonoVariant = keyof typeof VARIANTS;

// Shared by MonoLink and by real <button>s (e.g. form submits) so both look the same.
export const monoButtonClass = (variant: MonoVariant = "solid", className?: string) =>
  cn(
    "inline-flex h-8 items-center justify-center gap-2 rounded-[3px] border px-3 font-mono text-[10px] tracking-[0.18em] uppercase transition disabled:pointer-events-none disabled:opacity-50 sm:h-9 sm:px-4 sm:text-[11px]",
    VARIANTS[variant],
    className,
  );
