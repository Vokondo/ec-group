import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { KIND_LABELS, formatPrice, getBusiness, type Offering } from "@/lib/site";
import { isPurchasable, offeringAction, offeringImage, offeringPath, pillClass } from "@/lib/shop";
import { ProductImage } from "@/components/shop/product-image";
import { useShop } from "@/components/shop/use-shop";

export function ProductCard({ offering, className }: { offering: Offering; className?: string }) {
  const { addToCart, buyNow, inCart } = useShop();
  const business = getBusiness(offering.business)!;
  const purchasable = isPurchasable(offering);
  const action = offeringAction(offering);

  return (
    <article className={cn("group flex min-w-0 flex-col", className)}>
      <Link to={offeringPath(offering)} className="relative block" aria-label={offering.name}>
        <ProductImage src={offeringImage(offering)} alt={offering.name} className="aspect-[4/3.4]" />
        <span className="absolute top-3 right-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
          {KIND_LABELS[offering.kind].replace(/s$/, "")}
        </span>
        {offering.status !== "available" && !offering.sample && (
          <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white backdrop-blur">Coming soon</span>
        )}
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-medium">
            <Link to={offeringPath(offering)} className="hover:underline hover:underline-offset-4">
              {offering.name}
            </Link>
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {business.name}
            {offering.sample && " · Sample price"}
          </p>
        </div>
        <p className="shrink-0 font-semibold">
          {offering.price !== null ? formatPrice(offering.price) : <span className="text-xs font-normal text-muted-foreground">Price TBC</span>}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {purchasable ? (
          <>
            <button type="button" onClick={() => addToCart(offering)} className={pillClass("outline", "sm")}>
              {inCart(offering) ? "Add another" : "Add to cart"}
            </button>
            <button type="button" onClick={() => buyNow(offering)} className={pillClass("solid", "sm")}>
              Buy now
            </button>
          </>
        ) : (
          <>
            <Link to={offeringPath(offering)} className={pillClass("outline", "sm")}>
              Details
            </Link>
            <Link to={action.to} className={pillClass("solid", "sm")}>
              {action.label === "Book appointment" ? "Book" : "Register"}
            </Link>
          </>
        )}
      </div>
    </article>
  );
}
