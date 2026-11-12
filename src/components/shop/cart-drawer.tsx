import { Link } from "react-router";
import { LockIcon, MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon, XIcon } from "lucide-react";
import { CATALOG, formatPrice } from "@/lib/site";
import { findOffering, isPurchasable, offeringImage, offeringPath, pillClass } from "@/lib/shop";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { ProductImage } from "@/components/shop/product-image";
import { useShop } from "@/components/shop/use-shop";

// Slide-out cart, opened from the header or whenever something is added.
export function CartDrawer() {
  const { lines, count, total, setQty, isOpen, setOpen, addToCart } = useShop();
  const suggestions = CATALOG.filter((o) => isPurchasable(o) && !lines.some((l) => l.id === o.id)).slice(0, 6);
  const close = () => setOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" showCloseButton={false} className="w-full gap-0 border-0 bg-background p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-6 pb-5 sm:px-6">
          <SheetTitle className="text-3xl font-normal tracking-tight sm:text-4xl">
            Cart
            {count > 0 && <sup className="ml-1 align-super text-sm font-medium">{count}</sup>}
          </SheetTitle>
          <SheetClose className={pillClass("ghost", "sm", "size-10 px-0")} aria-label="Close cart">
            <XIcon className="!size-5" />
          </SheetClose>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="mx-5 flex items-center gap-3 border-y py-4 sm:mx-6">
            <LockIcon className="size-4 shrink-0" />
            <SheetDescription className="text-xs">
              <span className="block font-mono text-[10px] tracking-[0.2em] text-foreground uppercase">Secure payment</span>
              Mobile Money (MTN, Telecel, AirtelTigo) or card
            </SheetDescription>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <ShoppingBagIcon className="size-10 text-muted-foreground" />
              <p className="mt-4 font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Add something from the Service Center.</p>
              <SheetClose render={<Link to="/service-center" />} nativeButton={false} className={pillClass("solid", "md", "mt-6")}>
                Browse the Service Center
              </SheetClose>
            </div>
          ) : (
            <ul className="divide-y px-5 sm:px-6">
              {lines.map((l) => {
                const o = findOffering(l.id);
                return (
                  <li key={l.id} className="flex gap-4 py-5">
                    <Link to={o ? offeringPath(o) : "/service-center"} onClick={close} className="shrink-0">
                      <ProductImage src={offeringImage(o)} alt={l.name} zoom={false} className="size-24 rounded-xl sm:size-28" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium">{l.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {l.business}
                            {o?.sample && " · Sample price"}
                          </p>
                        </div>
                        <p className="shrink-0 font-medium">{formatPrice(l.qty * l.price)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="inline-flex items-center rounded-lg border bg-card">
                          <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label={`Decrease ${l.name}`} className="grid size-8 place-items-center rounded-lg hover:bg-muted">
                            <MinusIcon className="size-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm tabular-nums">{l.qty}</span>
                          <button type="button" onClick={() => setQty(l.id, l.qty + 1)} aria-label={`Increase ${l.name}`} className="grid size-8 place-items-center rounded-lg hover:bg-muted">
                            <PlusIcon className="size-3.5" />
                          </button>
                        </div>
                        <button type="button" onClick={() => setQty(l.id, 0)} className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground">
                          <Trash2Icon className="size-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {lines.length > 0 && suggestions.length > 0 && (
            <div className="mt-2 pb-6">
              <h3 className="px-5 text-xl font-normal tracking-tight sm:px-6">Complete your order</h3>
              <ul className="mt-4 flex snap-x gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 [scrollbar-width:none] sm:scroll-px-6 sm:px-6">
                {suggestions.map((o) => (
                  <li key={o.id} className="flex w-80 shrink-0 snap-start gap-3 rounded-2xl bg-muted/70 p-3">
                    <ProductImage src={offeringImage(o)} alt={o.name} zoom={false} className="size-20 shrink-0 rounded-xl bg-card" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-medium">{o.name}</p>
                        <p className="shrink-0 text-sm">{formatPrice(o.price!)}</p>
                      </div>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{o.description}</p>
                      <button
                        type="button"
                        onClick={() => addToCart(o)}
                        className="mt-auto flex w-fit items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase hover:underline hover:underline-offset-4"
                      >
                        Add <span aria-hidden className="size-1.5 rounded-full bg-foreground" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="shrink-0 space-y-4 bg-muted/70 px-5 pt-5 pb-6 sm:px-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xl font-medium">Total</p>
                <p className="text-xs text-muted-foreground">Delivery is arranged after checkout</p>
              </div>
              <p className="text-xl font-medium">{formatPrice(total)}</p>
            </div>
            <SheetClose render={<Link to="/service-center/checkout" />} nativeButton={false} className={pillClass("solid", "lg", "w-full rounded-xl")}>
              Checkout securely <span aria-hidden className="size-1.5 rounded-full bg-background" />
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
