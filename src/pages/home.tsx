import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESSES, CATALOG, SITE, type OfferingKind } from "@/lib/site";
import { usePageTitle } from "@/lib/use-page-title";
import { CoverImage } from "@/components/business-image";
import { FounderPortrait } from "@/components/founder-portrait";
import { MonoLabel, MonoLink } from "@/components/mono-link";
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

// Founder card bio (placeholder copy until the founder's own words are confirmed).
const FOUNDER_BIO =
  `An entrepreneur building a portfolio of businesses across education, enterprise and community impact. ` +
  `Every venture is shaped by ${SITE.founderName}'s long-term vision, and ${SITE.holdingName} brings education, food, ` +
  `grooming, finance, beauty, social impact and wellness under one roof. Through the Foundation and the Bicycle Run, ` +
  `the group gives back to the communities that make it possible.`;

// Home-page cards sit in a wider container than the rest of the site, like the reference's near-full-width cards.
const cardContainer = "max-w-[88rem]";

// White card surface floating on the pale page, like the reference's cards.
const whiteCard = "rounded-2xl bg-card text-card-foreground shadow-[0_20px_50px_-25px_oklch(0.3_0.05_262/0.25)] ring-1 ring-foreground/5";

export default function HomePage() {
  usePageTitle();

  return (
    <>
      <Hero />

      {/* Statement */}
      <section className="pt-16 pb-10 text-center sm:pt-24 sm:pb-14">
        <Container>
          <MonoLabel>Our businesses</MonoLabel>
          <h2 className="mx-auto mt-4 max-w-xl text-2xl leading-tight font-light tracking-tight text-black sm:text-4xl">
            Seven ventures are each a part of something bigger.
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

      {/* Founder card: portrait on the left, details on the right */}
      <Container className={cn(cardContainer, "mt-8 sm:mt-14")}>
        <div className={cn(whiteCard, "grid overflow-hidden sm:rounded-3xl lg:min-h-[42rem] lg:grid-cols-[1.1fr_1fr]")}>
          <FounderPortrait className="aspect-[4/3] lg:aspect-auto" />
          {/* Name at the top, bio and actions at the bottom, as in the reference's text cards */}
          <div className="flex flex-col justify-between gap-12 p-7 sm:p-12 lg:p-14">
            <div>
              <MonoLabel>The founder</MonoLabel>
              <h2 className="mt-4 text-3xl leading-[1.05] font-light tracking-tight text-black sm:text-4xl lg:text-5xl">
                {SITE.founderName}
              </h2>
              <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase sm:text-[11px]">
                Founder · {SITE.holdingName}
              </p>
            </div>
            <div>
              <p className="text-base leading-relaxed font-light text-muted-foreground sm:text-lg">{FOUNDER_BIO}</p>
              <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
                <MonoLink to="/about">Read the story</MonoLink>
                <MonoLink to="/holding" variant="outline-light">
                  Holding company
                </MonoLink>
              </div>
            </div>
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

      {/* CTA band: black gradient with a soft spotlight behind the heading and a thin light line along the top */}
      <section className="relative isolate overflow-hidden bg-[linear-gradient(to_bottom,oklch(0.11_0_0),oklch(0.05_0_0)_60%,var(--ink))] py-24 text-center text-white sm:py-36">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          {/* Spotlight behind the heading */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_42%,oklch(0.42_0_0/0.55),transparent_70%)]" />
          {/* Thin light line along the top edge */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="absolute inset-x-[20%] top-0 h-24 bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgb(255_255_255/0.10),transparent)]" />
        </div>
        <Container>
          <h2 className="text-3xl font-light tracking-tight sm:text-5xl">Ready to get started?</h2>
          <div className="mt-6 flex justify-center gap-2 sm:mt-8 sm:gap-3">
            <MonoLink to="/contact" variant="outline-dark">
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
// How long each business stays selected before the explorer moves on.
const ROTATE_MS = 5000;

function BusinessExplorer() {
  const [active, setActive] = useState(BUSINESSES[0].slug);
  // Paused while the visitor hovers or focuses the card, so it never moves under them.
  const [paused, setPaused] = useState(false);
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const business = BUSINESSES.find((b) => b.slug === active)!;

  // Auto-advance; keyed on `active`, so a manual click restarts the timer from that business.
  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = window.setTimeout(() => {
      const i = BUSINESSES.findIndex((b) => b.slug === active);
      setActive(BUSINESSES[(i + 1) % BUSINESSES.length].slug);
    }, ROTATE_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, reducedMotion]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
      className={cn(whiteCard, "grid gap-10 p-6 sm:rounded-3xl sm:p-14 lg:min-h-[38rem] lg:grid-cols-2 lg:gap-24 lg:p-24")}
    >
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
                  "relative flex w-full items-center justify-between gap-4 border-b border-border py-4 text-left text-base transition-colors duration-500 sm:py-5 sm:text-lg",
                  selected ? "text-foreground" : "text-foreground/60 hover:text-foreground",
                )}
              >
                {/* Active underline doubles as a progress bar that fills until the next business */}
                {selected && (
                  <span
                    key={b.slug}
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-foreground"
                    style={
                      reducedMotion
                        ? undefined
                        : { animation: `explorer-progress ${ROTATE_MS}ms linear`, animationPlayState: paused ? "paused" : "running" }
                    }
                  />
                )}
                <span className={cn("transition-transform duration-500 ease-out", selected && "translate-x-1.5")}>{b.name}</span>
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-out sm:size-7",
                    selected ? "scale-110 border-foreground bg-foreground text-background" : "border-foreground/25 text-foreground/40",
                  )}
                >
                  <ChevronRightIcon className={cn("size-3.5 transition-transform duration-500 sm:size-4", selected && "translate-x-px")} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div id="business-details" role="tabpanel" aria-label={business.name} className="flex flex-col">
        {/* The selected business's photo (set `image` in src/lib/site.ts). The dark frame stays put while each
            new image settles in from a slight zoom and blur, and the caption slides up after it. */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-900 lg:aspect-auto lg:flex-1">
          <div
            key={business.slug}
            className="explorer-image group absolute inset-0 isolate flex flex-col justify-between p-4 text-white sm:p-5"
          >
            <CoverImage src={business.image} alt={business.name} overlay="from-black/70 via-transparent to-black/25" />
            <div className="explorer-rise flex justify-end [--rise-delay:250ms]">
              <StatusBadge status={business.status} onDark />
            </div>
            <div>
              <p className="explorer-rise font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase [--rise-delay:200ms] sm:text-[11px]">
                {business.sector}
              </p>
              <p className="explorer-rise mt-1 text-xl font-light tracking-tight [--rise-delay:320ms] sm:text-2xl">
                {business.name}
              </p>
            </div>
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
