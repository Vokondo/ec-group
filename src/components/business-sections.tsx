import { ChevronDownIcon, ClockIcon, InfoIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATALOG, SITE, toOffer, type Business } from "@/lib/site";
import { media, mediaPath } from "@/lib/media";
import type { BusinessLayout, SectionSpec, SectionType } from "@/lib/business-layouts";
import { MonoLink } from "@/components/mono-link";
import { ProductCard } from "@/components/shop/product-card";
import { CoverImage } from "@/components/business-image";
import { DonationPanel, ProjectStory } from "@/components/donation-panel";
import { Container, Eyebrow, SectionHeading } from "@/components/shared";

// Section building blocks for the business pages. All variants share the site's existing style
// (light headings, mono labels, monochrome cards); only the layout differs between variants.

const DEFAULT_LABELS: Record<SectionType, string> = {
  gallery: "",
  schools: "Schools",
  synergy: "Together",
  donation: "",
  statement: "",
  stats: "At a glance",
  pillars: "What we stand for",
  segments: "Who it is for",
  checklist: "The essentials",
  note: "",
  feature: "Visit",
  notice: "Please note",
  actions: "Get involved",
  catalog: "Shop the range",
  why: "Why it is being established",
  offers: "What it intends to offer",
  audience: "Who it serves",
  steps: "How it works",
  faq: "Questions",
  contact: "Visit & contact",
};

type Tone = "card" | "page";

type SectionProps = { business: Business; label: string };

const headingClass = "mt-3 text-xl font-light tracking-tight sm:text-3xl lg:text-4xl";

function Shell({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <section className={cn("py-10 sm:py-20", tone === "card" && "bg-card text-card-foreground")}>
      <Container>{children}</Container>
    </section>
  );
}

function Story({ business, className }: { business: Business; className?: string }) {
  return (
    <div className={cn("space-y-4 text-sm text-muted-foreground sm:text-base", className)}>
      {business.story.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

// List marker: a small solid square, used instead of tick icons.
const Bullet = ({ className }: { className?: string }) => (
  <span aria-hidden className={cn("size-1.5 shrink-0 bg-current", className)} />
);

const OffersNote = ({ business }: { business: Business }) =>
  business.status === "proposed" && !business.donation ? (
    <p className="mt-6 text-xs text-muted-foreground">
      Proposed offerings are subject to change. Prices, programme details and timelines will be published once confirmed.
    </p>
  ) : null;

/* Why */

function WhySection({ business, label }: SectionProps) {
  return (
    <div className="grid gap-6 rounded-3xl bg-muted/60 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
      <div>
        <Eyebrow>{label}</Eyebrow>
        <p className="mt-3 text-lg font-light tracking-tight sm:text-2xl">{business.why}</p>
      </div>
      <Story business={business} />
    </div>
  );
}

/* Gallery */

// Photos for a business: its offer and Service Center photos first (the cover photo is already
// in the banner), then the cover photo, padded with placeholders so every gallery is full.
// Photos added as gallery-1, gallery-2 and so on take each tile first.
function galleryImages(business: Business, count: number) {
  const photos = [
    ...business.offers.map((o) => toOffer(o).image),
    ...CATALOG.filter((o) => o.business === business.slug).map((o) => o.image),
    business.image,
  ].filter((src): src is string => Boolean(src));
  const unique = [...new Set(photos)];
  return Array.from({ length: count }, (_, i) => ({
    src: media(business.slug, `gallery-${i + 1}`) ?? unique[i],
    slot: mediaPath(business.slug, `gallery-${i + 1}`),
  }));
}

function Photo({ src, slot, alt, className, small }: { src?: string; slot?: string; alt: string; className?: string; small?: boolean }) {
  return (
    <div className={cn("relative isolate overflow-hidden rounded-2xl", className)}>
      <CoverImage src={src} slot={slot} alt={alt} overlay="from-transparent to-transparent" variant={small ? "compact" : "center"} />
    </div>
  );
}

function GallerySection({ business, variant }: { business: Business; variant: "trio" | "feature" | "wide" | "collage" }) {
  if (variant === "collage") {
    // Six tiles in a compact, gap-free mosaic: 3 columns on phones, 6 on larger screens.
    const spans = [
      "col-span-2 row-span-2",
      "sm:col-span-2",
      "",
      "",
      "",
      "sm:col-span-3",
    ];
    return (
      <div className="grid auto-rows-[88px] grid-cols-3 gap-2 sm:auto-rows-[130px] sm:grid-cols-6 sm:gap-3 lg:auto-rows-[150px]">
        {galleryImages(business, 6).map((photo, i) => (
          <Photo key={i} {...photo} alt={business.name} className={spans[i]} small />
        ))}
      </div>
    );
  }
  if (variant === "wide") {
    const [photo] = galleryImages(business, 1);
    return <Photo {...photo} alt={business.name} className="aspect-[4/3] sm:aspect-[21/9]" />;
  }
  if (variant === "feature") {
    const [a, b, c] = galleryImages(business, 3);
    return (
      <div className="grid gap-3 sm:grid-cols-3 sm:grid-rows-2 sm:gap-4">
        <Photo {...a} alt={business.name} className="aspect-[4/3] sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-96" />
        <Photo {...b} alt={business.name} className="aspect-[4/3]" small />
        <Photo {...c} alt={business.name} className="aspect-[4/3]" small />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {galleryImages(business, 3).map((photo, i) => (
        <Photo
          key={i}
          {...photo}
          alt={business.name}
          className={cn("aspect-[3/4]", i === 0 && "col-span-2 aspect-[4/3] sm:col-span-1 sm:aspect-[3/4]")}
          small={i > 0}
        />
      ))}
    </div>
  );
}

/* Offers */

function OffersSection({ business, label, variant }: SectionProps & { variant: "cards" | "grid" | "list" | "pills" }) {
  const offers = business.offers.map(toOffer);
  if (variant === "cards")
    return (
      <div>
        <Eyebrow>{label}</Eyebrow>
        <h2 className={headingClass}>Inside {business.name}</h2>
        <ul className={cn("mt-8 grid gap-3 sm:grid-cols-2", offers.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {offers.map((o, i) => (
            // Photo card with a white panel floating over its lower edge.
            <li key={o.title} className="relative isolate aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-square">
              <CoverImage
                src={o.image}
                slot={mediaPath(business.slug, `offer-${i + 1}`)}
                alt={o.title}
                overlay="from-transparent to-transparent"
                variant="compact"
              />
              <div className="absolute inset-x-2.5 bottom-2.5 rounded-xl bg-white p-3 text-ink shadow-sm">
                <span className="grid size-5 place-items-center rounded-full bg-ink text-[10px] font-medium text-white">{i + 1}</span>
                <p className="mt-3 text-sm leading-snug font-light">{o.title}</p>
              </div>
            </li>
          ))}
        </ul>
        <OffersNote business={business} />
      </div>
    );
  if (variant === "list")
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <Eyebrow>{label}</Eyebrow>
          <h2 className={headingClass}>{business.name}</h2>
        </div>
        <div>
          <ol className="divide-y border-y">
            {offers.map((o, i) => (
              <li key={o.title} className="flex items-baseline gap-6 py-4">
                <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">0{i + 1}</span>
                <span className="text-base sm:text-lg">{o.title}</span>
              </li>
            ))}
          </ol>
          <OffersNote business={business} />
        </div>
      </div>
    );
  if (variant === "pills")
    return (
      <div>
        <Eyebrow>{label}</Eyebrow>
        <ul className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          {offers.map((o) => (
            <li key={o.title} className="rounded-full border px-5 py-2.5 text-sm sm:text-base">
              {o.title}
            </li>
          ))}
        </ul>
        <OffersNote business={business} />
      </div>
    );
  return (
    <div>
      <Eyebrow>{label}</Eyebrow>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((o, i) => (
          <li key={o.title} className="flex gap-3 rounded-xl border p-4 text-sm">
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            {o.title}
          </li>
        ))}
      </ul>
      <OffersNote business={business} />
    </div>
  );
}

/* Audience and "Available now" */

function AvailableList({ business, onDark }: { business: Business; onDark?: boolean }) {
  return (
    <ul className="space-y-2 text-sm">
      {business.available.map((a) => (
        <li key={a} className="flex gap-2">
          <Bullet className={cn("mt-1.5", onDark ? "bg-white" : "bg-foreground")} />
          {a}
        </li>
      ))}
    </ul>
  );
}

function AudienceSection({ business, label, variant }: SectionProps & { variant: "aside" | "banner" }) {
  if (variant === "banner")
    return (
      <div className="grid gap-8 rounded-3xl bg-ink p-6 text-white sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
        <div>
          <Eyebrow>{label}</Eyebrow>
          <p className="mt-3 text-lg font-light tracking-tight sm:text-2xl">{business.audience}</p>
        </div>
        <div>
          <h2 className="font-medium">Available now</h2>
          <div className="mt-4">
            <AvailableList business={business} onDark />
          </div>
          <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
            <MonoLink to={business.cta.to}>{business.cta.label}</MonoLink>
            <MonoLink to={`/service-center?business=${business.slug}`} variant="outline-dark">
              View in Service Center
            </MonoLink>
          </div>
        </div>
      </div>
    );
  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
      <div className="lg:col-span-2">
        <Eyebrow>{label}</Eyebrow>
        <p className="mt-3 text-lg font-light tracking-tight sm:text-2xl">{business.audience}</p>
      </div>
      <aside className="h-fit rounded-3xl bg-muted/60 p-6">
        <h2 className="font-medium">Available now</h2>
        <div className="mt-4">
          <AvailableList business={business} />
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <MonoLink to={business.cta.to} className="justify-between">
            {business.cta.label}
          </MonoLink>
          <MonoLink to={`/service-center?business=${business.slug}`} variant="outline-light" className="justify-between">
            View in Service Center
          </MonoLink>
        </div>
      </aside>
    </div>
  );
}

/* Steps */

function StepsSection({ business, label, variant }: SectionProps & { variant: "cards" | "timeline" | "numbers" }) {
  if (variant === "timeline")
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <Eyebrow>{label}</Eyebrow>
          <h2 className={headingClass}>Step by step</h2>
        </div>
        <ol className="space-y-8 border-l pl-8">
          {business.steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span aria-hidden className="absolute top-1.5 -left-[37px] size-2.5 rounded-full bg-foreground" />
              <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-1 font-medium">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  if (variant === "numbers")
    return (
      <div>
        <Eyebrow>{label}</Eyebrow>
        <ol className="mt-8 grid gap-8 sm:mt-10 sm:grid-cols-3 sm:gap-6">
          {business.steps.map((step, i) => (
            <li key={step.title} className="border-t border-foreground pt-5">
              <span className="text-4xl font-light tracking-tight sm:text-6xl">{i + 1}</span>
              <h3 className="mt-4 font-medium">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  return (
    <div>
      <Eyebrow>{label}</Eyebrow>
      <h2 className={headingClass}>Getting started with {business.name}</h2>
      <ol className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3">
        {business.steps.map((step, i) => (
          <li key={step.title} className="rounded-2xl bg-card p-6 ring-1 ring-foreground/5">
            <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">0{i + 1}</span>
            <h3 className="mt-3 font-medium">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* Questions */

function FaqSection({ business, label, variant }: SectionProps & { variant: "accordion" | "grid" }) {
  if (variant === "grid")
    return (
      <div>
        <Eyebrow>{label}</Eyebrow>
        <h2 className={headingClass}>Frequently asked</h2>
        <dl className="mt-8 grid gap-x-12 gap-y-8 sm:mt-10 sm:grid-cols-2">
          {business.faqs.map((faq) => (
            <div key={faq.q}>
              <dt className="font-medium">{faq.q}</dt>
              <dd className="mt-2 text-sm text-muted-foreground sm:text-base">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
      <div>
        <Eyebrow>{label}</Eyebrow>
        <h2 className={headingClass}>Frequently asked</h2>
      </div>
      <div className="divide-y border-y">
        {business.faqs.map((faq) => (
          <details key={faq.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {faq.q}
              <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

/* Visit & contact */

function contactItems(business: Business) {
  return [
    { icon: MapPinIcon, label: "Location", value: SITE.address },
    { icon: ClockIcon, label: "Hours", value: business.hours ?? "To be announced" },
    { icon: PhoneIcon, label: "Phone / WhatsApp", value: SITE.contactPhone, href: `tel:${SITE.contactPhone.replace(/\s/g, "")}` },
    { icon: MailIcon, label: "Email", value: SITE.contactEmail, href: `mailto:${SITE.contactEmail}` },
  ];
}

function ContactValue({ value, href }: { value: string; href?: string }) {
  return href ? (
    <a href={href} className="underline-offset-4 hover:underline">
      {value}
    </a>
  ) : (
    <>{value}</>
  );
}

function ContactSection({ business, label, variant }: SectionProps & { variant: "dark" | "split" | "strip" }) {
  const dark = variant === "dark";
  const buttons = (
    <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
      <MonoLink to={business.cta.to}>{business.cta.label}</MonoLink>
      <MonoLink to={`/contact?topic=${business.slug}`} variant={dark ? "outline-dark" : "outline-light"}>
        Contact us
      </MonoLink>
    </div>
  );

  if (variant === "strip")
    return (
      <div className="rounded-3xl bg-card p-6 ring-1 ring-foreground/5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>{label}</Eyebrow>
            <h2 className="mt-3 text-xl font-light tracking-tight sm:text-3xl">Get in touch with {business.name}</h2>
          </div>
          <div className="[&>div]:mt-0">{buttons}</div>
        </div>
        <dl className="mt-8 grid gap-6 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactItems(business).map(({ label, value, href }) => (
            <div key={label}>
              <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-sm">
                <ContactValue value={value} href={href} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );

  return (
    <div
      className={cn(
        "grid gap-8 rounded-3xl p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:p-14",
        dark ? "bg-ink text-white" : "bg-muted/60",
      )}
    >
      <div>
        <Eyebrow>{label}</Eyebrow>
        <h2 className="mt-3 text-xl font-light tracking-tight sm:text-3xl">Get in touch with {business.name}</h2>
        {buttons}
      </div>
      <dl className={cn("grid gap-6 sm:grid-cols-2", !dark && "content-start")}>
        {contactItems(business).map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="flex gap-3">
            <Icon className={cn("mt-0.5 size-4 shrink-0", dark ? "text-white/50" : "text-muted-foreground")} />
            <div>
              <dt
                className={cn(
                  "text-xs font-medium",
                  dark ? "text-white/50" : "text-muted-foreground",
                )}
              >
                {label}
              </dt>
              <dd className="mt-1 text-sm">
                <ContactValue value={value} href={href} />
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* Flagship content: the university's schools and how they fit together */

function SchoolsSection({ business, label }: SectionProps) {
  const schools = business.schools ?? [];
  return (
    <section className="border-t py-12 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow={label}
          title={`${schools.length} schools, one purpose`}
          intro="Each school pairs practical training with a clear path to work or enterprise."
        />
        <div className="mt-8 grid gap-4 sm:mt-12 lg:grid-cols-3">
          {schools.map((school, i) => (
            <article key={school.name} className="flex flex-col rounded-3xl border bg-card p-6 text-card-foreground sm:p-8">
              <Eyebrow>School {String(i + 1).padStart(2, "0")}</Eyebrow>
              <h3 className="mt-3 text-lg font-medium tracking-tight sm:text-xl">{school.name}</h3>
              <p className="mt-2 text-lg font-light tracking-tight sm:text-2xl">{school.tagline}</p>
              <p className="mt-4 text-sm text-muted-foreground">{school.intro}</p>
              <Eyebrow className="mt-6">Programmes</Eyebrow>
              <ul className="mt-3 space-y-2 text-sm">
                {school.programmes.map((p) => (
                  <li key={p} className="flex gap-3">
                    <Bullet className="mt-[0.45rem]" />
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
  );
}

function SynergySection({ business, label }: SectionProps) {
  if (!business.synergy) return null;
  return (
    <section className="bg-ink py-12 text-white sm:py-20">
      <Container className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <Eyebrow>{label}</Eyebrow>
          <h2 className={headingClass}>{business.synergy.title}</h2>
          <p className="mt-6 text-lg font-light text-white/80 sm:text-xl">{business.synergy.closing}</p>
        </div>
        <ul className="space-y-3">
          {business.synergy.points.map((p) => (
            <li key={p} className="flex gap-3 rounded-2xl border border-white/15 p-4 text-sm sm:text-base">
              <Bullet className="mt-[0.45rem] sm:mt-2" />
              {p}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* Sections modelled on how leading sites in each field are arranged */

// A short, bold line on its own: plain, or over a full-width photo like a fashion editorial.
function StatementSection({ business, variant }: { business: Business; variant: "plain" | "image" }) {
  if (!business.statement) return null;
  if (variant === "image")
    return (
      <section className="relative isolate flex min-h-80 items-center overflow-hidden py-20 text-center text-white sm:min-h-[28rem]">
        {/* Its own photo (statement.jpg), so it doesn't repeat the banner just above; falls back to the cover */}
        <CoverImage
          src={media(business.slug, "statement") ?? business.image}
          slot={mediaPath(business.slug, "statement")}
          alt=""
          overlay="from-black/70 via-black/50 to-black/60"
        />
        <Container>
          <p className="mx-auto max-w-3xl text-2xl leading-tight font-light tracking-tight sm:text-5xl">{business.statement}</p>
        </Container>
      </section>
    );
  return (
    <section className="pt-12 pb-4 text-center sm:py-24">
      <Container>
        <p className="mx-auto max-w-3xl text-2xl leading-tight font-light tracking-tight sm:text-5xl">{business.statement}</p>
      </Container>
    </section>
  );
}

function StatsSection({ business, label }: SectionProps) {
  if (!business.stats) return null;
  return (
    <div>
      <Eyebrow>{label}</Eyebrow>
      <dl className={cn("mt-6 grid gap-6 border-t pt-6 sm:gap-8", business.stats.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
        {business.stats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-3xl font-light tracking-tight sm:text-5xl">{stat.value}</dt>
            <dd className="mt-2 text-sm text-muted-foreground">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PillarsSection({ business, label, variant }: SectionProps & { variant: "row" | "dark" }) {
  if (!business.pillars) return null;
  const { heading, items } = business.pillars;
  const dark = variant === "dark";
  return (
    <div className={cn(dark && "rounded-3xl bg-ink p-6 text-white sm:p-10 lg:p-14")}>
      <Eyebrow>{label}</Eyebrow>
      <h2 className={headingClass}>{heading}</h2>
      <ul className={cn("mt-8 grid gap-6 sm:grid-cols-2", items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
        {items.map((item, i) => (
          <li key={item.title} className={cn("border-t pt-5", dark ? "border-white/20" : "border-foreground/80")}>
            <span className={cn("font-mono text-[11px] tracking-[0.2em]", dark ? "text-white/50" : "text-muted-foreground")}>0{i + 1}</span>
            <h3 className="mt-3 text-lg font-medium">{item.title}</h3>
            <p className={cn("mt-2 text-sm", dark ? "text-white/70" : "text-muted-foreground")}>{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// "Who it is for" tiles, two by two.
function SegmentsSection({ business, label }: SectionProps) {
  if (!business.segments) return null;
  return (
    <div>
      <Eyebrow>{label}</Eyebrow>
      <h2 className={headingClass}>{business.segments.heading}</h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {business.segments.items.map((item) => (
          <li key={item.title} className="rounded-2xl bg-muted/60 p-6 sm:p-8">
            <h3 className="text-lg font-light tracking-tight sm:text-2xl">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChecklistSection({ business, label }: SectionProps) {
  if (!business.checklist) return null;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
      <div>
        <Eyebrow>{label}</Eyebrow>
        <h2 className={headingClass}>{business.checklist.heading}</h2>
      </div>
      <ul className="grid gap-x-8 sm:grid-cols-2">
        {business.checklist.items.map((item) => (
          <li key={item} className="flex gap-3 border-b py-4 text-base sm:text-lg">
            <Bullet className="mt-2 sm:mt-2.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// A short quote in the brand's voice, like a founder's note.
function NoteSection({ business }: { business: Business }) {
  if (!business.note) return null;
  return (
    <figure className="mx-auto max-w-3xl text-center">
      <blockquote className="text-xl leading-snug font-light tracking-tight sm:text-4xl">“{business.note.quote}”</blockquote>
      <figcaption className="text-xs font-medium mt-6 text-muted-foreground">{business.note.by}</figcaption>
    </figure>
  );
}

// Photo and text side by side; "right" puts the photo on the right.
function FeatureSection({ business, label, variant }: SectionProps & { variant: "left" | "right" }) {
  if (!business.feature) return null;
  const { heading, text, image, cta } = business.feature;
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
      <div className={cn("relative isolate aspect-[4/3] overflow-hidden rounded-3xl", variant === "right" && "lg:order-2")}>
        <CoverImage src={image} slot={mediaPath(business.slug, "feature")} alt="" overlay="from-transparent to-transparent" />
      </div>
      <div>
        <Eyebrow>{label}</Eyebrow>
        <h2 className={headingClass}>{heading}</h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">{text}</p>
        {cta && (
          <MonoLink to={cta.to} className="mt-6">
            {cta.label}
          </MonoLink>
        )}
      </div>
    </div>
  );
}

function NoticeSection({ business, label }: SectionProps) {
  if (!business.notice) return null;
  return (
    <div className="flex gap-4 rounded-3xl border border-foreground/15 p-6 sm:p-8">
      <InfoIcon className="mt-1 size-5 shrink-0" />
      <div>
        <Eyebrow>{label}</Eyebrow>
        <h2 className="mt-2 text-lg font-light tracking-tight sm:text-2xl">{business.notice.heading}</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">{business.notice.text}</p>
      </div>
    </div>
  );
}

function ActionsSection({ business, label }: SectionProps) {
  if (!business.actions) return null;
  return (
    <div>
      <Eyebrow>{label}</Eyebrow>
      <h2 className={headingClass}>{business.actions.heading}</h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {business.actions.items.map((item) => (
          <li key={item.title} className="flex flex-col rounded-2xl bg-muted/60 p-6">
            <h3 className="text-lg font-medium">{item.title}</h3>
            <p className="mt-2 mb-6 text-sm text-muted-foreground">{item.text}</p>
            <MonoLink to={item.cta.to} variant="outline-light" className="mt-auto self-start">
              {item.cta.label}
            </MonoLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The business's Service Center items as product cards, like a shop's product grid.
function CatalogSection({ business, label }: SectionProps) {
  const items = CATALOG.filter((o) => o.business === business.slug);
  if (items.length === 0) return null;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>{label}</Eyebrow>
          <h2 className={headingClass}>{business.name}</h2>
        </div>
        <MonoLink to={`/service-center?business=${business.slug}`} variant="outline-light">
          View in Service Center
        </MonoLink>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {items.map((o) => (
          <ProductCard key={o.id} offering={o} />
        ))}
      </div>
    </div>
  );
}

export function BusinessSection({
  spec,
  business,
  layout,
  tone,
}: {
  spec: SectionSpec;
  business: Business;
  layout: BusinessLayout;
  tone: Tone;
}) {
  const label = layout.labels?.[spec.type] ?? DEFAULT_LABELS[spec.type];
  const props = { business, label };

  // Skip sections this business has no content for, rather than leaving an empty block.
  const missing: Partial<Record<SectionType, boolean>> = {
    stats: !business.stats,
    pillars: !business.pillars,
    segments: !business.segments,
    checklist: !business.checklist,
    note: !business.note,
    feature: !business.feature,
    notice: !business.notice,
    actions: !business.actions,
    catalog: !CATALOG.some((o) => o.business === business.slug),
  };
  if (missing[spec.type]) return null;

  // Flagship sections bring their own backgrounds.
  if (spec.type === "schools") return business.schools?.length ? <SchoolsSection {...props} /> : null;
  if (spec.type === "synergy") return <SynergySection {...props} />;
  if (spec.type === "statement") return <StatementSection business={business} variant={spec.variant} />;
  if (spec.type === "donation")
    return business.donation ? (
      <>
        <ProjectStory donation={business.donation} folder={business.slug} />
        <DonationPanel donation={business.donation} />
      </>
    ) : null;

  let body: React.ReactNode;
  switch (spec.type) {
    case "why":
      body = <WhySection {...props} />;
      break;
    case "stats":
      body = <StatsSection {...props} />;
      break;
    case "pillars":
      body = <PillarsSection {...props} variant={spec.variant} />;
      break;
    case "segments":
      body = <SegmentsSection {...props} />;
      break;
    case "checklist":
      body = <ChecklistSection {...props} />;
      break;
    case "note":
      body = <NoteSection business={business} />;
      break;
    case "feature":
      body = <FeatureSection {...props} variant={spec.variant} />;
      break;
    case "notice":
      body = <NoticeSection {...props} />;
      break;
    case "actions":
      body = <ActionsSection {...props} />;
      break;
    case "catalog":
      body = <CatalogSection {...props} />;
      break;
    case "gallery":
      body = <GallerySection business={business} variant={spec.variant} />;
      break;
    case "offers":
      body = <OffersSection {...props} variant={spec.variant} />;
      break;
    case "audience":
      body = <AudienceSection {...props} variant={spec.variant} />;
      break;
    case "steps":
      body = <StepsSection {...props} variant={spec.variant} />;
      break;
    case "faq":
      body = <FaqSection {...props} variant={spec.variant} />;
      break;
    case "contact":
      body = <ContactSection {...props} variant={spec.variant} />;
      break;
  }
  return <Shell tone={tone}>{body}</Shell>;
}
