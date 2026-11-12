import { cn } from "@/lib/utils";
import { CATALOG, getBusiness, type Offering } from "@/lib/site";

// Rounded, high-contrast buttons used across the shop (Service Center, product pages, cart, checkout).
// "solid" is near-black in light mode and white in dark mode.
const PILL = {
  solid: "bg-foreground text-background hover:bg-foreground/85",
  outline: "border border-foreground/15 bg-card text-foreground hover:border-foreground/40",
  ghost: "text-foreground hover:bg-muted",
};

export const pillClass = (variant: keyof typeof PILL = "solid", size: "sm" | "md" | "lg" = "md", className?: string) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
    size === "sm" && "h-9 px-4 text-xs",
    size === "md" && "h-10 px-5 text-sm",
    size === "lg" && "h-12 px-6 text-sm sm:h-13 sm:text-base",
    PILL[variant],
    className,
  );

export const findOffering = (id: string | undefined) => CATALOG.find((o) => o.id === id);

export const isPurchasable = (o: Offering) => o.kind === "product" && o.price !== null && (o.status === "available" || !!o.sample);
export const isBookable = (o: Offering) => o.kind === "service" && o.business === "barbering-shop";

// An offering's own photo, falling back to its business's photo.
export const offeringImage = (o: Offering | undefined) => o?.image ?? (o ? getBusiness(o.business)?.image : undefined);

// Every photo for the product page: the offering's gallery, else its main photo.
export const offeringPhotos = (o: Offering): { src: string; label?: string }[] => {
  if (o.gallery?.length) return o.gallery;
  const main = offeringImage(o);
  return main ? [{ src: main }] : [];
};

// Where the secondary action of a non-purchasable offering leads.
export const offeringAction = (o: Offering) =>
  isBookable(o)
    ? { label: "Book appointment", to: `/service-center/booking?business=${o.business}` }
    : { label: "Register interest", to: `/service-center/interest?business=${o.business}` };

export const offeringPath = (o: Offering) => `/service-center/${o.id}`;
