import { Link } from "react-router";
import { CATALOG } from "@/lib/site";
import { isPurchasable, offeringImage } from "@/lib/shop";
import { usePageTitle } from "@/lib/use-page-title";
import { Container, PageHero } from "@/components/shared";
import { OfferingCarousel, ServiceCatalog } from "@/components/service-catalog";

// Buyable items first, then anything with a photo.
const RECOMMENDED = [...CATALOG]
  .sort((a, b) => Number(isPurchasable(b)) - Number(isPurchasable(a)) || Number(!!offeringImage(b)) - Number(!!offeringImage(a)))
  .slice(0, 8);

export default function ServiceCenterPage() {
  usePageTitle("The Shop");

  return (
    <>
      <PageHero
        eyebrow="The Shop"
        title="Every offering in one place"
        intro="Shop products, book appointments, explore programmes and register interest across all eight businesses and initiatives."
      />

      <section className="py-10 sm:py-16">
        <Container>
          <ServiceCatalog />
        </Container>
      </section>

      <section className="border-t py-12 sm:py-20">
        <Container>
          <OfferingCarousel title="Recommended for you" offerings={RECOMMENDED} />
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Can't find what you need?{" "}
            <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
              Send us an inquiry
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
