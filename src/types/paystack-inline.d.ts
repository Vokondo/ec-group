// Minimal types for @paystack/inline-js, which ships without its own.
declare module "@paystack/inline-js" {
  export type PaystackTransaction = { id: number; reference: string; message: string };
  export type NewTransactionOptions = {
    key: string;
    email: string;
    amount: number; // In the currency's smallest unit (pesewas for GHS)
    currency?: string;
    reference?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    channels?: string[];
    metadata?: Record<string, unknown>;
    onSuccess?: (transaction: PaystackTransaction) => void;
    onCancel?: () => void;
    onError?: (error: { message: string }) => void;
  };
  export default class PaystackPop {
    newTransaction(options: NewTransactionOptions): unknown;
  }
}
