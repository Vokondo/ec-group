import { useState } from "react";
import { Link } from "react-router";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESSES, CATALOG, SITE, type OfferingKind } from "@/lib/site";
import { usePageTitle } from "@/lib/use-page-title";
import { CoverImage } from "@/components/business-image";
import { MonoLabel, MonoLink, TwoTone } from "@/components/mono-link";
import { Container, StatusBadge } from "@/components/shared";

// Landing page layout is modelled on the FMI reference: image hero, a white "explorer" card,
// a dark image card with a link list, a white about card, a short statement and a CTA band.

// Hero photo, e.g. "/images/hero.jpg" in public/. Unset shows a placeholder.
const HERO_IMAGE: string | undefined = undefined;
// Background photo for the Service Center card.
const SERVICE_IMAGE: string | undefined = undefined;

const countOf = (...kinds: OfferingKind[]) => CATALOG.filter((o) => kinds.includes(o.kind)).length;

const SERVICE_LINKS = [
  { label: "Products", to: "/service-center?kind=product", count: countOf("product") },
  { label: "Services & appointments", to: "/service-center?kind=service", count: countOf("service") },
  { label: "Programmes & opportunities", to: "/service-center?kind=programme", count: countOf("programme", "event") },
];

const ABOUT_POINTS = [
  {
    title: "Founder-led",
    text: `Every venture is shaped by ${SITE.founderName}'s long-term vision for enterprise, opportunity and community.`,
  },
  {
    title: `${BUSINESSES.length} ventures, one group`,
    text: `${SITE.holdingName} brings education, food, grooming, finance, beauty, social impact and wellness under one roof.`,
  },
  {
    title: "Community at the core",
    text: "Through the Foundation and the Bicycle Run, the group gives back to the communities that make it possible.",
  },
];

// Home-page cards sit in a wider container than the rest of the site, like the reference's near-full-width cards.
const cardContainer = "max-w-[88rem]";

// White card surface floating on the pale page, like the reference's cards.
const whiteCard = "rounded-2xl bg-card text-card-foreground shadow-[0_20px_50px_-25px_oklch(0.3_0.05_240/0.25)] ring-1 ring-foreground/5";

export default function HomePage() {
  usePageTitle();

  return (
    <>
      <Hero />

      {/* Statement */}
      <section className="pt-16 pb-10 text-center sm:pt-24 sm:pb-14">
        <Container>
          <MonoLabel>Our businesses</MonoLabel>
          <h2 className="mx-auto mt-4 max-w-xl text-2xl leading-tight font-light tracking-tight sm:text-4xl">
            <TwoTone
              parts={[
                ["Seven ventures ", "base"],
                ["are each ", "steel"],
                ["a part of ", "soft"],
                ["something ", "base"],
                ["bigger.", "soft"],
              ]}
            />
          </h2>
        </Container>
      </section>

      <Container className={cardContainer}>
        <BusinessExplorer />
      </Container>

      {/* Service Center: dark image card with a link list */}
      <Container className={cn(cardContainer, "mt-8 sm:mt-14")}>
        <div className="relative isolate grid min-h-[28rem] items-center gap-10 overflow-hidden rounded-2xl p-7 pb-14 text-white ring-1 ring-white/10 sm:min-h-[36rem] sm:rounded-3xl sm:p-14 lg:min-h-[42rem] lg:grid-cols-2 lg:gap-20 lg:p-24">
          <CoverImage src={SERVICE_IMAGE} alt="" overlay="from-black/70 via-black/40 to-black/60" variant="corner" />
          <div>
            <MonoLabel>Unified Service Center</MonoLabel>
            <h2 className="mt-4 text-[2.5rem] leading-[1.02] font-light tracking-tight sm:text-6xl lg:text-7xl">
              One place
              <br />
              for everything
            </h2>
          </div>
          <ul>
            {SERVICE_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="group flex items-center justify-between gap-4 border-b border-white/20 py-4 text-base font-light transition hover:border-white/50 sm:py-6 sm:text-xl"
                >
                  <span>
                    {link.label}
                    <span className="ml-2 font-mono text-[11px] tracking-widest text-white/50 sm:text-xs">{link.count}</span>
                  </span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/40 sm:size-10 transition group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                    <ChevronRightIcon className="size-4 sm:size-5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* About the group */}
      <Container className={cn(cardContainer, "mt-8 sm:mt-14")}>
        <div className={cn(whiteCard, "grid gap-12 p-7 sm:rounded-3xl sm:p-14 lg:min-h-[34rem] lg:grid-cols-2 lg:items-center lg:gap-24 lg:p-24")}>
          <div>
            <MonoLabel>About the group</MonoLabel>
            <h2 className="mt-5 max-w-md text-[2.25rem] leading-tight font-light tracking-tight sm:text-5xl lg:text-6xl">
              <TwoTone
                parts={[
                  ["Long-term thinking ", "base"],
                  ["is at ", "steel"],
                  ["the core ", "warm"],
                  ["of what we build.", "base"],
                ]}
              />
            </h2>
            <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
              <MonoLink to="/about">The founder</MonoLink>
              <MonoLink to="/holding" variant="outline-light">
                Holding company
              </MonoLink>
            </div>
          </div>
          <div className="space-y-8 sm:space-y-10">
            {ABOUT_POINTS.map((point) => (
              <div key={point.title}>
                <h3 className="text-base font-medium sm:text-lg">{point.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Short statement */}
      <section className="py-16 text-center sm:py-24">
        <Container>
          <p className="mx-auto max-w-md text-lg leading-snug font-light sm:text-2xl">
            Where long-term vision meets real community impact.
          </p>
          <MonoLink to="/service-center/interest" variant="pill" arrow={false} className="mt-6 sm:mt-8">
            Register interest
          </MonoLink>
        </Container>
      </section>

      {/* CTA band: the reference's sunset, warm orange into steel blue, then into the dark footer */}
      <section className="relative overflow-hidden bg-[linear-gradient(to_bottom,oklch(0.7_0.14_50),oklch(0.72_0.08_70)_14%,oklch(0.62_0.05_230)_32%,oklch(0.42_0.06_240)_55%,var(--ink))] py-24 text-center text-white sm:py-36">
        <Container>
          <h2 className="text-3xl font-light tracking-tight sm:text-5xl">Ready to get started?</h2>
          <div className="mt-6 flex justify-center gap-2 sm:mt-8 sm:gap-3">
            <MonoLink to="/contact" variant="outline-dark" className="bg-black/20 backdrop-blur-sm">
              Contact us
            </MonoLink>
            <MonoLink to="/service-center">Service Center</MonoLink>
          </div>
        </Container>
      </section>
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-end overflow-hidden text-white sm:min-h-[85vh]">
      <CoverImage src={HERO_IMAGE} alt="" overlay="from-ink via-ink/50 to-ink/70" variant="top" />
      {/* Horizon band, echoing the reference's sunrise: steel-blue sky over a warm orange line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-[34%] -z-10 h-56 bg-[linear-gradient(to_bottom,transparent,oklch(0.45_0.08_240/0.7)_40%,oklch(0.68_0.08_220/0.6)_55%,oklch(0.72_0.15_50/0.85)_66%,transparent_85%)] blur-xl"
      />
      <Container className="grid gap-6 pt-28 pb-10 sm:pb-14 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16 lg:pb-16">
        <h1 className="text-[2.6rem] leading-[1] font-light tracking-tight sm:text-6xl lg:text-7xl">
          Building a group
          <br />
          that grows
          <br />
          together.
        </h1>
        <div className="max-w-sm lg:justify-self-end">
          <p className="text-sm text-white/70">
            Education, food, grooming, finance, beauty, community and wellness: the businesses and initiatives of{" "}
            {SITE.founderName}, gathered in one place.
          </p>
          <MonoLink to="/businesses" variant="outline-dark" className="mt-5">
            Explore the group
          </MonoLink>
        </div>
      </Container>
    </section>
  );
}

// White card listing the seven businesses; selecting one shows its details on the right.
function BusinessExplorer() {
  const [active, setActive] = useState(BUSINESSES[0].slug);
  const business = BUSINESSES.find((b) => b.slug === active)!;

  return (
    <div className={cn(whiteCard, "grid gap-10 p-6 sm:rounded-3xl sm:p-14 lg:min-h-[38rem] lg:grid-cols-2 lg:gap-24 lg:p-24")}>
      <ul role="tablist" aria-label="Businesses" className="self-center">
        {BUSINESSES.map((b) => {
          const selected = b.slug === active;
          return (
            <li key={b.slug}>
              <button
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="business-details"
                onClick={() => setActive(b.slug)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 py-4 text-left text-base transition sm:py-5 sm:text-lg",
                  selected ? "border-b-2 border-foreground font-medium" : "border-b border-border text-foreground/75 hover:text-foreground",
                )}
              >
                {b.name}
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border transition sm:size-7",
                    selected ? "border-foreground bg-foreground text-background" : "border-foreground/25 text-foreground/40",
                  )}
                >
                  <ChevronRightIcon className="size-3.5 sm:size-4" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div id="business-details" role="tabpanel" aria-label={business.name} className="flex flex-col">
        {/* The selected business's photo (set `image` in src/lib/site.ts); keyed so it fades in on change */}
        <div
          key={business.slug}
          className="group relative isolate flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-xl p-4 text-white animate-in fade-in duration-500 sm:p-5 lg:aspect-auto lg:flex-1"
        >
          <CoverImage src={business.image} alt={business.name} overlay="from-black/70 via-transparent to-black/25" />
          <div className="flex justify-end">
            <StatusBadge status={business.status} onDark />
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase sm:text-[11px]">{business.sector}</p>
            <p className="mt-1 text-xl font-light tracking-tight sm:text-2xl">{business.name}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3 lg:justify-end">
          <MonoLink to={`/businesses/${business.slug}`}>{business.name}</MonoLink>
          <MonoLink to="/businesses" variant="outline-light">
            All businesses
          </MonoLink>
        </div>
      </div>
    </div>
  );
}
