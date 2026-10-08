import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { CalendarCheckIcon, CheckIcon, SearchIcon, ShoppingBagIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESSES, CATALOG, KIND_LABELS, formatPrice, getBusiness, type Offering, type OfferingKind } from "@/lib/site";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoverImage } from "@/components/business-image";
import { StatusBadge } from "@/components/shared";
import { useCart } from "@/components/cart-provider";

type KindFilter = OfferingKind | "all";

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <SearchIcon className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search products, services, programmes…"
            className="h-11 rounded-full pl-10"
            aria-label="Search the Service Center"
          />
        </div>
        <Tabs value={kind} onValueChange={(v) => setParam("kind", String(v))}>
          <TabsList className="h-auto flex-wrap rounded-full">
            <TabsTrigger value="all" className="rounded-full px-3">All</TabsTrigger>
            {(Object.keys(KIND_LABELS) as OfferingKind[]).map((k) => (
              <TabsTrigger key={k} value={k} className="rounded-full px-3">{KIND_LABELS[k]}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[{ slug: "", name: "All businesses" }, ...BUSINESSES].map((b) => (
          <button
            key={b.slug}
            type="button"
            onClick={() => setParam("business", b.slug)}
            aria-pressed={business === b.slug}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition",
              business === b.slug ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:border-foreground hover:text-foreground",
            )}
          >
            {b.name}
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "offering" : "offerings"}
      </p>
      {results.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          Nothing matches yet.{" "}
          <Link to="/service-center/interest" className="font-medium text-foreground underline underline-offset-4">
            Tell us what you're looking for
          </Link>
          .
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((o) => (
            <OfferingCard key={o.id} offering={o} />
          ))}
        </div>
      )}
    </div>
  );
}

function OfferingCard({ offering }: { offering: Offering }) {
  const { add, lines } = useCart();
  const business = getBusiness(offering.business)!;
  const inCart = lines.some((l) => l.id === offering.id);
  const purchasable = offering.kind === "product" && offering.price !== null && offering.status === "available";
  const bookable = offering.kind === "service" && offering.business === "barbering-shop";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="group relative isolate h-36 overflow-hidden">
        {/* An offering's own photo, falling back to its business's photo */}
        <CoverImage src={offering.image ?? business.image} alt={offering.name} overlay="from-black/20 via-transparent to-black/40" variant="compact" />
        <div className="absolute top-3 left-3">
          <StatusBadge status={offering.status} onDark />
        </div>
        <span className="absolute top-3 right-3 rounded-full bg-white/15 px-2.5 py-1 text-[11px] text-white backdrop-blur">
          {KIND_LABELS[offering.kind].replace(/s$/, "")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-muted-foreground">{business.name}</p>
        <h3 className="mt-1 font-semibold">{offering.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{offering.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">
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
