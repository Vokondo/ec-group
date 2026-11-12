import { useRef, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeftIcon,
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
  StoreIcon,
  Trash2Icon,
  TruckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATALOG, PAYMENT, formatPrice } from "@/lib/site";
import { newReference, submitRequest } from "@/lib/submit";
import { payWithPaystack, paystackEnabled } from "@/lib/paystack";
import { monoButtonClass } from "@/lib/mono-button";
import { Button, buttonVariants } from "@/components/ui/button";
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
          <Link to="/service-center?kind=product" className={cn(buttonVariants(), "rounded-full")}>
            Browse products
          </Link>
          <Link to="/service-center/interest" className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
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

      <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[3fr_2fr] lg:gap-10">
        <div>
          {step === "cart" && <CartStep lines={lines} setQty={setQty} total={total} onNext={() => go("details")} />}
          {step === "details" && (
            <DetailsStep details={details} onChange={setDetails} onBack={() => go("cart")} onNext={() => go("payment")} />
          )}
          {step === "payment" && (
            <PaymentStep details={details} lines={lines} total={total} onBack={() => go("details")} onPlaced={onPlaced} />
          )}
        </div>
        <Summary lines={lines} total={total} details={step === "payment" ? details : undefined} editable={step !== "cart"} onEdit={go} />
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
                  active && "border-brand bg-brand text-brand-foreground",
                  done && "border-foreground bg-foreground text-background",
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
      <ul className="mt-5 divide-y rounded-2xl border bg-card">
        {lines.map((l) => (
          <li key={l.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
            <div className="min-w-40 flex-1">
              <p className="font-medium">{l.name}</p>
              <p className="text-xs text-muted-foreground">
                {l.business} · {formatPrice(l.price)} each
                {isSample(l.id) && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px]">Sample price</span>}
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full border p-0.5">
              <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label={`Decrease ${l.name}`} onClick={() => setQty(l.id, l.qty - 1)}>
                <MinusIcon />
              </Button>
              <span className="w-6 text-center text-sm" aria-live="polite">
                {l.qty}
              </span>
              <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label={`Increase ${l.name}`} onClick={() => setQty(l.id, l.qty + 1)}>
                <PlusIcon />
              </Button>
            </div>
            <p className="w-20 text-right text-sm font-medium">{formatPrice(l.qty * l.price)}</p>
            <Button size="icon-sm" variant="ghost" className="rounded-full text-muted-foreground" aria-label={`Remove ${l.name}`} onClick={() => setQty(l.id, 0)}>
              <Trash2Icon />
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between px-4 text-lg font-medium">
        <span>Subtotal</span>
        <span>{formatPrice(total)}</span>
      </div>
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link to="/service-center" className={monoButtonClass("outline-light", "sm:h-10")}>
          Continue shopping
        </Link>
        <button type="button" onClick={onNext} className={monoButtonClass("solid", "sm:h-10")}>
          Continue to details <span aria-hidden className="text-[8px]">▶</span>
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
      className="space-y-8"
    >
      <section>
        <h2 className="text-xl font-light tracking-tight sm:text-2xl">Your details</h2>
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
            <Input id="email" type="email" required autoComplete="email" value={details.email} onChange={set("email")} />
            <p className="text-xs text-muted-foreground">Your receipt is sent here.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium">Delivery or pickup</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Choice
            name="fulfilment"
            checked={details.fulfilment === "delivery"}
            onSelect={() => onChange({ ...details, fulfilment: "delivery" })}
            icon={<TruckIcon className="size-5" />}
            title="Delivery"
            text="We'll call to agree a delivery time and any delivery fee."
          />
          <Choice
            name="fulfilment"
            checked={details.fulfilment === "pickup"}
            onSelect={() => onChange({ ...details, fulfilment: "pickup" })}
            icon={<StoreIcon className="size-5" />}
            title="Pickup"
            text="Collect your order. We'll send the pickup details."
          />
        </div>
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
          <Label htmlFor="notes">Order notes</Label>
          <Textarea id="notes" rows={2} placeholder="Anything we should know (optional)" value={details.notes} onChange={set("notes")} />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={onBack} className={monoButtonClass("outline-light", "sm:h-10")}>
          <ArrowLeftIcon className="size-3.5" /> Back to cart
        </button>
        <button type="submit" className={monoButtonClass("solid", "sm:h-10")}>
          Continue to payment <span aria-hidden className="text-[8px]">▶</span>
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
          <button type="button" onClick={payOnline} disabled={busy} className={monoButtonClass("solid", "mt-5 w-full sm:h-10")}>
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
          <button type="submit" disabled={busy} className={monoButtonClass("solid", "w-full sm:h-10")}>
            {busy ? "Submitting…" : "Submit order for confirmation"}
          </button>
        </form>
      )}

      <button type="button" onClick={onBack} disabled={busy} className={monoButtonClass("outline-light", "mt-6 sm:h-10")}>
        <ArrowLeftIcon className="size-3.5" /> Back to details
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

      <div className="mt-6 rounded-3xl border p-6">
        <h3 className="flex items-center gap-2 font-medium">
          <PackageIcon className="size-4" /> Order summary
        </h3>
        <ul className="mt-4 space-y-2 text-sm">
          {placed.lines.map((l) => (
            <li key={l.id} className="flex justify-between gap-4">
              <span>
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
        <Link to="/service-center" className={monoButtonClass("solid", "sm:h-10")}>
          Back to the Service Center <span aria-hidden className="text-[8px]">▶</span>
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
  editable,
  onEdit,
}: {
  lines: CartLine[];
  total: number;
  details?: Details;
  editable: boolean;
  onEdit: (s: Step) => void;
}) {
  const count = lines.reduce((n, l) => n + l.qty, 0);
  return (
    <aside className="h-fit space-y-5 rounded-3xl bg-muted/60 p-6 lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Order summary</h2>
        {editable && (
          <button type="button" onClick={() => onEdit("cart")} className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Edit cart
          </button>
        )}
      </div>
      <ul className="space-y-2 text-sm">
        {lines.map((l) => (
          <li key={l.id} className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              {l.qty} × {l.name}
            </span>
            <span>{formatPrice(l.qty * l.price)}</span>
          </li>
        ))}
      </ul>
      <div className="space-y-1 border-t pt-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>
            Subtotal ({count} {count === 1 ? "item" : "items"})
          </span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Delivery</span>
          <span>Agreed by phone</span>
        </div>
        <div className="flex justify-between pt-2 text-base font-medium text-foreground">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      {details && (
        <div className="space-y-1 border-t pt-4 text-sm">
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
        checked ? "border-brand ring-1 ring-brand" : "hover:border-foreground/30",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="sr-only" />
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", checked ? "bg-brand text-brand-foreground" : "bg-muted")}>{icon}</span>
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
