import { useState } from "react";
import { Link } from "react-router";
import { CheckCircle2Icon, MinusIcon, PlusIcon, ShoppingBagIcon, SmartphoneIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PAYMENT, formatPrice } from "@/lib/site";
import { submitRequest } from "@/lib/submit";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart-provider";

export function Checkout() {
  const { lines, total, setQty, clear } = useCart();
  const [state, setState] = useState<{ status: "idle" | "sending" | "done" | "error"; message?: string }>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "sending" });
    try {
      const reference = await submitRequest("order", {
        ...Object.fromEntries(new FormData(e.currentTarget)),
        items: lines,
        total,
        currency: PAYMENT.currency,
      });
      clear();
      setState({ status: "done", message: reference });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Something went wrong" });
    }
  }

  if (state.status === "done") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border bg-muted p-10 text-center">
        <CheckCircle2Icon className="mx-auto size-12" />
        <h2 className="mt-4 text-xl font-semibold">Order received, awaiting payment verification</h2>
        <p className="mt-3 text-sm">
          Your order reference is <span className="font-mono font-semibold">{state.message}</span>. We'll check your
          Mobile Money payment and contact you to confirm your order and arrange delivery or collection.
        </p>
        <Link to="/service-center" className={cn(buttonVariants(), "mt-6 rounded-full")}>
          Back to the Service Center
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed p-12 text-center">
        <ShoppingBagIcon className="mx-auto size-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Products will be available to order here as our businesses launch them. Until then you can register interest.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/service-center" className={cn(buttonVariants(), "rounded-full")}>Browse offerings</Link>
          <Link to="/service-center/interest" className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>Register interest</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
      <div>
        <h2 className="text-lg font-semibold">Order summary</h2>
        <ul className="mt-4 divide-y rounded-2xl border">
          {lines.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-40 flex-1">
                <p className="font-medium">{l.name}</p>
                <p className="text-xs text-muted-foreground">{l.business} · {formatPrice(l.price)} each</p>
              </div>
              <div className="flex items-center gap-1 rounded-full border p-0.5">
                <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label="Decrease quantity" onClick={() => setQty(l.id, l.qty - 1)}>
                  <MinusIcon />
                </Button>
                <span className="w-6 text-center text-sm">{l.qty}</span>
                <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label="Increase quantity" onClick={() => setQty(l.id, l.qty + 1)}>
                  <PlusIcon />
                </Button>
              </div>
              <p className="w-24 text-right text-sm font-semibold">{formatPrice(l.qty * l.price)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between px-4 text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <div className="mt-10 rounded-2xl bg-ink p-6 text-white">
          <div className="flex items-center gap-3">
            <SmartphoneIcon className="size-5" />
            <h3 className="font-semibold">How to pay with Mobile Money</h3>
          </div>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-white/80">
            <li>Open your Mobile Money menu or app and choose “Send money”.</li>
            <li>
              Send <strong className="text-white">{formatPrice(total)}</strong> to{" "}
              <strong className="text-white">{PAYMENT.momoNumber}</strong> ({PAYMENT.momoNetwork}).
            </li>
            <li>
              Check that the recipient name shows <strong className="text-white">{PAYMENT.momoAccountName}</strong> before confirming.
            </li>
            <li>Copy the transaction ID from your confirmation message and enter it in the form.</li>
          </ol>
          <p className="mt-5 text-xs text-white/50">Never share your Mobile Money PIN with anyone. We will never ask for it.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="light bg-background text-foreground h-fit space-y-5 rounded-3xl p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">Your details</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Full name *</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (used for payment) *</Label>
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Delivery address or pickup note</Label>
          <Input id="address" name="address" autoComplete="street-address" />
        </div>
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="transactionId">Mobile Money transaction ID *</Label>
          <Input id="transactionId" name="transactionId" required placeholder="From your payment confirmation SMS" />
        </div>
        {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
        <Button type="submit" size="lg" className="w-full rounded-full" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Submitting…" : "Submit order for confirmation"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Your order is confirmed only after we verify your payment. We'll contact you by phone or email.
        </p>
      </form>
    </div>
  );
}
