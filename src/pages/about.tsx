import { Link } from "react-router";
import { BUSINESSES, SITE } from "@/lib/site";
import { usePageTitle } from "@/lib/use-page-title";
import { MonoLink } from "@/components/mono-link";
import { FounderPortrait } from "@/components/founder-portrait";
import { Container, Eyebrow, PageHero, SectionHeading } from "@/components/shared";

// General copy that makes no factual claims (dates, degrees, awards). Enrich it with the
// founder's confirmed biography and milestones when they are available.
const JOURNEY = [
  { period: "The idea", title: "Seeing the gaps", text: "Noticing everyday needs in education, food, grooming, beauty and finance that people deserved better answers to." },
  { period: "First steps", title: "Starting small", text: "Turning those ideas into businesses one at a time, testing what works and learning from the people they serve." },
  { period: "Together", title: `Forming ${SITE.holdingName}`, text: "Bringing the ventures under one holding company so they can share standards, support and a common purpose." },
  { period: "Today", title: "Building eight ventures", text: "Developing businesses and initiatives across education, food, grooming, finance, beauty, fashion, social impact and wellness." },
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
        intro="Entrepreneur and founder of CHANIMBE GROUP, building businesses and initiatives in Ghana that connect enterprise with community."
      />

      <section className="bg-card text-card-foreground py-12 sm:py-20">
        <Container className="grid gap-8 lg:gap-12 lg:grid-cols-[2fr_3fr]">
          <FounderPortrait className="aspect-[4/3] rounded-3xl lg:aspect-square" />
          <div>
            <Eyebrow>Biography</Eyebrow>
            <h2 className="mt-3 text-2xl font-light tracking-tight sm:text-3xl">Building with purpose</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground sm:mt-6 sm:space-y-4 sm:text-base">
              <p>
                {SITE.founderName} is an entrepreneur based in the Central Region of Ghana, whose work starts from a
                simple belief: the best businesses solve everyday problems for real people, and they grow stronger when the
                communities around them grow too.
              </p>
              <p>
                That belief runs through every venture in the group, from practical education and healthy food to
                grooming, skincare, fashion, cycling and a foundation working to end schools under trees in Ghana.
              </p>
              <p>
                Today, {SITE.founderName} leads {SITE.holdingName}, the holding company that brings together eight
                businesses and initiatives under one vision.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-muted/60 py-12 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Entrepreneurial journey" title="From one idea to a group of eight" />
          <ol className="mt-8 sm:mt-12 grid gap-6 md:grid-cols-4">
            {JOURNEY.map((step) => (
              <li key={step.title} className="border-t-2 border-foreground pt-5">
                <p className="text-xs font-medium text-muted-foreground">{step.period}</p>
                <h3 className="mt-2 font-medium">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-card text-card-foreground py-12 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Vision, mission & principles"
            title="What guides the work"
            intro="Vision: a Ghana where quality education, healthy food and good services are within everyone's reach. Mission: to build businesses that meet those needs honestly and give back to the communities they serve."
          />
          <div className="mt-8 sm:mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="rounded-2xl border p-6">
                <h3 className="font-medium">{p.title}</h3>
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
            <h2 className="mt-3 text-2xl font-light tracking-tight sm:text-3xl">Business interests and areas of involvement</h2>
            <p className="mt-5 text-white/70">
              Beyond business, {SITE.founderName} is committed to education and community development, most visibly
              through Chanimbe Africa Foundation. Each of the businesses listed here is part of {SITE.holdingName} and
              reflects an area the founder is committed to.
            </p>
            <MonoLink to="/holding" className="mt-8">
              About the holding company
            </MonoLink>
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
