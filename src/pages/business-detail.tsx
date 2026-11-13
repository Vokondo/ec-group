import { useParams } from "react-router";
import { CheckIcon, InfoIcon } from "lucide-react";
import { BUSINESSES, getBusiness, toOffer, type Business } from "@/lib/site";
import { usePageTitle } from "@/lib/use-page-title";
import { MonoLink } from "@/components/mono-link";
import { CoverImage } from "@/components/business-image";
import { BusinessTile } from "@/components/business-visual";
import { DonationPanel, ProjectStory } from "@/components/donation-panel";
import { Container, Eyebrow, SectionHeading, StatusBadge } from "@/components/shared";
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

      {!business.schools && !business.donation && <BusinessStory business={business} />}


      {business.donation && (
        <>
          <ProjectStory donation={business.donation} />
          <DonationPanel donation={business.donation} />
        </>
      )}

      {business.schools && business.schools.length > 0 && (
        <section className="border-t py-12 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Schools"
              title={`${business.schools.length} schools, one purpose`}
              intro={business.why}
            />
            <div className="mt-8 grid gap-4 sm:mt-12 lg:grid-cols-3">
              {business.schools.map((school, i) => (
                <article key={school.name} className="flex flex-col rounded-3xl border bg-card p-6 text-card-foreground sm:p-8">
                  <Eyebrow>School {String(i + 1).padStart(2, "0")}</Eyebrow>
                  <h3 className="mt-3 text-lg font-medium tracking-tight sm:text-xl">{school.name}</h3>
                  <p className="mt-2 text-xl font-light tracking-tight sm:text-2xl">{school.tagline}</p>
                  <p className="mt-4 text-sm text-muted-foreground">{school.intro}</p>
                  <Eyebrow className="mt-6">Programmes</Eyebrow>
                  <ul className="mt-3 space-y-2 text-sm">
                    {school.programmes.map((p) => (
                      <li key={p} className="flex gap-3">
                        <CheckIcon className="mt-0.5 size-4 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t pt-4 text-sm text-muted-foreground lg:mt-auto lg:pt-6">{school.outcome}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {business.synergy && (
        <section className="bg-ink py-12 text-white sm:py-20">
          <Container className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <Eyebrow>Together</Eyebrow>
              <h2 className="mt-3 text-2xl font-light tracking-tight sm:text-3xl lg:text-4xl">{business.synergy.title}</h2>
              <p className="mt-6 text-lg font-light text-white/80 sm:text-xl">{business.synergy.closing}</p>
            </div>
            <ul className="space-y-3">
              {business.synergy.points.map((p) => (
                <li key={p} className="flex gap-3 rounded-2xl border border-white/15 p-4 text-sm sm:text-base">
                  <CheckIcon className="mt-0.5 size-4 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <BusinessOverview business={business} />

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

function BusinessOverview({ business }: { business: Business }) {
  return (
    <section className="border-t bg-card py-12 text-card-foreground sm:py-20">
      <Container className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:gap-12">
        <div>
          <SectionHeading title={`About ${business.name}`} />
          <p className="mt-4 max-w-2xl text-lg font-light">{business.why}</p>
          <p className="mt-3 text-sm text-muted-foreground">{business.audience}</p>
          <h3 className="mt-8 text-base font-medium">{business.donation ? "Areas of work" : "Scope of the initiative"}</h3>
          <ul className="mt-3 divide-y border-y">
            {business.offers.map(toOffer).map((offer) => (
              <li key={offer.title} className="flex items-center gap-4 py-3 text-sm">
                {offer.image && (
                  <div className="relative isolate size-14 shrink-0 overflow-hidden rounded-md">
                    <CoverImage src={offer.image} alt="" overlay="from-transparent to-transparent" />
                  </div>
                )}
                {offer.title}
              </li>
            ))}
          </ul>
          {business.status === "proposed" && !business.donation && (
            <p className="mt-3 text-xs text-muted-foreground">
              Proposed offerings are subject to change. Details, pricing and timelines will be shared once confirmed.
            </p>
          )}
        </div>
        <aside className="h-fit rounded-lg border p-6">
          <h3 className="font-medium">{business.donation ? "How to get involved" : "What you can do now"}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            {business.available.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <MonoLink to={business.cta.to}>{business.cta.label}</MonoLink>
            <MonoLink to={`/service-center?business=${business.slug}`} variant="outline-light">
              View in Service Center
            </MonoLink>
          </div>
        </aside>
      </Container>
    </section>
  );
}

function BusinessStory({ business }: { business: Business }) {
  const catalog = `/service-center?business=${business.slug}`;

  switch (business.slug) {
    case "green-foods":
      return (
        <section className="py-12 sm:py-20">
          <Container className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="relative isolate aspect-[4/3] overflow-hidden rounded-lg">
              <CoverImage src="/images/home/green-foods.jpg" alt="Fresh produce and a green smoothie" overlay="from-transparent to-transparent" />
            </div>
            <div className="lg:pl-8">
              <Eyebrow>Food & nutrition</Eyebrow>
              <h2 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">Good food for everyday households</h2>
              <p className="mt-4 text-muted-foreground">{business.why}</p>
              <p className="mt-4 text-muted-foreground">Green Foods is developing its product range with a focus on sourcing and handling. Retailers and distributors can get in touch about working together.</p>
              <MonoLink to={business.cta.to} variant="outline-light" className="mt-6">Contact Green Foods</MonoLink>
            </div>
          </Container>
        </section>
      );
    case "barbering-shop":
      return (
        <section className="py-12 sm:py-20">
          <Container>
            <SectionHeading title="The service menu" intro="Explore the planned grooming services and request an appointment through the Service Center." />
            <dl className="mt-8 divide-y border-y">
              <div className="grid gap-2 py-5 sm:grid-cols-2"><dt className="text-lg font-medium">Haircuts & styling</dt><dd className="text-muted-foreground">Cuts and styling for regular upkeep or a change of look.</dd></div>
              <div className="grid gap-2 py-5 sm:grid-cols-2"><dt className="text-lg font-medium">Beard trims & shaves</dt><dd className="text-muted-foreground">Beard shaping, trims and shave services.</dd></div>
            </dl>
            <MonoLink to={catalog} variant="outline-light" className="mt-6">Browse grooming services</MonoLink>
          </Container>
        </section>
      );
    case "bank":
      return (
        <section className="py-12 sm:py-20">
          <Container className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <SectionHeading title="The proposal" intro={business.why} />
            <aside className="rounded-lg border bg-card p-6">
              <h2 className="font-medium">Follow the proposal</h2>
              <p className="mt-2 text-sm text-muted-foreground">Individuals, small businesses and potential partners can register to receive updates.</p>
              <MonoLink to={business.cta.to} variant="outline-light" className="mt-5">Register for updates</MonoLink>
            </aside>
          </Container>
        </section>
      );
    case "cosmetics":
      return (
        <section className="border-y bg-card py-12 sm:py-20">
          <Container>
            <SectionHeading center title="Skincare and everyday care" intro="The proposed range focuses on skincare and personal care. Product details will be shared once the range is confirmed." />
            <div className="mt-6 flex justify-center">
              <MonoLink to={business.cta.to} variant="outline-light">Get product updates</MonoLink>
            </div>
          </Container>
        </section>
      );
    case "bicycle-run":
      return (
        <section className="bg-ink py-12 text-white sm:py-20">
          <Container className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <h2 className="text-3xl font-light tracking-tight sm:text-4xl">Find people to ride with</h2>
            <div>
              <p className="text-white/75">Bicycle Run brings cyclists, fitness enthusiasts and community groups together around recreational riding. Community rides and events are planned.</p>
              <MonoLink to={business.cta.to} variant="outline-dark" className="mt-6">Hear about upcoming rides</MonoLink>
            </div>
          </Container>
        </section>
      );
    default:
      return null;
  }
}
