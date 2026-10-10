import { Link } from "react-router";
import { cn } from "@/lib/utils";

// Small, square-cornered link-button with monospace uppercase text and a ▸ marker.
const VARIANTS = {
  // Steel blue for primary actions, as in the reference.
  solid: "border-brand bg-brand text-brand-foreground hover:bg-brand/85",
  "outline-dark": "border-white/40 text-white hover:border-white/70 hover:bg-white/10",
  "outline-light": "border-foreground/25 bg-card text-foreground hover:border-foreground/50",
  pill: "rounded-full border-transparent bg-white px-6 text-ink shadow-sm hover:bg-white/90 sm:px-8",
};

export function MonoLink({
  to,
  children,
  variant = "solid",
  arrow = true,
  className,
}: {
  to: string;
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-[3px] border px-3 font-mono text-[10px] tracking-[0.18em] uppercase transition sm:h-9 sm:px-4 sm:text-[11px]",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
      {arrow && (
        <span aria-hidden className="text-[7px] sm:text-[8px]">
          ▶
        </span>
      )}
    </Link>
  );
}

// Tiny monospace section label used above headings, e.g. "OUR BUSINESSES".
export function MonoLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("font-mono text-[10px] tracking-[0.25em] uppercase opacity-60", className)}>{children}</p>;
}

// Headline whose phrases alternate tones, as in the reference's "Our materials are a part of something bigger".
const TONES = {
  base: undefined,
  steel: "text-steel",
  soft: "text-foreground/35",
  warm: "text-warm",
};

export function TwoTone({ parts }: { parts: [string, keyof typeof TONES][] }) {
  return (
    <>
      {parts.map(([text, tone], i) => (
        <span key={i} className={TONES[tone]}>
          {text}
        </span>
      ))}
    </>
  );
}
