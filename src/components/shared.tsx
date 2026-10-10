import { cn } from "@/lib/utils";
import type { BusinessStatus } from "@/lib/site";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs font-semibold tracking-[0.2em] uppercase opacity-60", className)}>{children}</p>;
}

// Two-column heading used throughout, mirroring the reference layout:
// big title on the left, short intro + actions on the right.
export function SectionHeading({
  eyebrow,
  title,
  intro,
  actions,
  center,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  actions?: React.ReactNode;
  center?: boolean;
}) {
  if (center) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        <h2 className="text-2xl font-medium tracking-tight sm:text-3xl lg:text-4xl">{title}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
        {actions && <div className="mt-6 flex justify-center gap-3">{actions}</div>}
      </div>
    );
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
      <div>
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        <h2 className="max-w-lg text-2xl font-medium tracking-tight sm:text-3xl lg:text-4xl">{title}</h2>
      </div>
      {(intro || actions) && (
        <div className="lg:max-w-md lg:justify-self-end">
          {intro && <p className="text-sm text-muted-foreground">{intro}</p>}
          {actions && <div className="mt-4 flex flex-wrap gap-3">{actions}</div>}
        </div>
      )}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(1_0_0/0.12),transparent_60%)]"
      />
      <Container className="relative pt-28 pb-12 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <h1 className="max-w-3xl text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-sm text-white/70 sm:mt-5 sm:text-base">{intro}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </Container>
    </section>
  );
}

export function StatusBadge({ status, onDark }: { status: BusinessStatus; onDark?: boolean }) {
  const available = status === "available";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        onDark ? "bg-white/15 text-white backdrop-blur" : available ? "bg-foreground text-background" : "bg-muted text-foreground",
      )}
    >
      <span className={cn("size-1.5 rounded-full", available ? "bg-current" : "border border-current")} />
      {available ? "Available now" : "In development"}
    </span>
  );
}

// Shared class strings for links styled as buttons on dark backgrounds.
export const onDarkPrimary = "rounded-full bg-brand px-5 text-brand-foreground hover:bg-brand/85";
export const onDarkOutline = "rounded-full border-white/50 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white";
