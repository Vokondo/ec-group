import { Link } from "react-router";
import { usePageTitle } from "@/lib/use-page-title";
import { Container, PageHero } from "@/components/shared";
import { ServiceCatalog } from "@/components/service-catalog";

export default function ServiceCenterPage() {
  usePageTitle("Service Center");

  return (
    <>
      <PageHero
        eyebrow="Unified Service Center"
        title="Every offering in one place"
        intro="Shop products, request appointments, explore programmes and register interest across all seven businesses. Items marked “In development” are not yet available; register interest and we'll keep you informed."
      />

      <section className="py-10 sm:py-16">
        <Container>
          <ServiceCatalog />
          <p className="mt-8 sm:mt-12 text-center text-sm text-muted-foreground">
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
