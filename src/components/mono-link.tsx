import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { monoButtonClass, type MonoVariant } from "@/lib/mono-button";

// Small, square-cornered link-button with monospace uppercase text and a ▸ marker.
export function MonoLink({
  to,
  children,
  variant = "solid",
  arrow = true,
  className,
}: {
  to: string;
  children: React.ReactNode;
  variant?: MonoVariant;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link to={to} className={monoButtonClass(variant, className)}>
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
