import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  CalendarCheckIcon,
  ChevronRightIcon,
  HeadsetIcon,
  LockIcon,
  MessageCircleIcon,
  SmartphoneIcon,
  StarIcon,
  TruckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATALOG, KIND_LABELS, formatPrice, getBusiness } from "@/lib/site";
import { findOffering, isPurchasable, offeringAction, offeringPhotos } from "@/lib/shop";
import { usePageTitle } from "@/lib/use-page-title";
import { Container } from "@/components/shared";
import { ProductImage } from "@/components/shop/product-image";
import { useShop } from "@/components/shop/use-shop";
import { OfferingCarousel } from "@/components/service-catalog";
import NotFoundPage from "@/pages/not-found";

// Large full-width buttons on the product page: warm accent for the main action, dark for the second.
const BIG = "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full font-mono text-[10px] font-medium tracking-[0.2em] uppercase sm:text-xs transition focus-visible:ring-3 focus-visible:ring-ring/50 outline-none sm:h-14";
const BIG_WARM = cn(BIG, "bg-warm text-ink hover:bg-warm/85");
const BIG_DARK = cn(BIG, "bg-foreground text-background hover:bg-foreground/85");

export default function OfferingPage() {
  const { id } = useParams();
  const offering = findOffering(id);
  usePageTitle(offering?.name ?? "Not found");
  const [photo, setPhoto] = useState(0);
  const { addToCart, buyNow, inCart } = useShop();
  if (!offering) return <NotFoundPage />;

  const business = getBusiness(offering.business)!;
  const photos = offeringPhotos(offering);
  const current = photos[Math.min(photo, photos.length - 1)];
  const purchasable = isPurchasable(offering);
  const action = offeringAction(offering);
  const { price, compareAtPrice, rating } = offering;
  const saving = price !== null && compareAtPrice && compareAtPrice > price ? compareAtPrice - price : 0;
  const related = CATALOG.filter((o) => o.id !== offering.id && (o.business === offering.business || o.kind === offering.kind)).slice(0, 8);

  const trust = purchasable
    ? [
        { Icon: LockIcon, label: "Secure checkout" },
        { Icon: SmartphoneIcon, label: "Mobile Money or card" },
        { Icon: TruckIcon, label: "Delivery or pickup" },
        { Icon: HeadsetIcon, label: "Order support", to: "/contact" },
      ]
    : [
        { Icon: CalendarCheckIcon, label: "Confirmed by phone" },
        { Icon: MessageCircleIcon, label: "Questions welcome", to: "/contact" },
      ];

  return (
    <>
      {/* Dark band behind the fixed header, which is white-on-transparent until the page scrolls */}
      <div className="h-16 bg-ink" />

      <section className="py-6 sm:py-12">
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

          <div className="mt-4 grid gap-5 sm:mt-6 sm:gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            {/* Gallery */}
            <div className="min-w-0">
              <ProductImage src={current?.src} alt={offering.name} zoom={false} eager className="aspect-[4/3] rounded-2xl sm:aspect-[6/5] sm:rounded-3xl" />
              {photos.length > 1 && (
                <ul className="mt-3 grid grid-cols-5 gap-2 sm:mt-4 sm:grid-cols-4 sm:gap-3">
                  {photos.map((p, i) => (
                    <li key={p.src}>
                      <button
                        type="button"
                        onClick={() => setPhoto(i)}
                        aria-pressed={i === photo}
                        aria-label={p.label ?? `Photo ${i + 1}`}
                        className="group block w-full text-center"
                      >
                        <ProductImage
                          src={p.src}
                          alt=""
                          zoom={false}
                          className={cn(
                            "aspect-square rounded-lg border-2 transition sm:rounded-xl",
                            i === photo ? "border-foreground" : "border-transparent opacity-80 group-hover:opacity-100",
                          )}
                        />
                        {p.label && <span className="mt-1.5 hidden truncate text-xs text-muted-foreground sm:block">{p.label}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Details */}
            <div className="min-w-0 lg:pt-2">
              <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase sm:text-[11px]">
                <Link to={`/businesses/${business.slug}`} className="hover:text-foreground">
                  {business.name}
                </Link>{" "}
                · {KIND_LABELS[offering.kind].replace(/s$/, "")}
              </p>
              <h1 className="mt-2 text-2xl font-light tracking-tight sm:mt-3 sm:text-4xl lg:text-5xl">{offering.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-lg">{offering.subtitle ?? offering.category}</p>

              {rating && (
                <p className="mt-3 flex items-center gap-3 text-xs sm:mt-4 sm:text-sm">
                  <span className="flex items-center gap-0.5" aria-label={`Rated ${rating.score} out of 5`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon key={i} className={cn("size-3.5 sm:size-4", i < Math.round(rating.score) ? "fill-warm text-warm" : "text-muted-foreground/40")} />
                    ))}
                  </span>
                  <span className="font-medium">{rating.score.toFixed(1)}</span>
                  <span className="h-4 w-px bg-border" />
                  <span className="text-muted-foreground">
                    {rating.count.toLocaleString()} {rating.count === 1 ? "review" : "reviews"}
                  </span>
                </p>
              )}

              <div className="mt-4 sm:mt-6">
                {saving > 0 && <p className="text-sm text-muted-foreground line-through sm:text-base">{formatPrice(compareAtPrice!)}</p>}
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-2xl font-light tracking-tight sm:text-4xl">
                    {price !== null ? formatPrice(price) : <span className="text-lg text-muted-foreground sm:text-2xl">Price to be confirmed</span>}
                  </p>
                  {saving > 0 && (
                    <span className="rounded-full bg-warm/20 px-3 py-1 font-mono text-[10px] tracking-[0.15em] uppercase sm:text-[11px]">Save {formatPrice(saving)}</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground sm:mt-2">
                  {offering.status === "available" ? "Available now" : offering.sample ? "Sample price for testing" : "Coming soon"}
                </p>
              </div>

              <p className="mt-4 max-w-prose text-[13px] leading-relaxed text-muted-foreground sm:mt-6 sm:text-base">{offering.description}</p>

              <div className="mt-5 space-y-2 sm:mt-8 sm:space-y-3">
                {purchasable ? (
                  <>
                    <button type="button" onClick={() => addToCart(offering)} className={BIG_WARM}>
                      {inCart(offering) ? "Add another to cart" : "Add to cart"}
                    </button>
                    <button type="button" onClick={() => buyNow(offering)} className={BIG_DARK}>
                      Buy now
                    </button>
                  </>
                ) : (
                  <>
                    <Link to={action.to} className={BIG_WARM}>
                      {action.label}
                    </Link>
                    <Link to="/contact" className={BIG_DARK}>
                      Ask a question
                    </Link>
                  </>
                )}
                <p className="pt-1 text-center text-xs text-muted-foreground sm:text-sm">
                  {purchasable ? "Delivery or pickup, arranged after you order" : "We'll contact you to confirm the details"}
                </p>
              </div>

              <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-3 rounded-2xl bg-muted/70 p-4 text-xs sm:mt-6 sm:gap-x-4 sm:gap-y-4 sm:p-5 sm:text-sm">
                {trust.map(({ Icon, label, to }) => (
                  <li key={label} className="flex items-center gap-2 sm:gap-2.5">
                    <Icon className="size-3.5 shrink-0 sm:size-4" />
                    {to ? (
                      <Link to={to} className="hover:underline hover:underline-offset-4">
                        {label}
                      </Link>
                    ) : (
                      label
                    )}
                  </li>
                ))}
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
