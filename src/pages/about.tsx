import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { BUSINESSES, SITE } from "@/lib/site";
import { usePageTitle } from "@/lib/use-page-title";
import { buttonVariants } from "@/components/ui/button";
import { Container, Eyebrow, PageHero, SectionHeading, onDarkPrimary } from "@/components/shared";

// Placeholder copy throughout: replace with the founder's confirmed biography.
const JOURNEY = [
  { period: "[Year]", title: "Early career", text: "[Professional background, education and formative experience.]" },
  { period: "[Year]", title: "First venture", text: "[The first business founded and what it taught.]" },
  { period: "[Year]", title: `Founding ${SITE.holdingName}`, text: "[Why a holding company was formed to bring the ventures together.]" },
  { period: "Today", title: "Building seven ventures", text: "Developing businesses and initiatives across education, food, grooming, finance, beauty, social impact and wellness." },
];

const PRINCIPLES = [
  { title: "Long-term thinking", text: "Build businesses designed to last and grow over generations." },
  { title: "Integrity", text: "Be clear and honest about what is available today and what is still being built." },
  { title: "Opportunity", text: "Create jobs, skills and access for the communities we serve." },
  { title: "Service", text: "Put customers, students and communities at the centre of every venture." },
];

export default function AboutPage() {
  usePageTitle("The Founder");

  return (
    <>
      <PageHero
        eyebrow="The Founder"
        title={SITE.founderName}
        intro="Entrepreneur and founder of the group, building a portfolio of businesses and initiatives that connect enterprise with community."
      />

      <section className="light bg-background text-foreground py-12 sm:py-20">
        <Container className="grid gap-8 lg:gap-12 lg:grid-cols-[2fr_3fr]">
          <div className="grid aspect-[4/3] lg:aspect-[4/5] place-items-center rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 text-sm text-neutral-500">
            Founder portrait
          </div>
          <div>
            <Eyebrow>Biography</Eyebrow>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">A personal and professional story</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground sm:mt-6 sm:space-y-4 sm:text-base">
              <p>[Personal and professional biography: background, education, career highlights and the experiences that shaped an entrepreneurial path.]</p>
              <p>[Achievements and recognition: key milestones, awards and notable contributions.]</p>
              <p>
                Today, {SITE.founderName} leads {SITE.holdingName}, the holding company that brings together seven
                businesses and initiatives under one vision.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-muted/60 py-12 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Entrepreneurial journey" title="From first venture to a group of seven" />
          <ol className="mt-8 sm:mt-12 grid gap-6 md:grid-cols-4">
            {JOURNEY.map((step) => (
              <li key={step.title} className="border-t-2 border-foreground pt-5">
                <p className="text-xs font-semibold text-muted-foreground">{step.period}</p>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="light bg-background text-foreground py-12 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Vision, mission & principles"
            title="What guides the work"
            intro="Vision: [the founder's long-term vision]. Mission: [how that vision is pursued day to day]."
          />
          <div className="mt-8 sm:mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="rounded-2xl border p-6">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-12 sm:py-20 text-white">
        <Container className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Leadership & community</Eyebrow>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">Business interests and areas of involvement</h2>
            <p className="mt-5 text-white/70">
              [Leadership roles, board positions and community contributions.] Each of the businesses listed here is
              part of {SITE.holdingName} and reflects an area the founder is committed to.
            </p>
            <Link to="/holding" className={cn(buttonVariants({ size: "lg" }), onDarkPrimary, "mt-8")}>
              About the holding company
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {BUSINESSES.map((b) => (
              <li key={b.slug}>
                <Link to={`/businesses/${b.slug}`} className="block rounded-xl border border-white/15 p-4 transition hover:bg-white/5">
                  <p className="text-xs text-white/50">{b.sector}</p>
                  <p className="font-medium">{b.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
