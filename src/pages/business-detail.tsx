import { useParams } from "react-router";
import { CheckIcon, InfoIcon } from "lucide-react";
import { BUSINESSES, getBusiness } from "@/lib/site";
import { usePageTitle } from "@/lib/use-page-title";
import { MonoLink } from "@/components/mono-link";
import { CoverImage } from "@/components/business-image";
import { BusinessTile } from "@/components/business-visual";
import { Container, Eyebrow, StatusBadge } from "@/components/shared";
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
        <Container className="relative pt-28 pb-12 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28">
          <StatusBadge status={business.status} onDark />
          <p className="mt-6 font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase sm:text-[11px]">{business.sector}</p>
          <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-5xl lg:text-6xl">{business.name}</h1>
          <p className="mt-4 max-w-2xl text-base text-white/80 sm:mt-5 sm:text-lg">{business.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MonoLink to={business.cta.to}>{business.cta.label}</MonoLink>
            {business.secondaryCta && (
              <MonoLink to={business.secondaryCta.to} variant="outline-dark">
                {business.secondaryCta.label}
              </MonoLink>
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

      <section className="bg-card text-card-foreground py-12 sm:py-20">
        <Container className="grid gap-8 lg:gap-12 lg:grid-cols-3">
          <div className="space-y-8 sm:space-y-12 lg:col-span-2">
            <div>
              <Eyebrow>Why it is being established</Eyebrow>
              <p className="mt-3 text-xl font-light tracking-tight sm:text-2xl">{business.why}</p>
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
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">{business.audience}</p>
            </div>
          </div>

          <aside className="h-fit rounded-3xl bg-muted/60 p-6 lg:sticky lg:top-24">
            <h2 className="font-medium">Available now</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {business.available.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground" />
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2">
              <MonoLink to={business.cta.to} className="justify-between">
                {business.cta.label}
              </MonoLink>
              <MonoLink to={`/service-center?business=${business.slug}`} variant="outline-light" className="justify-between">
                View in Service Center
              </MonoLink>
            </div>
          </aside>
        </Container>
      </section>

      <section className="border-t py-12 sm:py-20">
        <Container>
          <h2 className="text-xl font-medium sm:text-2xl">More from the group</h2>
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
