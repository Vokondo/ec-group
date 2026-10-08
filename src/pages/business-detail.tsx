import { Link, useParams } from "react-router";
import { CheckIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESSES, getBusiness } from "@/lib/site";
import { usePageTitle } from "@/lib/use-page-title";
import { buttonVariants } from "@/components/ui/button";
import { CoverImage } from "@/components/business-image";
import { BusinessTile } from "@/components/business-visual";
import { Container, Eyebrow, StatusBadge, onDarkOutline, onDarkPrimary } from "@/components/shared";
import NotFoundPage from "@/pages/not-found";

export default function BusinessDetailPage() {
  const { slug } = useParams();
  const business = getBusiness(slug);
  usePageTitle(business?.name ?? "Not found");
  if (!business) return <NotFoundPage />;

  const others = BUSINESSES.filter((b) => b.slug !== business.slug).slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <CoverImage src={business.image} alt={business.name} overlay="from-black/90 via-black/60 to-black/30" variant="corner" />
        <Container className="relative py-20 sm:py-28">
          <StatusBadge status={business.status} onDark />
          <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">{business.sector}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">{business.name}</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">{business.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={business.cta.to} className={cn(buttonVariants({ size: "lg" }), onDarkPrimary)}>
              {business.cta.label}
            </Link>
            {business.secondaryCta && (
              <Link to={business.secondaryCta.to} className={cn(buttonVariants({ variant: "outline", size: "lg" }), onDarkOutline)}>
                {business.secondaryCta.label}
              </Link>
            )}
          </div>
        </Container>
      </section>

      {business.slug === "bank" && (
        <div className="border-b bg-muted">
          <Container className="flex gap-3 py-4 text-sm">
            <InfoIcon className="mt-0.5 size-4 shrink-0" />
            <p>
              <strong>Important:</strong> This is a proposed financial institution. It does not currently offer banking,
              deposit, lending or payment services, and does not accept funds from the public. Services will be offered
              only after all required regulatory authorizations have been obtained.
            </p>
          </Container>
        </div>
      )}

      <section className="light bg-background text-foreground py-20">
        <Container className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <div>
              <Eyebrow>Why it is being established</Eyebrow>
              <p className="mt-3 text-2xl font-medium">{business.why}</p>
            </div>
            <div>
              <Eyebrow>What it intends to offer</Eyebrow>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {business.offers.map((o) => (
                  <li key={o} className="flex gap-3 rounded-xl border p-4 text-sm">
                    <CheckIcon className="mt-0.5 size-4 shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Proposed offerings are subject to change. Prices, programme details and timelines will be published once
                confirmed.
              </p>
            </div>
            <div>
              <Eyebrow>Who it aims to serve</Eyebrow>
              <p className="mt-3 text-muted-foreground">{business.audience}</p>
            </div>
          </div>

          <aside className="h-fit rounded-3xl bg-muted/60 p-6 lg:sticky lg:top-24">
            <h2 className="font-semibold">Available now</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {business.available.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground" />
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2">
              <Link to={business.cta.to} className={cn(buttonVariants(), "rounded-full")}>
                {business.cta.label}
              </Link>
              <Link to={`/service-center?business=${business.slug}`} className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
                View in Service Center
              </Link>
            </div>
          </aside>
        </Container>
      </section>

      <section className="border-t py-20">
        <Container>
          <h2 className="text-2xl font-medium">More from the group</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {others.map((b) => (
              <BusinessTile key={b.slug} business={b} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
