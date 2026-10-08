import { Link } from "react-router";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  HandshakeIcon,
  LayersIcon,
  SearchIcon,
  SproutIcon,
  UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESSES, CATALOG, SITE, type OfferingKind } from "@/lib/site";
import { usePageTitle } from "@/lib/use-page-title";
import { buttonVariants } from "@/components/ui/button";
import { CoverImage } from "@/components/business-image";
import { BusinessGrid } from "@/components/business-visual";
import { Container, Eyebrow, SectionHeading, onDarkOutline, onDarkPrimary } from "@/components/shared";

const countOf = (...kinds: OfferingKind[]) => CATALOG.filter((o) => kinds.includes(o.kind)).length;

// Image cards (modelled on the reference design) with a subtle frosted-glass text panel.
// Add an `image` path (e.g. "/images/service-center/products.jpg") to replace a placeholder.
const SERVICE_CARDS: { title: string; text: string; to: string; count: number; image?: string }[] = [
  { title: "Products", text: "Browse products, add them to your cart and pay by Mobile Money.", to: "/service-center?kind=product", count: countOf("product") },
  { title: "Services & appointments", text: "Request bookings for services such as grooming appointments.", to: "/service-center?kind=service", count: countOf("service") },
  { title: "Programmes & opportunities", text: "Education programmes, community initiatives and cycling events.", to: "/service-center?kind=programme", count: countOf("programme", "event") },
];

// Founder portrait for the spotlight card, e.g. "/images/founder.jpg". Unset shows a placeholder.
const FOUNDER_IMAGE: string | undefined = undefined;

// Floating tags on the founder card; `position` places each one over the portrait on large screens.
const FOUNDER_TAGS = [
  { label: "Founder", detail: SITE.holdingName, position: "lg:absolute lg:top-[16%] lg:right-[8%]" },
  { label: `${BUSINESSES.length} ventures`, detail: "Across seven sectors", position: "lg:absolute lg:top-[40%] lg:right-[26%]" },
  { label: "[Year]", detail: "Group founded", position: "lg:absolute lg:top-[62%] lg:right-[6%]" },
];

const ENGAGE_CARDS = [
  { icon: HandshakeIcon, title: "Partner with us", text: "Corporate, academic and distribution partnerships across the portfolio.", to: "/contact?topic=partnership" },
  { icon: UsersIcon, title: "Volunteer & support", text: "Help the Foundation deliver community initiatives.", to: "/contact?topic=foundation" },
  { icon: SproutIcon, title: "Register interest", text: "Be the first to know when products, programmes and services launch.", to: "/service-center/interest" },
];

export default function HomePage() {
  usePageTitle();

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-ink text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_70%_10%,oklch(1_0_0/0.22),transparent_65%),radial-gradient(ellipse_60%_50%_at_10%_90%,oklch(1_0_0/0.08),transparent_70%),linear-gradient(to_bottom,oklch(0.25_0_0),oklch(0.1_0_0))]"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink to-transparent" />
        <Container className="pt-32 pb-12">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
            {SITE.holdingName} · Seven businesses, one vision
          </span>
          <h1 className="mt-6 max-w-3xl text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Building a group that grows together
          </h1>
          <p className="mt-6 max-w-xl text-white/75">
            Education, food, grooming, finance, beauty, community and wellness: the businesses and initiatives of{" "}
            {SITE.founderName}, gathered in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/businesses" className={cn(buttonVariants({ size: "lg" }), onDarkPrimary)}>
              Explore the group <ArrowRightIcon />
            </Link>
            <Link to="/service-center" className={cn(buttonVariants({ variant: "outline", size: "lg" }), onDarkOutline)}>
              Visit the Service Center
            </Link>
          </div>

          <div className="mt-16 grid gap-6 border-t border-white/15 pt-6 sm:grid-cols-2 lg:max-w-3xl">
            {[
              { icon: LayersIcon, text: "One destination for every business, product, service and opportunity in the group." },
              { icon: SproutIcon, text: "Early-stage ventures introduced openly: what is available today and what is still coming." },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex gap-3 text-sm text-white/70">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/25">
                  <Icon className="size-4" />
                </span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Portfolio bento */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="The portfolio"
            title="Seven ventures across seven sectors"
            intro={`Each business has its own purpose. Together they form ${SITE.holdingName}, a long-term vision for enterprise and community.`}
            actions={
              <>
                <Link to="/businesses" className={cn(buttonVariants(), "rounded-full")}>
                  View all businesses
                </Link>
                <Link to="/holding" className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
                  About the group
                </Link>
              </>
            }
          />
          <div className="mt-12">
            <BusinessGrid businesses={BUSINESSES} />
          </div>
        </Container>
      </section>

      {/* Vision band */}
      <section className="light bg-background text-foreground py-16 sm:py-20">
        <Container>
          <Eyebrow className="mb-4">Our vision</Eyebrow>
          {/* Placeholder vision statement: replace with the founder's own words */}
          <p className="max-w-4xl text-xl leading-relaxed font-medium sm:text-2xl">
            To build businesses that last, create real opportunity for the people they serve, and give back to the
            communities that make them possible.
          </p>
        </Container>
      </section>

      {/* Service Center preview */}
      <section className="overflow-x-clip py-16 sm:py-28">
        <Container>
          <SectionHeading
            center
            eyebrow="Unified Service Center"
            title="One place to shop, book and get involved"
            intro="Instead of seven separate websites, every offering in the group lives here. Where something isn't available yet, you can register interest."
          />
          <Link
            to="/service-center"
            className="mx-auto mt-6 flex max-w-xl items-center gap-2.5 rounded-full border bg-background p-1.5 pl-4 text-xs text-muted-foreground shadow-sm transition hover:shadow-md sm:mt-8 sm:gap-3 sm:p-2 sm:pl-5 sm:text-sm"
          >
            <SearchIcon className="size-4" />
            <span className="flex-1 truncate">Search products, services and programmes…</span>
            <span className={cn(buttonVariants({ size: "sm" }), "h-7 rounded-full px-3 text-xs sm:h-8 sm:px-4 sm:text-sm")}>Search</span>
          </Link>
          <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-6 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
            {BUSINESSES.map((b) => (
              <Link
                key={b.slug}
                to={`/service-center?business=${b.slug}`}
                className="shrink-0 rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-foreground hover:text-foreground sm:px-3.5"
              >
                {b.name}
              </Link>
            ))}
          </div>

          <div className="relative isolate mt-8 sm:mt-12">
            {/* Soft glows behind the cards give the frosted glass something to blur */}
            <div aria-hidden className="pointer-events-none absolute -inset-x-10 inset-y-6 -z-10">
              <div className="absolute top-0 left-[10%] size-56 rounded-full bg-white/[0.07] blur-3xl sm:size-72" />
              <div className="absolute right-[12%] bottom-0 size-56 rounded-full bg-brand/[0.08] blur-3xl sm:size-72" />
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              {SERVICE_CARDS.map(({ title, text, to, count, image }, i) => (
                <Link
                  key={title}
                  to={to}
                  className="group relative isolate flex min-h-64 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-3 text-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08)] transition duration-300 hover:-translate-y-1 hover:border-white/20 sm:min-h-80 sm:p-4 md:min-h-[24rem] md:rounded-3xl"
                >
                  <CoverImage src={image} alt={title} overlay="from-black/60 via-transparent to-black/20" />

                  <div className="flex items-center justify-between px-1 pt-1 text-[11px] sm:px-2 sm:pt-2 sm:text-xs">
                    <span className="font-semibold tracking-[0.2em] text-white/60">0{i + 1}</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 backdrop-blur-md sm:px-3 sm:py-1">
                      {count} {count === 1 ? "offering" : "offerings"}
                    </span>
                  </div>

                  {/* Frosted-glass panel keeps the text legible over any photo */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.07] p-3 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.1)] backdrop-blur-md transition group-hover:bg-white/[0.1] sm:p-4 md:rounded-2xl">
                    <h3 className="text-lg font-medium tracking-tight sm:text-2xl">{title}</h3>
                    <div className="mt-1.5 flex items-end justify-between gap-3 sm:mt-3 sm:gap-4">
                      <p className="text-xs text-white/70 sm:text-sm">{text}</p>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground transition group-hover:rotate-45 sm:size-11">
                        <ArrowUpRightIcon className="size-4 sm:size-5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Founder spotlight: full-bleed portrait with floating glass tags, after the reference's "Enjoy Your Travel" banner */}
      <section className="light bg-background text-foreground py-16 sm:py-28">
        <Container>
          <div className="relative isolate flex min-h-[38rem] flex-col justify-between overflow-hidden rounded-3xl p-4 text-white sm:min-h-[38rem] sm:p-8 lg:min-h-[36rem] lg:p-10">
            {/* Set FOUNDER_IMAGE to a portrait to replace the placeholder */}
            <CoverImage src={FOUNDER_IMAGE} alt={SITE.founderName} overlay="from-black/85 via-black/20 to-black/55" />

            <div>
              <Eyebrow>The founder</Eyebrow>
              <h2 className="mt-2 max-w-md text-4xl leading-[1.05] font-medium tracking-tight sm:mt-3 sm:text-6xl">
                Meet {SITE.founderName}
              </h2>

              {/* Tags: a swipeable row on small screens, floating over the portrait on large ones */}
              <ul className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 lg:overflow-visible">
                {FOUNDER_TAGS.map((tag) => (
                  <li
                    key={tag.label}
                    className={cn(
                      "shrink-0 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.12)] backdrop-blur-md",
                      tag.position,
                    )}
                  >
                    <p className="text-sm font-medium leading-tight">{tag.label}</p>
                    <p className="text-[11px] text-white/65">{tag.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="max-w-xl rounded-2xl border border-white/10 bg-white/[0.08] p-4 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.1)] backdrop-blur-md sm:p-6">
              <p className="text-sm text-white/80 sm:text-base">
                An entrepreneur building a portfolio of businesses that spans education, enterprise and community
                impact. Learn about the journey, the principles behind the group, and the vision that connects all
                seven ventures.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
                <Link to="/about" className={cn(buttonVariants({ size: "lg" }), onDarkPrimary)}>
                  Read the story <ArrowRightIcon />
                </Link>
                <Link to="/holding" className={cn(buttonVariants({ variant: "outline", size: "lg" }), onDarkOutline)}>
                  The holding company
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Engage */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Get involved" title="Ways to engage with the group" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {ENGAGE_CARDS.map(({ icon: Icon, title, text, to }) => (
              <Link key={title} to={to} className="group flex flex-col rounded-2xl bg-muted/60 p-6 transition hover:bg-muted">
                <Icon className="size-6" />
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{text}</p>
                <ArrowRightIcon className="mt-6 size-5 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
