import { cn } from "@/lib/utils";
import { BUSINESSES, SITE } from "@/lib/site";
import { usePageTitle } from "@/lib/use-page-title";
import { MonoLink } from "@/components/mono-link";
import { BusinessTile } from "@/components/business-visual";
import { BrandMark } from "@/components/brand-mark";
import { Container, Eyebrow, PageHero, SectionHeading } from "@/components/shared";

// What the holding company provides to every business in the group.
const SHARED_SUPPORT = [
  { title: "Strategy and leadership", text: "Each venture gets clear goals, experienced guidance and regular reviews as it moves from idea to operation." },
  { title: "Brand and marketing", text: "A shared brand, one website and joint campaigns help every business reach customers from day one." },
  { title: "Governance and compliance", text: "Registration, licensing and sound financial practice are put in place before products or services launch." },
  { title: "One front door", text: "The Shop gives customers a single place to shop, book, register interest and get support across the group." },
];

const STRATEGIC_AREAS = [
  "Education and skills development",
  "Food security and nutrition",
  "Personal care and consumer goods",
  "Fashion and apparel",
  "Financial inclusion",
  "Community development",
  "Health, fitness and wellness",
];

export default function HoldingPage() {
  usePageTitle("Holding Company");

  return (
    <>
      <PageHero
        logo={<BrandMark src="/brand/chanimbe-group.png" alt={`${SITE.holdingName} logo`} className="h-14 sm:h-16" />}
        eyebrow="Holding Company"
        title={SITE.holdingName}
        intro={`The central organization that brings together the businesses and initiatives founded by ${SITE.founderName}.`}
      >
        <MonoLink to="/contact?topic=partnership">Partnership inquiries</MonoLink>
      </PageHero>

      <section className="bg-card text-card-foreground py-12 sm:py-20">
        <Container className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="mt-3 text-2xl font-light tracking-tight sm:text-3xl">Corporate background and objectives</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground sm:space-y-4 sm:text-base">
            <p>
              {SITE.holdingName} was established to own, guide and grow a portfolio of businesses across different
              sectors. It provides shared leadership, strategy and resources so that each venture can focus on serving
              its customers.
            </p>
            <p>
              Each business keeps its own identity and focus, while the group provides a shared brand, standards and
              support, and a single place for customers to reach every venture.
            </p>
            <p>
              Most of our businesses are in their early stages. For now, our focus is to introduce each venture, build
              awareness and lay the foundations for full operations.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-muted/60 py-12 sm:py-20">
        <Container className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-card p-6 text-card-foreground sm:p-8">
            <Eyebrow>Vision</Eyebrow>
            <p className="mt-3 text-lg font-light tracking-tight sm:mt-4 sm:text-xl">A diversified Ghanaian group that creates lasting value for its customers, its people and the communities it serves.</p>
          </div>
          <div className="rounded-2xl bg-ink p-6 text-white sm:p-8">
            <Eyebrow>Mission</Eyebrow>
            <p className="mt-3 text-lg font-light tracking-tight sm:mt-4 sm:text-xl">To build and support businesses that deliver quality, widen access to essential services and give back.</p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Business portfolio"
            title="Eight businesses and initiatives"
            intro="Each entity has its own page describing what it is, why it is being established, what it intends to offer and how you can engage today."
          />
          {/* Bento: the first business fills a 2×2 block beside a 2×2 of four more; the rest share the
              last row in pairs (an odd one out spans it), so the grid always ends flush. */}
          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {BUSINESSES.map((b, i) => {
              const feature = i === 0;
              const tail = i >= 5;
              const lastAlone = tail && i === BUSINESSES.length - 1 && (BUSINESSES.length - 5) % 2 === 1;
              return (
                <BusinessTile
                  key={b.slug}
                  business={b}
                  large={feature}
                  className={cn(
                    "min-h-36 sm:min-h-40",
                    feature && "min-h-52 sm:col-span-2 sm:min-h-52 lg:row-span-2 lg:min-h-0",
                    tail && !lastAlone && "lg:col-span-2",
                    lastAlone && "sm:col-span-2 lg:col-span-4",
                  )}
                />
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t bg-card py-12 text-card-foreground sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How the group works"
            title="What every business gets from the group"
            intro="Every business in the group stands on the same foundations, so each one can spend its energy on its customers."
          />
          <ul className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {SHARED_SUPPORT.map((item) => (
              <li key={item.title} className="border-t border-foreground/80 pt-5">
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-ink py-12 sm:py-20 text-white">
        <Container className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Strategic areas of interest</Eyebrow>
            <h2 className="mt-3 text-2xl font-light tracking-tight sm:text-3xl">Sectors we plan to grow in</h2>
            <p className="mt-5 text-white/70">
              We welcome conversations with partners, investors and institutions who share these interests.
            </p>
            <MonoLink to="/contact?topic=partnership" className="mt-8">
              Start a conversation
            </MonoLink>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {STRATEGIC_AREAS.map((area) => (
              <li key={area} className="rounded-lg border border-white/15 p-4 text-sm">
                {area}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
