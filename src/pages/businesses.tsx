import { BUSINESSES } from "@/lib/site";
import { usePageTitle } from "@/lib/use-page-title";
import { BusinessGrid } from "@/components/business-visual";
import { Container, PageHero } from "@/components/shared";

export default function BusinessesPage() {
  usePageTitle("Businesses");
  return (
    <>
      <PageHero
        eyebrow="Business portfolio"
        title="Our businesses and initiatives"
        intro="Seven entities, each with its own purpose. Most are in development: each page explains what is available now and how to register interest in what is coming."
      />
      <section className="py-20">
        <Container>
          <BusinessGrid businesses={BUSINESSES} />
        </Container>
      </section>
    </>
  );
}
