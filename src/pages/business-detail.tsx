import { useParams } from "react-router";
import { InfoIcon } from "lucide-react";
import { BUSINESSES, getBusiness } from "@/lib/site";
import { BUSINESS_LAYOUTS, DEFAULT_LAYOUT } from "@/lib/business-layouts";
import { usePageTitle } from "@/lib/use-page-title";
import { mediaPath } from "@/lib/media";
import { MonoLink } from "@/components/mono-link";
import { CoverImage } from "@/components/business-image";
import { BusinessTile } from "@/components/business-visual";
import { BusinessSection } from "@/components/business-sections";
import { Container, StatusBadge } from "@/components/shared";
import NotFoundPage from "@/pages/not-found";

// Every business page shares the same style; its section order, layouts and labels come from
// lib/business-layouts.ts, so each page is structured differently.
export default function BusinessDetailPage() {
  const { slug } = useParams();
  const business = getBusiness(slug);
  usePageTitle(business?.name ?? "Not found");
  if (!business) return <NotFoundPage />;

  const layout = BUSINESS_LAYOUTS[business.slug] ?? DEFAULT_LAYOUT;
  const index = BUSINESSES.indexOf(business);
  // The next three businesses in order, wrapping round, so every page suggests different ones.
  const others = [1, 2, 3].map((n) => BUSINESSES[(index + n) % BUSINESSES.length]);

  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <CoverImage
          src={business.image}
          slot={mediaPath(business.slug, "cover")}
          alt={business.name}
          overlay="from-black/90 via-black/60 to-black/30"
          variant="corner"
        />
        <Container className="relative pt-12 pb-12 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">
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

      {/* Sections alternate between white and page backgrounds, whatever their order. */}
      {layout.sections.map((spec, i) => (
        <BusinessSection key={spec.type} spec={spec} business={business} layout={layout} tone={i % 2 === 0 ? "card" : "page"} />
      ))}

      <section className="border-t py-12 sm:py-20">
        <Container>
          <h2 className="text-xl font-light tracking-tight sm:text-2xl">More from the group</h2>
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

