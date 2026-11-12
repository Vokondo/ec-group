import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const withBase = (src: string) => (src.startsWith("/") ? import.meta.env.BASE_URL + src.slice(1) : src);

// Soft grey product frame with the photo filling it, or a light placeholder until one is set.
export function ProductImage({
  src,
  alt,
  className,
  zoom = true,
  eager,
}: {
  src?: string;
  alt: string;
  className?: string;
  zoom?: boolean;
  eager?: boolean;
}) {
  return (
    <div className={cn("relative isolate overflow-hidden rounded-2xl bg-muted", className)}>
      {src ? (
        <img
          src={withBase(src)}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          className={cn("absolute inset-0 size-full object-cover", zoom && "transition duration-500 group-hover:scale-105")}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 grid place-items-center text-muted-foreground/50">
          <ImageIcon strokeWidth={1.25} className="size-8" />
        </div>
      )}
    </div>
  );
}
