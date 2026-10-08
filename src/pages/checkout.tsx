import { usePageTitle } from "@/lib/use-page-title";
import { Container, PageHero } from "@/components/shared";
import { Checkout } from "@/components/checkout";

export default function CheckoutPage() {
  usePageTitle("Cart & Checkout");
  return (
    <>
      <PageHero
        eyebrow="Service Center · Checkout"
        title="Your cart"
        intro="Review your items, pay by Mobile Money and send us your transaction ID. We verify each payment manually before confirming your order."
      />
      <section className="py-16">
        <Container>
          <Checkout />
        </Container>
      </section>
    </>
  );
}
