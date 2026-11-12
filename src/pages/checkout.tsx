import { usePageTitle } from "@/lib/use-page-title";
import { Container, PageHero } from "@/components/shared";
import { Checkout } from "@/components/checkout";

export default function CheckoutPage() {
  usePageTitle("Cart & Checkout");
  return (
    <>
      <PageHero
        eyebrow="Service Center · Checkout"
        title="Checkout"
        intro="Review your items, add your details and pay securely with Mobile Money or card."
      />
      <section className="py-10 sm:py-16">
        <Container>
          <Checkout />
        </Container>
      </section>
    </>
  );
}
