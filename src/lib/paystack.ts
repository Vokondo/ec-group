import { PAYMENT } from "@/lib/site";

export const paystackEnabled = Boolean(PAYMENT.paystackPublicKey);

export type PaystackResult = { status: "success"; reference: string; transactionId: number } | { status: "cancelled" };

// Opens Paystack's secure payment window (Mobile Money or card) and resolves when the customer
// finishes or closes it. The library is loaded on demand so it only downloads at checkout.
//
// Note: this site has no server, so a "success" here is the payment window's own report. Confirm
// each payment in the Paystack dashboard (or add a webhook) before fulfilling the order.
export async function payWithPaystack(options: {
  email: string;
  amount: number; // In cedis
  reference: string;
  name: string;
  phone: string;
  metadata?: Record<string, unknown>;
}): Promise<PaystackResult> {
  if (!PAYMENT.paystackPublicKey) throw new Error("Online payment is not set up yet. Please use Mobile Money transfer.");
  const { default: PaystackPop } = await import("@paystack/inline-js");
  const [firstName, ...rest] = options.name.trim().split(/\s+/);

  return new Promise((resolve, reject) => {
    new PaystackPop().newTransaction({
      key: PAYMENT.paystackPublicKey!,
      email: options.email,
      amount: Math.round(options.amount * 100),
      currency: PAYMENT.currency,
      reference: options.reference,
      firstName,
      lastName: rest.join(" ") || undefined,
      phone: options.phone,
      channels: ["mobile_money", "card"],
      metadata: options.metadata,
      onSuccess: (t) => resolve({ status: "success", reference: t.reference, transactionId: t.id }),
      onCancel: () => resolve({ status: "cancelled" }),
      onError: (e) => reject(new Error(e.message || "The payment window could not be opened. Please try again.")),
    });
  });
}
