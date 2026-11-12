import { useState } from "react";
import { Link, useParams } from "react-router";
import { ChevronRightIcon, MinusIcon, PlusIcon, ShieldCheckIcon, ShoppingBagIcon, TruckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATALOG, KIND_LABELS, formatPrice, getBusiness } from "@/lib/site";
import { findOffering, isPurchasable, offeringAction, offeringPhotos } from "@/lib/shop";
import { pillClass } from "@/lib/shop";
import { usePageTitle } from "@/lib/use-page-title";
import { Container } from "@/components/shared";
import { ProductImage } from "@/components/shop/product-image";
import { useShop } from "@/components/shop/use-shop";
import { OfferingCarousel } from "@/components/service-catalog";
import NotFoundPage from "@/pages/not-found";

export default function OfferingPage() {
  const { id } = useParams();
  const offering = findOffering(id);
  usePageTitle(offering?.name ?? "Not found");
  const [photo, setPhoto] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart, buyNow } = useShop();
  if (!offering) return <NotFoundPage />;

  const business = getBusiness(offering.business)!;
  const photos = offeringPhotos(offering);
  const purchasable = isPurchasable(offering);
  const action = offeringAction(offering);
  const related = CATALOG.filter((o) => o.id !== offering.id && (o.business === offering.business || o.kind === offering.kind)).slice(0, 8);

  return (
    <>
      {/* Dark band behind the fixed header, which is white-on-transparent until the page scrolls */}
      <div className="h-16 bg-ink" />

      <section className="py-8 sm:py-12">
        <Container>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/service-center" className="hover:text-foreground">
              Service Center
            </Link>
            <ChevronRightIcon className="size-3" />
            <Link to={`/service-center?business=${business.slug}`} className="hover:text-foreground">
              {business.name}
            </Link>
            <ChevronRightIcon className="size-3" />
            <span className="text-foreground">{offering.name}</span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            {/* Gallery */}
            <div>
              <ProductImage src={photos[photo]} alt={offering.name} zoom={false} eager className="aspect-square sm:aspect-[5/4] lg:rounded-3xl" />
              {photos.length > 1 && (
                <ul className="mt-3 grid grid-cols-5 gap-3">
                  {photos.map((p, i) => (
                    <li key={p}>
                      <button
                        type="button"
                        onClick={() => setPhoto(i)}
                        aria-label={`Show photo ${i + 1}`}
                        aria-pressed={i === photo}
                        className={cn("block w-full rounded-xl ring-offset-2 ring-offset-background transition", i === photo ? "ring-2 ring-foreground" : "opacity-70 hover:opacity-100")}
                      >
                        <ProductImage src={p} alt="" zoom={false} className="aspect-square rounded-xl" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Details */}
            <div className="lg:pt-2">
              <div className="flex items-center justify-between gap-4">
                <Link to={`/businesses/${business.slug}`} className="flex items-center gap-2.5 text-sm font-medium hover:underline hover:underline-offset-4">
                  <span className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
                    {business.name.charAt(0)}
                  </span>
                  {business.name}
                </Link>
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{KIND_LABELS[offering.kind].replace(/s$/, "")}</span>
              </div>

              <h1 className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">{offering.name}</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                {offering.status === "available" ? "Available now" : offering.sample ? "Sample price for testing" : "Coming soon"} · {offering.category}
              </p>

              <p className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                {offering.price !== null ? formatPrice(offering.price) : <span className="text-2xl font-normal text-muted-foreground">Price to be confirmed</span>}
              </p>

              <p className="mt-6 max-w-prose text-base text-muted-foreground">{offering.description}</p>

              {purchasable ? (
                <>
                  <div className="mt-8">
                    <p className="text-sm font-medium">Quantity</p>
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full border bg-card p-1">
                      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className={pillClass("ghost", "sm", "size-9 px-0")}>
                        <MinusIcon />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
                        {qty}
                      </span>
                      <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className={pillClass("ghost", "sm", "size-9 px-0")}>
                        <PlusIcon />
                      </button>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={() => addToCart(offering, qty)} className={pillClass("solid", "lg", "flex-1")}>
                      <ShoppingBagIcon /> Add to cart
                    </button>
                    <button type="button" onClick={() => buyNow(offering, qty)} className={pillClass("outline", "lg", "sm:w-44")}>
                      Buy now
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to={action.to} className={pillClass("solid", "lg", "flex-1")}>
                    {action.label}
                  </Link>
                  <Link to="/contact" className={pillClass("outline", "lg", "sm:w-44")}>
                    Ask a question
                  </Link>
                </div>
              )}

              <ul className="mt-8 space-y-3 border-t pt-6 text-sm text-muted-foreground">
                {purchasable && (
                  <li className="flex items-center gap-3">
                    <TruckIcon className="size-4 shrink-0 text-foreground" /> Delivery or pickup, arranged by phone after you order
                  </li>
                )}
                <li className="flex items-center gap-3">
                  <ShieldCheckIcon className="size-4 shrink-0 text-foreground" />
                  {purchasable ? "Secure payment with Mobile Money or card" : "We'll contact you with details as soon as they're confirmed"}
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t py-12 sm:py-20">
          <Container>
            <OfferingCarousel title="You may also like" offerings={related} />
          </Container>
        </section>
      )}
    </>
  );
}
