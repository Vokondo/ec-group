import { useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BikeIcon,
  CalendarCheckIcon,
  GraduationCapIcon,
  LayoutGridIcon,
  SearchIcon,
  ShoppingBagIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESSES, CATALOG, KIND_LABELS, getBusiness, type Offering, type OfferingKind } from "@/lib/site";
import { isPurchasable, pillClass } from "@/lib/shop";
import { ProductCard } from "@/components/shop/product-card";

type KindFilter = OfferingKind | "all";

const PAGE_SIZE = 9;

const KIND_ICONS: Record<OfferingKind, React.ComponentType<{ className?: string }>> = {
  product: ShoppingBagIcon,
  service: CalendarCheckIcon,
  programme: GraduationCapIcon,
  event: BikeIcon,
};

// Buyable items first, then everything else in catalog order.
const SORTED = [...CATALOG].sort((a, b) => Number(isPurchasable(b)) - Number(isPurchasable(a)));

// Filters and page live in the URL (?q=&kind=&business=&page=) so results can be linked and shared.
export function ServiceCatalog() {
  const [params, setParams] = useSearchParams();
  const top = useRef<HTMLDivElement>(null);
  const query = params.get("q") ?? "";
  const kindParam = params.get("kind");
  const kind: KindFilter = kindParam && kindParam in KIND_LABELS ? (kindParam as OfferingKind) : "all";
  const business = params.get("business") ?? "";

  const update = (changes: Record<string, string>, scroll = false) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(changes)) {
          if (value && value !== "all") next.set(key, value);
          else next.delete(key);
        }
        // Any filter change starts again from page 1.
        if (!("page" in changes)) next.delete("page");
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
    if (scroll) top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Matches the search and business filter; the kind filter is applied after so its counts stay useful.
  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SORTED.filter(
      (o) =>
        (!business || o.business === business) &&
        (!q || [o.name, o.description, o.category, getBusiness(o.business)?.name].join(" ").toLowerCase().includes(q)),
    );
  }, [query, business]);
  const results = kind === "all" ? searched : searched.filter((o) => o.kind === kind);

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Number(params.get("page")) || 1));
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filtered = query || kind !== "all" || business;

  const kinds: { value: KindFilter; label: string; count: number; Icon: React.ComponentType<{ className?: string }> }[] = [
    { value: "all", label: "All offerings", count: searched.length, Icon: LayoutGridIcon },
    ...(Object.keys(KIND_LABELS) as OfferingKind[]).map((k) => ({
      value: k as KindFilter,
      label: KIND_LABELS[k],
      count: searched.filter((o) => o.kind === k).length,
      Icon: KIND_ICONS[k],
    })),
  ];

  return (
    <div ref={top} className="scroll-mt-24">
      {/* Title and search, as one bar */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:py-3 sm:pr-3 sm:pl-6">
        <h2 className="text-xl font-medium tracking-tight sm:text-2xl">Find what you need</h2>
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center gap-2 rounded-full border bg-background/60 p-1 pl-4 sm:w-[26rem]"
        >
          <SearchIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search products, services, programmes…"
            aria-label="Search the Service Center"
            className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="submit" className={pillClass("solid", "sm", "h-9")}>
            Search
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-8 lg:mt-10 lg:grid-cols-[13.5rem_1fr] lg:gap-10">
        {/* Categories: a sidebar on large screens, scrollable chips on small ones */}
        <aside className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
          <h3 className="text-sm font-semibold max-lg:sr-only">Category</h3>
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:mt-3 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
            {kinds.map(({ value, label, count, Icon }) => {
              const active = kind === value;
              return (
                <li key={value} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => update({ kind: value })}
                    aria-pressed={active}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-full border px-4 py-2 text-left text-sm transition lg:rounded-xl lg:border-transparent lg:px-3",
                      active ? "border-foreground bg-foreground text-background lg:border-transparent lg:bg-card lg:text-foreground lg:shadow-sm" : "bg-card hover:bg-muted lg:bg-transparent",
                    )}
                  >
                    <Icon className="size-4 shrink-0 opacity-70" />
                    <span className="flex-1 whitespace-nowrap">{label}</span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[11px] tabular-nums",
                        active ? "bg-background/20 lg:bg-foreground lg:text-background" : "text-muted-foreground",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <h3 className="mt-6 text-sm font-semibold max-lg:sr-only lg:mt-8">Businesses</h3>
          <label className="mt-3 block lg:hidden">
            <span className="sr-only">Business</span>
            <select
              value={business}
              onChange={(e) => update({ business: e.target.value })}
              className="h-10 w-full cursor-pointer rounded-full border bg-card px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <option value="">All businesses</option>
              {BUSINESSES.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <ul className="mt-3 hidden space-y-0.5 lg:block">
            {[{ slug: "", name: "All businesses" }, ...BUSINESSES].map((b) => {
              const active = business === b.slug;
              return (
                <li key={b.slug || "all"}>
                  <button
                    type="button"
                    onClick={() => update({ business: b.slug })}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-xl px-3 py-2 text-left text-sm transition",
                      active ? "bg-card font-medium shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {b.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              {results.length} {results.length === 1 ? "offering" : "offerings"}
              {pages > 1 && ` · page ${page} of ${pages}`}
            </p>
            {filtered && (
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
            <div className="mt-4 rounded-3xl border border-dashed p-12 text-center text-sm text-muted-foreground">
              Nothing matches yet.{" "}
              <Link to="/service-center/interest" className="font-medium text-foreground underline underline-offset-4">
                Tell us what you're looking for
              </Link>
              .
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((o) => (
                <ProductCard key={o.id} offering={o} />
              ))}
            </div>
          )}

          {pages > 1 && <Pagination page={page} pages={pages} onPage={(p) => update({ page: String(p) }, true)} />}
        </div>
      </div>
    </div>
  );
}

function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  return (
    <nav aria-label="Pages" className="mt-12 flex items-center justify-between gap-4 border-t pt-6">
      <button type="button" disabled={page === 1} onClick={() => onPage(page - 1)} className={pillClass("ghost", "sm")}>
        <ArrowLeftIcon /> Previous
      </button>
      <ol className="flex items-center gap-1">
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => onPage(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "grid size-9 place-items-center rounded-full text-sm tabular-nums transition",
                p === page ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {p}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" disabled={page === pages} onClick={() => onPage(page + 1)} className={pillClass("ghost", "sm")}>
        Next <ArrowRightIcon />
      </button>
    </nav>
  );
}

// Horizontal row of offerings with arrow controls (scroll-snapping; swipe on touch screens).
export function OfferingCarousel({ title, offerings }: { title: string; offerings: Offering[] }) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });
  if (offerings.length === 0) return null;
  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-light tracking-tight sm:text-3xl">{title}</h2>
        <div className="flex gap-2">
          <button type="button" onClick={() => scroll(-1)} aria-label="Scroll back" className={pillClass("outline", "sm", "size-10 px-0")}>
            <ArrowLeftIcon />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Scroll forward" className={pillClass("outline", "sm", "size-10 px-0")}>
            <ArrowRightIcon />
          </button>
        </div>
      </div>
      <ul
        ref={track}
        className="-mx-4 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8"
      >
        {offerings.map((o) => (
          <li key={o.id} className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-[calc((100%-3.75rem)/4)]">
            <ProductCard offering={o} />
          </li>
        ))}
      </ul>
    </section>
  );
}
