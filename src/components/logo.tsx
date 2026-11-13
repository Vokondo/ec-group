import { cn } from "@/lib/utils";

// The round "ec" logo (public/logo.svg). A faint ring keeps its dark circle visible on dark backgrounds.
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo.svg`}
      alt=""
      aria-hidden
      className={cn("size-9 shrink-0 rounded-full dark:ring-1 dark:ring-white/20", className)}
    />
  );
}
