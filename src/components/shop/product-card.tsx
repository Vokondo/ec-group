import { Link } from "react-router";
import { ShoppingCartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, getBusiness, type Offering } from "@/lib/site";
import { isPurchasable, offeringAction, offeringImage, offeringPath } from "@/lib/shop";
import { ProductImage } from "@/components/shop/product-image";
import { useShop } from "@/components/shop/use-shop";

const actionClass =
  "inline-flex min-h-8 items-center justify-center rounded-md px-2 py-1.5 text-center font-mono text-[9px] font-medium tracking-[0.15em] whitespace-nowrap uppercase sm:min-h-10 sm:py-2 sm:text-[11px]";
const primaryAction = cn(actionClass, "bg-black text-white hover:bg-neutral-800");

export function ProductCard({ offering, className }: { offering: Offering; className?: string }) {
  const { buyNow } = useShop();
  const purchasable = isPurchasable(offering);
  const action = offeringAction(offering);

  return (
    // Taller on phones so the photo keeps its space next to the text.
    <article className={cn("flex aspect-[4/5] w-full min-w-0 flex-col rounded-md border border-neutral-200 bg-white p-1.5 text-neutral-950 sm:aspect-square sm:p-2", className)}>
      <Link to={offeringPath(offering)} className="block min-h-0 flex-1 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2" aria-label={offering.name}>
        <ProductImage src={offeringImage(offering)} alt="" zoom={false} className="h-full rounded-sm bg-neutral-100" />
      </Link>

      <div className="px-1 pt-1.5 sm:px-2 sm:pt-2">
        <h3 className="line-clamp-2 text-[13px] leading-snug font-light tracking-tight wrap-break-word sm:line-clamp-none sm:text-lg">
          <Link to={offeringPath(offering)} className="hover:underline hover:underline-offset-4">
            {offering.name}
          </Link>
        </h3>
        <p className="mt-0.5 truncate font-mono text-[8px] tracking-[0.15em] text-neutral-600 uppercase sm:mt-1 sm:text-[10px]">
          {getBusiness(offering.business)?.name}
        </p>
      </div>

      <div className="flex items-end justify-between gap-1 px-1 pt-1.5 pb-0.5 sm:flex-wrap sm:px-2 sm:pt-2 sm:pb-1">
        <div className="min-w-0">
          {offering.price !== null && <p className="text-sm font-light tracking-tight tabular-nums sm:text-xl">{formatPrice(offering.price)}</p>}
          {offering.sample && <p className="text-[10px] text-neutral-600 sm:text-xs">Sample price</p>}
          {offering.status !== "available" && !offering.sample && <p className="text-[10px] text-neutral-600 sm:text-xs">Coming soon</p>}
        </div>
        {purchasable ? (
          <button
            type="button"
            onClick={() => buyNow(offering)}
            aria-label={`Buy ${offering.name} now`}
            className={cn(primaryAction, "ml-auto size-8 shrink-0 px-0 sm:size-11")}
          >
            <ShoppingCartIcon aria-hidden="true" className="size-4 sm:size-5" />
          </button>
        ) : (
          <Link to={action.to} className={cn(primaryAction, "ml-auto shrink-0")}>
            {action.label === "Book appointment" ? "Book" : "Register"}
          </Link>
        )}
      </div>
    </article>
  );
}
