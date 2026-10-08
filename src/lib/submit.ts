// Sends every form on the site: inquiries, bookings, interest registrations and orders.
//
// This is a static React app with no server of its own, so submissions go to an external
// form endpoint (e.g. Formspree, Getform, a Google Apps Script, or your own API).
// Set VITE_FORM_ENDPOINT in a .env file. Without it, submissions are only logged to the
// browser console. Fine for development, but nothing reaches the team.

export type RequestType = "inquiry" | "booking" | "interest" | "order";

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
const PREFIX: Record<RequestType, string> = { inquiry: "INQ", booking: "BKG", interest: "INT", order: "ORD" };

export async function submitRequest(type: RequestType, data: Record<string, unknown>): Promise<string> {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";

  if (!name) throw new Error("Please enter your name");
  if (!email && !phone) throw new Error("Please enter an email or phone number");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email");

  const reference = `${PREFIX[type]}-${Date.now().toString(36).toUpperCase()}`;
  const payload = { reference, type, ...data, submittedAt: new Date().toISOString() };

  if (!ENDPOINT) {
    console.info("[form] VITE_FORM_ENDPOINT not set; submission not sent:", payload);
    return reference;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("We couldn't send your request. Please try again or contact us directly.");
  return reference;
}
