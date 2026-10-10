import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { CalendarCheckIcon, CheckIcon, ChevronDownIcon, SearchIcon, ShoppingBagIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESSES, CATALOG, KIND_LABELS, formatPrice, getBusiness, type Offering, type OfferingKind } from "@/lib/site";
import { Button, buttonVariants } from "@/components/ui/button";
import { CoverImage } from "@/components/business-image";
import { StatusBadge } from "@/components/shared";
import { Mosaic, type MosaicSize } from "@/components/mosaic";
import { useCart } from "@/components/cart-provider";

type KindFilter = OfferingKind | "all";

// Native select styled as a soft pill; on phones it opens the system picker.
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full cursor-pointer appearance-none rounded-full bg-muted/70 pr-9 pl-4 text-sm text-foreground outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 sm:w-auto sm:min-w-40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
    </label>
  );
}

// Filters live in the URL (?q=&kind=&business=) so results can be linked and shared.
export function ServiceCatalog() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const kindParam = params.get("kind");
  const kind: KindFilter = kindParam && kindParam in KIND_LABELS ? (kindParam as OfferingKind) : "all";
  const business = params.get("business") ?? "";

  const setParam = (key: string, value: string) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value && value !== "all") next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATALOG.filter(
      (o) =>
        (kind === "all" || o.kind === kind) &&
        (!business || o.business === business) &&
        (!q || [o.name, o.description, o.category, getBusiness(o.business)?.name].join(" ").toLowerCase().includes(q)),
    );
  }, [query, kind, business]);

  return (
    <div>
      {/* One filter bar: search plus Type and Business dropdowns */}
      <div className="relative flex flex-col gap-2 rounded-3xl border border-foreground/[0.08] bg-card/60 p-2 sm:flex-row sm:items-center sm:rounded-full">
        {/* A light that travels around the bar's border */}
        <span aria-hidden className="border-beam" />
        <div className="relative flex-1">
          <SearchIcon aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search products, services, programmes…"
            aria-label="Search the Service Center"
            className="h-10 w-full rounded-full bg-transparent pr-4 pl-11 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-1">
          <FilterSelect
            label="Type"
            value={kind}
            onChange={(v) => setParam("kind", v)}
            options={[{ value: "all", label: "All types" }, ...(Object.keys(KIND_LABELS) as OfferingKind[]).map((k) => ({ value: k, label: KIND_LABELS[k] }))]}
          />
          <FilterSelect
            label="Business"
            value={business}
            onChange={(v) => setParam("business", v)}
            options={[{ value: "", label: "All businesses" }, ...BUSINESSES.map((b) => ({ value: b.slug, label: b.name }))]}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-muted-foreground sm:mt-8">
        <p>
          {results.length} {results.length === 1 ? "offering" : "offerings"}
        </p>
        {(query || kind !== "all" || business) && (
          <button
            type="button"
            onClick={() => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
      {results.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          Nothing matches yet.{" "}
          <Link to="/service-center/interest" className="font-medium text-foreground underline underline-offset-4">
            Tell us what you're looking for
          </Link>
          .
        </div>
      ) : (
        <Mosaic
          className="mt-4"
          items={results}
          getKey={(o) => o.id}
          renderItem={(o, size, cls) => <OfferingCard offering={o} size={size} className={cls} />}
        />
      )}
    </div>
  );
}


const SIZE_CLASSES: Record<MosaicSize, { card: string; image: string; body: string; title: string }> = {
  // Large image that grows to fill the card's height.
  feature: { card: "", image: "min-h-48 flex-1 sm:min-h-64", body: "shrink-0 p-5 sm:p-8", title: "text-xl sm:text-2xl" },
  // Image beside the text when it spans two thirds of the row.
  wide: { card: "lg:flex-row", image: "h-36 lg:h-auto lg:w-1/2 lg:shrink-0", body: "flex-1 p-5 lg:p-7", title: "lg:text-xl" },
  // Full-width card with the image beside the text.
  banner: { card: "sm:flex-row", image: "h-40 sm:h-auto sm:min-h-52 sm:w-1/2 sm:shrink-0", body: "flex-1 p-5 sm:p-8", title: "sm:text-xl" },
  regular: { card: "", image: "h-36 shrink-0", body: "flex-1 p-5", title: "" },
};

function OfferingCard({ offering, size = "regular", className }: { offering: Offering; size?: MosaicSize; className?: string }) {
  const sizing = SIZE_CLASSES[size];
  const { add, lines } = useCart();
  const business = getBusiness(offering.business)!;
  const inCart = lines.some((l) => l.id === offering.id);
  const purchasable = offering.kind === "product" && offering.price !== null && offering.status === "available";
  const bookable = offering.kind === "service" && offering.business === "barbering-shop";

  return (
    <article className={cn("flex h-full flex-col overflow-hidden rounded-2xl border bg-card", sizing.card, className)}>
      <div className={cn("group relative isolate overflow-hidden", sizing.image)}>
        {/* An offering's own photo, falling back to its business's photo */}
        <CoverImage
          src={offering.image ?? business.image}
          alt={offering.name}
          overlay="from-black/20 via-transparent to-black/40"
          variant={size === "feature" ? "center" : "compact"}
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={offering.status} onDark />
        </div>
        <span className="absolute top-3 right-3 rounded-full bg-white/15 px-2.5 py-1 text-[11px] text-white backdrop-blur">
          {KIND_LABELS[offering.kind].replace(/s$/, "")}
        </span>
      </div>
      <div className={cn("flex flex-col", sizing.body)}>
        <p className="text-xs text-muted-foreground">{business.name}</p>
        <h3 className={cn("mt-1 font-medium", sizing.title)}>{offering.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{offering.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-sm font-medium">
            {offering.price !== null ? (
              formatPrice(offering.price)
            ) : (
              <span className="font-normal text-muted-foreground">Price to be confirmed</span>
            )}
          </span>
          {purchasable ? (
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => add({ id: offering.id, name: offering.name, business: business.name, price: offering.price! })}
            >
              {inCart ? <CheckIcon /> : <ShoppingBagIcon />} {inCart ? "Add another" : "Add to cart"}
            </Button>
          ) : bookable ? (
            <Link to={`/service-center/booking?business=${offering.business}`} className={cn(buttonVariants({ size: "sm", variant: "outline" }), "rounded-full")}>
              <CalendarCheckIcon /> Book
            </Link>
          ) : (
            <Link to={`/service-center/interest?business=${offering.business}`} className={cn(buttonVariants({ size: "sm", variant: "outline" }), "rounded-full")}>
              <SparklesIcon /> Register interest
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
