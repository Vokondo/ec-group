import { Link } from "react-router";
import { CalendarCheckIcon, MessageSquareIcon, ShoppingBagIcon, SmartphoneIcon } from "lucide-react";
import { usePageTitle } from "@/lib/use-page-title";
import { Container, PageHero } from "@/components/shared";
import { ServiceCatalog } from "@/components/service-catalog";

const STEPS = [
  { icon: ShoppingBagIcon, title: "Browse & select", text: "Find products, services and programmes from every business in the group." },
  { icon: CalendarCheckIcon, title: "Book or register", text: "Request appointments, or register interest in offerings that aren't live yet." },
  { icon: SmartphoneIcon, title: "Pay by Mobile Money", text: "For available products, follow the Mobile Money instructions at checkout." },
  { icon: MessageSquareIcon, title: "We confirm", text: "Our team verifies your payment manually and confirms your order." },
];

export default function ServiceCenterPage() {
  usePageTitle("Service Center");

  return (
    <>
      <PageHero
        eyebrow="Unified Service Center"
        title="Every offering in the group, in one place"
        intro="Shop products, request appointments, explore programmes and register interest across all seven businesses. Items marked “In development” are not yet available; register interest and we'll keep you informed."
      />

      <section className="bg-card text-card-foreground">
        <Container className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium">
                  <span className="text-muted-foreground">{i + 1}.</span> {title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

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
