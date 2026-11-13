import { useState } from "react";
import { Link, useParams } from "react-router";
import { ChevronRightIcon, StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATALOG, formatPrice, getBusiness } from "@/lib/site";
import { paystackEnabled } from "@/lib/paystack";
import { findOffering, isPurchasable, offeringAction, offeringPhotos } from "@/lib/shop";
import { usePageTitle } from "@/lib/use-page-title";
import { Container } from "@/components/shared";
import { ProductImage } from "@/components/shop/product-image";
import { useShop } from "@/components/shop/use-shop";
import { OfferingCarousel } from "@/components/service-catalog";
import NotFoundPage from "@/pages/not-found";

const ACTION = "text-sm font-medium inline-flex h-10 items-center justify-center rounded-md px-4 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-4";
const PRIMARY = cn(ACTION, "bg-black text-white dark:bg-white dark:text-black hover:bg-green-400 hover:text-black focus-visible:bg-green-400 focus-visible:text-black");
const SECONDARY = cn(ACTION, "border border-neutral-300 hover:bg-neutral-100");
const TEXT_LINK = "underline decoration-neutral-300 underline-offset-4 hover:decoration-current";

export default function OfferingPage() {
  const { id } = useParams();
  const offering = findOffering(id);
  usePageTitle(offering?.name ?? "Not found");
  const [selection, setSelection] = useState<{ id: string; index: number }>();
  const { addToCart, buyNow, inCart } = useShop();
  if (!offering) return <NotFoundPage />;

  const business = getBusiness(offering.business)!;
  const photos = offeringPhotos(offering);
  const photo = selection?.id === offering.id ? selection.index : 0;
  const current = photos[photo];
  const purchasable = isPurchasable(offering);
  const action = offeringAction(offering);
  const { price, compareAtPrice, rating } = offering;
  const previousPrice = price !== null && compareAtPrice !== undefined && compareAtPrice > price ? compareAtPrice : undefined;
  const related = CATALOG.filter((item) => item.id !== offering.id && (item.business === offering.business || item.kind === offering.kind)).slice(0, 8);

  return (
    <>
      <div aria-hidden="true" className="h-20 bg-ink sm:h-24" />

      <article className="bg-white pb-12 text-neutral-950 sm:pb-16 lg:pb-20 dark:bg-background">
        <Container>
          <nav aria-label="Breadcrumb" className="border-b border-neutral-200 py-4 text-xs leading-relaxed text-neutral-600 sm:py-5 sm:text-sm">
            <ol className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <li><Link to="/service-center" className={TEXT_LINK}>Service Center</Link></li>
              <li className="flex min-w-0 items-baseline gap-2">
                <ChevronRightIcon aria-hidden="true" className="relative top-0.5 size-3 shrink-0" />
                <Link to={`/service-center?business=${business.slug}`} className={TEXT_LINK}>{business.name}</Link>
              </li>
              <li aria-current="page" className="flex min-w-0 items-baseline gap-2 text-neutral-950">
                <ChevronRightIcon aria-hidden="true" className="relative top-0.5 size-3 shrink-0" />
                <span>{offering.name}</span>
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid items-start gap-6 sm:mt-8 md:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:gap-x-8 md:gap-y-10 lg:mt-10 lg:gap-x-14 lg:gap-y-12 xl:gap-x-20">
            <header className="w-full min-w-0 max-w-md md:col-start-2 md:row-start-1">
              <p className="text-xs font-medium text-neutral-600">{offering.category}</p>
              <h1 className="mt-2 text-[1.875rem] leading-[1.08] font-light tracking-tight text-pretty wrap-break-word lg:text-[2.125rem]">
                {offering.name}
              </h1>
              {price !== null && (
                <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:mt-4">
                  <p className="text-2xl leading-none font-light tracking-tight tabular-nums sm:text-[1.75rem]">{formatPrice(price)}</p>
                  {previousPrice !== undefined && (
                    <p className="text-sm tabular-nums text-neutral-600">
                      <del>{formatPrice(previousPrice)}</del>
                      <span className="ml-2">Save {formatPrice(previousPrice - price)}</span>
                    </p>
                  )}
                </div>
              )}
              <p className="mt-2 text-sm leading-snug text-neutral-600">
                {offering.sample ? "Sample price for testing" : offering.status === "available" ? "Available now" : "Coming soon"}
              </p>
              {rating && (
                <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <StarIcon aria-hidden="true" className="size-4 fill-current" />
                  <span>{rating.score.toFixed(1)} out of 5</span>
                  <span className="text-neutral-600">({rating.count.toLocaleString()} {rating.count === 1 ? "review" : "reviews"})</span>
                </p>
              )}
            </header>

            <div className="min-w-0 sm:w-[92%] md:col-start-1 md:row-span-2 md:row-start-1 md:justify-self-end">
              <ProductImage
                src={current?.src}
                alt={current?.label ? `${offering.name}, ${current.label}` : offering.name}
                zoom={false}
                eager
                className="aspect-[4/3] rounded-md bg-neutral-100 md:aspect-square"
              />
              {photos.length > 1 && (
                <ul aria-label="Product photos" className="mt-3 flex flex-wrap gap-2">
                  {photos.map(({ src, label }, index) => (
                    <li key={src}>
                      <button
                        type="button"
                        onClick={() => setSelection({ id: offering.id, index })}
                        aria-pressed={index === photo}
                        aria-label={label ?? `Photo ${index + 1}`}
                        className={cn(
                          "group block w-16 rounded-md border p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-20",
                          index === photo ? "border-neutral-950" : "border-neutral-200 hover:border-neutral-500",
                        )}
                      >
                        <ProductImage src={src} alt="" zoom={false} className="aspect-square rounded-sm" />
                        {label && <span className="block truncate px-1 py-0.5 text-xs text-neutral-600">{label}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="w-full min-w-0 max-w-md md:col-start-2 md:row-start-2">
              <section aria-labelledby="offering-description">
                <h2 id="offering-description" className="text-xs font-medium border-b border-neutral-300 pb-2">Description</h2>
                {offering.subtitle && <p className="mt-3 text-sm font-light tracking-tight">{offering.subtitle}</p>}
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-neutral-700 sm:text-[15px]">{offering.description}</p>
              </section>

              <div className={cn("mt-7 grid gap-3 sm:mt-9", purchasable ? "grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)]" : "sm:flex")}>
                {purchasable ? (
                  <>
                    <button type="button" onClick={() => buyNow(offering)} className={PRIMARY}>Buy now</button>
                    <button type="button" onClick={() => addToCart(offering)} className={SECONDARY}>
                      {inCart(offering) ? "Add another to cart" : "Add to cart"}
                    </button>
                  </>
                ) : (
                  <Link to={action.to} className={PRIMARY}>{action.label}</Link>
                )}
              </div>

              <div className="mt-5 space-y-2 text-sm leading-relaxed text-neutral-600">
                <p>
                  {purchasable
                    ? `Choose delivery or pickup at checkout. Pay by ${paystackEnabled ? "Mobile Money or card" : "Mobile Money"}.`
                    : "We’ll contact you to confirm the details."}
                </p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-neutral-800">
                  <li><Link to="/contact" className={TEXT_LINK}>{purchasable ? "Order support" : "Ask a question"}</Link></li>
                  <li><Link to={`/businesses/${business.slug}`} className={TEXT_LINK}>About {business.name}</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <div className="border-t border-neutral-200 py-10 sm:py-14">
          <Container>
            <OfferingCarousel key={offering.id} title="Related offerings" offerings={related} />
          </Container>
        </div>
      )}
    </>
  );
}
