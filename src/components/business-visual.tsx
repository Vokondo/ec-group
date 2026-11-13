import { Link } from "react-router";
import { cn } from "@/lib/utils";
import type { Business } from "@/lib/site";
import { CoverImage } from "@/components/business-image";
import { BrandMark } from "@/components/brand-mark";
import { media } from "@/lib/media";
import { StatusBadge } from "@/components/shared";

export function BusinessTile({ business, className, large }: { business: Business; className?: string; large?: boolean }) {
  const logo = media(business.slug, "logo");
  return (
    <Link
      to={`/businesses/${business.slug}`}
      className={cn(
        "group relative isolate flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl p-4 sm:min-h-56 sm:p-5 text-white shadow-sm ring-1 ring-white/10 transition hover:shadow-xl hover:ring-white/25",
        className,
      )}
    >
      <CoverImage src={business.image} alt={business.name} variant={large ? "center" : "compact"} />
      <div className="relative flex items-start justify-between gap-3">
        <StatusBadge status={business.status} onDark />
        {logo && <BrandMark src={logo} alt={`${business.name} logo`} className="h-9 px-2 py-1.5 sm:h-10" />}
      </div>
      <div className="relative">
        <p className="text-[11px] font-medium tracking-wider text-white/70 uppercase">{business.sector}</p>
        <h3 className={cn("font-medium", large ? "text-xl sm:text-2xl" : "text-lg")}>{business.name}</h3>
        {large && <p className="mt-2 max-w-md text-sm text-white/80">{business.summary}</p>}
      </div>
    </Link>
  );
}

// Bento grid: first tile spans two columns, last spans two on large screens so the grid ends flush.
export function BusinessGrid({ businesses }: { businesses: Business[] }) {
  const [featured, ...rest] = businesses;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <BusinessTile business={featured} large className="min-h-60 sm:col-span-2 sm:min-h-72" />
      {rest.map((b, i) => (
        <BusinessTile key={b.slug} business={b} className={i === rest.length - 1 ? "lg:col-span-2" : undefined} />
      ))}
    </div>
  );
}
