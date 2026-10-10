import { useState } from "react";
import { CheckCircle2Icon } from "lucide-react";
import { BUSINESSES } from "@/lib/site";
import { submitRequest } from "@/lib/submit";
import { monoButtonClass } from "@/lib/mono-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type FormType = "inquiry" | "booking" | "interest";

const COPY: Record<FormType, { submit: string; done: string; message: string }> = {
  inquiry: { submit: "Send inquiry", done: "Thank you. Your inquiry has been received and we'll be in touch.", message: "How can we help?" },
  booking: { submit: "Request appointment", done: "Thank you. Your request has been received and we'll contact you to confirm a time.", message: "Services you're interested in, or anything we should know" },
  interest: { submit: "Register interest", done: "Thank you. We'll let you know as soon as there's news.", message: "What are you interested in? (optional)" },
};

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function InquiryForm({
  type,
  defaultBusiness = "",
  defaultTopic = "",
}: {
  type: FormType;
  defaultBusiness?: string;
  defaultTopic?: string;
}) {
  const [state, setState] = useState<{ status: "idle" | "sending" | "done" | "error"; message?: string }>({ status: "idle" });
  const copy = COPY[type];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "sending" });
    try {
      const reference = await submitRequest(type, Object.fromEntries(new FormData(e.currentTarget)));
      setState({ status: "done", message: reference });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Something went wrong" });
    }
  }

  if (state.status === "done") {
    return (
      <div className="rounded-2xl border bg-muted p-6 text-center sm:p-8">
        <CheckCircle2Icon className="mx-auto size-10" />
        <p className="mt-4 font-medium">{copy.done}</p>
        <p className="mt-2 text-sm">
          Reference: <span className="font-mono font-medium">{state.message}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name">Full name *</Label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="business">Business</Label>
        <select id="business" name="business" defaultValue={defaultBusiness} className={selectClass}>
          <option value="">General / the whole group</option>
          {BUSINESSES.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone / WhatsApp</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>

      {type === "booking" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="date">Preferred date</Label>
            <Input id="date" name="date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Preferred time</Label>
            <Input id="time" name="time" type="time" />
          </div>
        </>
      )}

      {type === "inquiry" && (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="topic">Topic</Label>
          <Input id="topic" name="topic" defaultValue={defaultTopic} placeholder="e.g. partnership, distribution, volunteering" />
        </div>
      )}

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="message">{copy.message}</Label>
        <Textarea id="message" name="message" rows={5} required={type === "inquiry"} />
      </div>

      <p className="text-xs text-muted-foreground sm:col-span-2">Please provide at least an email or a phone number so we can reply.</p>

      {state.status === "error" && <p className="text-sm text-destructive sm:col-span-2">{state.message}</p>}

      <div className="sm:col-span-2">
        <button type="submit" className={monoButtonClass("solid", "sm:h-10 sm:px-6")} disabled={state.status === "sending"}>
          {state.status === "sending" ? "Sending…" : copy.submit}
        </button>
      </div>
    </form>
  );
}
