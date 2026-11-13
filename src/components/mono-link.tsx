import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { monoButtonClass, type MonoVariant } from "@/lib/mono-button";

// Small, square-cornered link-button with monospace uppercase text.
export function MonoLink({
  to,
  children,
  variant = "solid",
  className,
}: {
  to: string;
  children: React.ReactNode;
  variant?: MonoVariant;
  className?: string;
}) {
  return (
    <Link to={to} className={monoButtonClass(variant, className)}>
      {children}
    </Link>
  );
}

// Tiny monospace section label used above headings, e.g. "OUR BUSINESSES".
export function MonoLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("font-mono text-[10px] tracking-[0.25em] uppercase opacity-60", className)}>{children}</p>;
}
