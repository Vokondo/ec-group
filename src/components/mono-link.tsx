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

// Small section label used above headings on the home page; matches Eyebrow.
export function MonoLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[13px] font-medium opacity-70", className)}>{children}</p>
  );
}
