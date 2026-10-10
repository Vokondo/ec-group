import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { BUSINESSES, SITE } from "@/lib/site";
import { usePageTitle } from "@/lib/use-page-title";
import { buttonVariants } from "@/components/ui/button";
import { BusinessTile } from "@/components/business-visual";
import { Container, Eyebrow, PageHero, SectionHeading, onDarkPrimary } from "@/components/shared";

const STRATEGIC_AREAS = [
  "Education and skills development",
  "Food security and nutrition",
  "Personal care and consumer goods",
  "Financial inclusion",
  "Community development",
  "Health, fitness and wellness",
];

export default function HoldingPage() {
  usePageTitle("Holding Company");

  return (
    <>
      <PageHero
        eyebrow="Holding Company"
        title={SITE.holdingName}
        intro={`The central organization that brings together the businesses and initiatives founded by ${SITE.founderName}.`}
      >
        <Link to="/contact?topic=partnership" className={cn(buttonVariants({ size: "lg" }), onDarkPrimary)}>
          Partnership inquiries
        </Link>
      </PageHero>

      <section className="bg-card text-card-foreground py-12 sm:py-20">
        <Container className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">Corporate background and objectives</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground sm:space-y-4 sm:text-base">
            <p>
              {SITE.holdingName} was established to own, guide and grow a portfolio of businesses across different
              sectors. It provides shared leadership, strategy and resources so that each venture can focus on serving
              its customers.
            </p>
            <p>[Corporate background: year of incorporation, registration details and key milestones.]</p>
            <p>
              Most of our businesses are in their early stages. For now, our focus is to introduce each venture, build
              awareness and lay the foundations for full operations.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-muted/60 py-12 sm:py-20">
        <Container className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-card p-6 text-card-foreground sm:p-8">
            <Eyebrow>Vision</Eyebrow>
            <p className="mt-3 text-lg font-medium sm:mt-4 sm:text-xl">[A diversified group that creates lasting value for its customers, people and communities.]</p>
          </div>
          <div className="rounded-3xl bg-ink p-6 text-white sm:p-8">
            <Eyebrow>Mission</Eyebrow>
            <p className="mt-3 text-lg font-medium sm:mt-4 sm:text-xl">[To build and support businesses that deliver quality, widen access and give back.]</p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Business portfolio"
            title="Seven businesses and initiatives"
            intro="Each entity has its own page describing what it is, why it is being established, what it intends to offer and how you can engage today."
          />
          <div className="mt-8 sm:mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BUSINESSES.map((b) => (
              <BusinessTile key={b.slug} business={b} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-12 sm:py-20 text-white">
        <Container className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Strategic areas of interest</Eyebrow>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">Where we invest our energy</h2>
            <p className="mt-5 text-white/70">
              We welcome conversations with partners, investors and institutions who share these interests.
            </p>
            <Link to="/contact?topic=partnership" className={cn(buttonVariants({ size: "lg" }), onDarkPrimary, "mt-8")}>
              Start a conversation
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {STRATEGIC_AREAS.map((area, i) => (
              <li key={area} className="flex items-center gap-3 rounded-xl border border-white/15 p-4">
                <span className="text-xs font-semibold text-white/50">0{i + 1}</span>
                <span className="text-sm">{area}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
