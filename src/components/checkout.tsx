import { useRef, useState } from "react";
import { Link } from "react-router";
import {
  CheckCircle2Icon,
  CheckIcon,
  ClockIcon,
  CreditCardIcon,
  LockIcon,
  MinusIcon,
  PackageIcon,
  PlusIcon,
  ShoppingBagIcon,
  SmartphoneIcon,
  Trash2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATALOG, PAYMENT, formatPrice } from "@/lib/site";
import { newReference, submitRequest } from "@/lib/submit";
import { payWithPaystack, paystackEnabled } from "@/lib/paystack";
import { findOffering, offeringImage, offeringPath, pillClass } from "@/lib/shop";
import { ProductImage } from "@/components/shop/product-image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart, type CartLine } from "@/components/cart-provider";

type Step = "cart" | "details" | "payment";
type Fulfilment = "delivery" | "pickup";
type Method = "paystack" | "momo";

type Details = { name: string; phone: string; email: string; fulfilment: Fulfilment; address: string; notes: string };

type Placed = {
  reference: string;
  method: Method;
  lines: CartLine[];
  total: number;
  details: Details;
  // Set when the order could not be sent to the team after a successful payment.
  warning?: string;
};

const STEPS: { id: Step; label: string }[] = [
  { id: "cart", label: "Cart" },
  { id: "details", label: "Details" },
  { id: "payment", label: "Payment" },
];

const EMPTY_DETAILS: Details = { name: "", phone: "", email: "", fulfilment: "delivery", address: "", notes: "" };
const isSample = (id: string) => CATALOG.some((o) => o.id === id && o.sample);

export function Checkout() {
  const { lines, total, setQty, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const top = useRef<HTMLDivElement>(null);

  const go = (next: Step) => {
    setStep(next);
    // Bring the new step into view, below the fixed header.
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  if (placed) return <Confirmation placed={placed} />;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed p-12 text-center">
        <ShoppingBagIcon className="mx-auto size-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-medium">Your cart is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse the Service Center and add products to your cart. For anything without a price yet, you can register
          interest.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/service-center?kind=product" className={pillClass("solid")}>
            Browse products
          </Link>
          <Link to="/service-center/interest" className={pillClass("outline")}>
            Register interest
          </Link>
        </div>
      </div>
    );
  }

  const onPlaced = (p: Placed) => {
    clear();
    setPlaced(p);
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div ref={top} className="scroll-mt-24">
      <Stepper current={step} onStep={go} />

      {/* grid-cols-1 / min-w-0 stop long product names from widening the column on phones */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10">
        <div className="min-w-0">
          {step === "cart" && <CartStep lines={lines} setQty={setQty} total={total} onNext={() => go("details")} />}
          {step === "details" && (
            <DetailsStep details={details} onChange={setDetails} onBack={() => go("cart")} onNext={() => go("payment")} />
          )}
          {step === "payment" && (
            <PaymentStep details={details} lines={lines} total={total} onBack={() => go("details")} onPlaced={onPlaced} />
          )}
        </div>
        <Summary lines={lines} total={total} details={step === "payment" ? details : undefined} fulfilment={step === "details" ? details.fulfilment : undefined} editable={step !== "cart"} onEdit={go} />
      </div>
    </div>
  );
}

// ——— Progress ———

function Stepper({ current, onStep }: { current: Step; onStep: (s: Step) => void }) {
  const index = STEPS.findIndex((s) => s.id === current);
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {STEPS.map((s, i) => {
        const done = i < index;
        const active = i === index;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2 sm:gap-3 last:flex-none">
            <button
              type="button"
              disabled={!done}
              onClick={() => onStep(s.id)}
              aria-current={active ? "step" : undefined}
              className="flex items-center gap-2 disabled:cursor-default"
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] transition",
                  active && "border-foreground bg-foreground text-background",
                  done && "border-foreground bg-background text-foreground",
                  !active && !done && "text-muted-foreground",
                )}
              >
                {done ? <CheckIcon className="size-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "font-mono text-[10px] tracking-[0.2em] uppercase sm:text-[11px]",
                  active ? "text-foreground" : "text-muted-foreground",
                  !active && "max-sm:sr-only",
                )}
              >
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && <span aria-hidden className={cn("h-px flex-1", done ? "bg-foreground" : "bg-border")} />}
          </li>
        );
      })}
    </ol>
  );
}

// ——— Step 1: cart ———

function CartStep({
  lines,
  total,
  setQty,
  onNext,
}: {
  lines: CartLine[];
  total: number;
  setQty: (id: string, qty: number) => void;
  onNext: () => void;
}) {
  return (
    <section>
      <h2 className="text-xl font-light tracking-tight sm:text-2xl">Review your cart</h2>
      <ul className="mt-5 divide-y rounded-3xl border bg-card px-4 sm:px-6">
        {lines.map((l) => {
          const o = findOffering(l.id);
          return (
            <li key={l.id} className="flex gap-4 py-5">
              <Link to={o ? offeringPath(o) : "/service-center"} className="shrink-0">
                <ProductImage src={offeringImage(o)} alt={l.name} zoom={false} className="size-20 rounded-xl sm:size-24" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{l.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.business} · {formatPrice(l.price)} each
                      {isSample(l.id) && " · Sample price"}
                    </p>
                  </div>
                  <p className="shrink-0 font-medium">{formatPrice(l.qty * l.price)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                  <div className="inline-flex items-center rounded-lg border">
                    <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label={`Decrease ${l.name}`} className="grid size-8 place-items-center rounded-lg hover:bg-muted">
                      <MinusIcon className="size-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">
                      {l.qty}
                    </span>
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
      <div className="mt-4 flex justify-between px-4 text-lg font-medium">
        <span>Subtotal</span>
        <span>{formatPrice(total)}</span>
      </div>
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link to="/service-center" className={pillClass("outline", "lg", "")}>
          Continue shopping
        </Link>
        <button type="button" onClick={onNext} className={pillClass("solid", "lg", "")}>
          Continue to details
        </button>
      </div>
    </section>
  );
}

// ——— Step 2: customer details ———

function DetailsStep({
  details,
  onChange,
  onBack,
  onNext,
}: {
  details: Details;
  onChange: (d: Details) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const set = (key: keyof Details) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...details, [key]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-7 rounded-lg border bg-card p-5 sm:p-8"
    >
      <section>
        <h2 className="text-xl font-semibold tracking-tight">Contact details</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Full name *</Label>
            <Input id="name" required autoComplete="name" value={details.name} onChange={set("name")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              pattern={"[0-9\\+\\s\\(\\)\\-]{9,}"}
              title="Enter a phone number, e.g. 024 000 0000"
              placeholder="024 000 0000"
              value={details.phone}
              onChange={set("phone")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" required autoComplete="email" aria-describedby="checkout-receipt" value={details.email} onChange={set("email")} />
            <p id="checkout-receipt" className="text-xs text-muted-foreground">We’ll send your receipt to this address.</p>
          </div>
        </div>
      </section>

      <section className="border-t pt-6">
        <fieldset>
          <legend className="text-lg font-semibold">Delivery or pickup</legend>
          <div className="mt-3 divide-y rounded-md border">
            {(["delivery", "pickup"] as const).map((method) => (
              <label key={method} className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium">
                <input
                  type="radio"
                  name="fulfilment"
                  value={method}
                  checked={details.fulfilment === method}
                  onChange={() => onChange({ ...details, fulfilment: method })}
                  className="size-4 accent-brand"
                />
                {method === "delivery" ? "Delivery" : "Pickup"}
              </label>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {details.fulfilment === "delivery"
              ? "We’ll call to confirm the delivery time and any fee."
              : "We’ll send you the pickup details."}
          </p>
        </fieldset>
        {details.fulfilment === "delivery" && (
          <div className="mt-5 space-y-2">
            <Label htmlFor="address">Delivery address *</Label>
            <Textarea
              id="address"
              required
              autoComplete="street-address"
              rows={3}
              placeholder="House number, street, area, city, and a landmark or GhanaPost GPS address"
              value={details.address}
              onChange={set("address")}
            />
          </div>
        )}
        <div className="mt-5 space-y-2">
          <Label htmlFor="notes">Order notes <span className="font-normal text-muted-foreground">(optional)</span></Label>
          <Textarea id="notes" rows={2} value={details.notes} onChange={set("notes")} />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center justify-center gap-2 text-sm underline-offset-4 hover:underline">
          Back to cart
        </button>
        <button type="submit" className="min-h-11 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Continue to payment
        </button>
      </div>
    </form>
  );
}

// ——— Step 3: payment ———

function PaymentStep({
  details,
  lines,
  total,
  onBack,
  onPlaced,
}: {
  details: Details;
  lines: CartLine[];
  total: number;
  onBack: () => void;
  onPlaced: (p: Placed) => void;
}) {
  const [method, setMethod] = useState<Method>(paystackEnabled ? "paystack" : "momo");
  const [transactionId, setTransactionId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const order = (reference: string, payment: Record<string, unknown>) => ({
    ...details,
    address: details.fulfilment === "delivery" ? details.address : "",
    items: lines.map(({ id, name, business, price, qty }) => ({ id, name, business, price, qty, sample: isSample(id) || undefined })),
    total,
    currency: PAYMENT.currency,
    reference,
    ...payment,
  });

  async function payOnline() {
    setError(null);
    setBusy(true);
    const reference = newReference("order");
    try {
      const result = await payWithPaystack({
        email: details.email,
        amount: total,
        reference,
        name: details.name,
        phone: details.phone,
        metadata: {
          custom_fields: [
            { display_name: "Items", variable_name: "items", value: lines.map((l) => `${l.qty} × ${l.name}`).join(", ") },
            { display_name: "Fulfilment", variable_name: "fulfilment", value: details.fulfilment },
          ],
        },
      });
      if (result.status === "cancelled") {
        setError("Payment was cancelled. Your cart is saved, so you can try again.");
        setBusy(false);
        return;
      }
      // Payment went through: always show the confirmation, even if notifying the team fails.
      let warning: string | undefined;
      try {
        await submitRequest(
          "order",
          order(reference, { paymentMethod: "paystack", paymentStatus: "paid", paystackReference: result.reference, paystackTransactionId: result.transactionId }),
          reference,
        );
      } catch {
        warning = "Your payment went through, but we couldn't send your order details. Please contact us with your order reference.";
      }
      onPlaced({ reference, method: "paystack", lines, total, details, warning });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  async function submitMomo(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const reference = newReference("order");
    try {
      await submitRequest(
        "order",
        order(reference, { paymentMethod: "momo-transfer", paymentStatus: "awaiting verification", transactionId: transactionId.trim() }),
        reference,
      );
      onPlaced({ reference, method: "momo", lines, total, details });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <section>
      <h2 className="text-xl font-light tracking-tight sm:text-2xl">Payment</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Amount to pay: <strong className="text-foreground">{formatPrice(total)}</strong>
      </p>

      <div role="radiogroup" aria-label="Payment method" className="mt-5 grid gap-3 sm:grid-cols-2">
        {paystackEnabled && (
          <Choice
            name="method"
            checked={method === "paystack"}
            onSelect={() => setMethod("paystack")}
            icon={<CreditCardIcon className="size-5" />}
            title="Pay online"
            text="Mobile Money (MTN, Telecel, AirtelTigo) or card. Confirmed instantly."
            badge="Recommended"
          />
        )}
        <Choice
          name="method"
          checked={method === "momo"}
          onSelect={() => setMethod("momo")}
          icon={<SmartphoneIcon className="size-5" />}
          title="Mobile Money transfer"
          text="Send money yourself, then enter the transaction ID. Confirmed after we check it."
        />
      </div>

      {method === "paystack" ? (
        <div className="mt-6 rounded-2xl border bg-card p-5 sm:p-6">
          <p className="flex items-start gap-3 text-sm text-muted-foreground">
            <LockIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
            You'll pay in Paystack's secure window. Approve the prompt on your phone for Mobile Money, or enter your card
            details. We never see your PIN or card number.
          </p>
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          <button type="button" onClick={payOnline} disabled={busy} className={pillClass("solid", "lg", "mt-5 w-full")}>
            {busy ? "Waiting for payment…" : `Pay ${formatPrice(total)}`}
          </button>
        </div>
      ) : (
        <form onSubmit={submitMomo} className="mt-6 space-y-5">
          <div className="rounded-2xl bg-ink p-5 text-white sm:p-6">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-white/80">
              <li>Open your Mobile Money menu or app and choose "Send money".</li>
              <li>
                Send <strong className="text-white">{formatPrice(total)}</strong> to{" "}
                <strong className="text-white">{PAYMENT.momoNumber}</strong> ({PAYMENT.momoNetwork}).
              </li>
              <li>
                Check that the recipient name shows <strong className="text-white">{PAYMENT.momoAccountName}</strong> before
                confirming.
              </li>
              <li>Copy the transaction ID from your confirmation message and enter it below.</li>
            </ol>
            <p className="mt-4 text-xs text-white/50">Never share your Mobile Money PIN with anyone. We will never ask for it.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="transactionId">Mobile Money transaction ID *</Label>
            <Input
              id="transactionId"
              required
              placeholder="From your payment confirmation SMS"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={busy} className={pillClass("solid", "lg", "w-full")}>
            {busy ? "Submitting…" : "Submit order for confirmation"}
          </button>
        </form>
      )}

      <button type="button" onClick={onBack} disabled={busy} className={pillClass("outline", "lg", "mt-6")}>
        Back to details
      </button>
    </section>
  );
}

// ——— Confirmation ———

function Confirmation({ placed }: { placed: Placed }) {
  const paid = placed.method === "paystack";
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border bg-card p-6 text-center sm:p-10">
        {paid ? <CheckCircle2Icon className="mx-auto size-12" /> : <ClockIcon className="mx-auto size-12" />}
        <h2 className="mt-4 text-2xl font-light tracking-tight">{paid ? "Thank you, your order is placed" : "Order received"}</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {paid
            ? `Your payment was received. A receipt has been sent to ${placed.details.email}.`
            : "We'll check your Mobile Money payment and then confirm your order."}{" "}
          We'll contact you on {placed.details.phone} to arrange {placed.details.fulfilment === "delivery" ? "delivery" : "pickup"}.
        </p>
        <p className="mt-6 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Order reference</p>
        <p className="mt-1 font-mono text-lg font-medium">{placed.reference}</p>
        {placed.warning && <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{placed.warning}</p>}
      </div>

      <div className="mt-6 rounded-3xl border bg-card p-6">
        <h3 className="flex items-center gap-2 font-medium">
          <PackageIcon className="size-4" /> Order summary
        </h3>
        <ul className="mt-4 space-y-3 text-sm">
          {placed.lines.map((l) => (
            <li key={l.id} className="flex items-center gap-3">
              <ProductImage src={offeringImage(findOffering(l.id))} alt="" zoom={false} className="size-12 shrink-0 rounded-lg" />
              <span className="min-w-0 flex-1">
                {l.qty} × {l.name}
              </span>
              <span>{formatPrice(l.qty * l.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t pt-4 font-medium">
          <span>{paid ? "Paid" : "To be verified"}</span>
          <span>{formatPrice(placed.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/service-center" className={pillClass("solid", "lg", "")}>
          Back to the Service Center
        </Link>
      </div>
    </div>
  );
}

// ——— Shared pieces ———

function Summary({
  lines,
  total,
  details,
  fulfilment,
  editable,
  onEdit,
}: {
  lines: CartLine[];
  total: number;
  details?: Details;
  fulfilment?: Fulfilment;
  editable: boolean;
  onEdit: (s: Step) => void;
}) {
  const count = lines.reduce((n, l) => n + l.qty, 0);
  return (
    <aside aria-labelledby="checkout-summary-title" className="h-fit min-w-0 rounded-lg border bg-card p-5 sm:p-6 lg:sticky lg:top-24">
      <div className="flex items-baseline justify-between gap-3 border-b pb-4">
        <h2 id="checkout-summary-title" className="text-lg font-semibold tracking-tight">Order summary</h2>
        {editable && (
          <button type="button" onClick={() => onEdit("cart")} className="shrink-0 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Edit cart
          </button>
        )}
      </div>
      <ul className="divide-y text-sm">
        {lines.map((l) => (
          <li key={l.id} className="flex items-start gap-3 py-4">
            <ProductImage src={offeringImage(findOffering(l.id))} alt="" zoom={false} className="size-12 shrink-0 rounded-md bg-card" />
            <div className="min-w-0 flex-1">
              <p className="font-medium break-words">{l.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">Qty {l.qty}</p>
            </div>
            <span className="shrink-0 font-medium tabular-nums">{formatPrice(l.qty * l.price)}</span>
          </li>
        ))}
      </ul>
      <div className="space-y-2 border-t pt-4 text-sm tabular-nums">
        <div className="flex justify-between gap-3 text-muted-foreground">
          <span>
            Subtotal ({count} {count === 1 ? "item" : "items"})
          </span>
          <span>{formatPrice(total)}</span>
        </div>
        {(fulfilment ?? details?.fulfilment) !== "pickup" && (
          <div className="flex justify-between gap-3 text-muted-foreground">
            <span>Delivery</span>
            <span>Agreed by phone</span>
          </div>
        )}
        <div className="mt-4 flex justify-between gap-3 border-t pt-4 text-lg font-semibold text-foreground">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      {details && (
        <div className="mt-5 space-y-1 border-t pt-4 text-sm wrap-break-word">
          <div className="flex items-center justify-between">
            <p className="font-medium">{details.fulfilment === "delivery" ? "Deliver to" : "Pickup by"}</p>
            <button type="button" onClick={() => onEdit("details")} className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Edit
            </button>
          </div>
          <p className="text-muted-foreground">{details.name}</p>
          <p className="text-muted-foreground">
            {details.phone} · {details.email}
          </p>
          {details.fulfilment === "delivery" && <p className="whitespace-pre-line text-muted-foreground">{details.address}</p>}
        </div>
      )}
    </aside>
  );
}

// A selectable card backed by a real radio input, so it works with the keyboard and screen readers.
function Choice({
  name,
  checked,
  onSelect,
  icon,
  title,
  text,
  badge,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  text: string;
  badge?: string;
}) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer gap-3 rounded-2xl border bg-card p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40",
        checked ? "border-foreground ring-1 ring-foreground" : "hover:border-foreground/30",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="sr-only" />
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", checked ? "bg-foreground text-background" : "bg-muted")}>{icon}</span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2 font-medium">
          {title}
          {badge && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-normal">{badge}</span>}
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">{text}</span>
      </span>
    </label>
  );
}
