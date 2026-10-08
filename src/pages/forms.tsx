import { useSearchParams } from "react-router";
import { getBusiness } from "@/lib/site";
import { FormPage } from "@/components/form-page";

export function ContactPage() {
  const [params] = useSearchParams();
  // ?topic=<business-slug> preselects that business; anything else prefills the topic field.
  const topic = params.get("topic") ?? "";
  const business = getBusiness(topic);
  return (
    <FormPage
      pageTitle="Contact"
      eyebrow="Contact"
      title="Get in touch"
      intro="General inquiries, partnership proposals, distribution, volunteering or media requests: we'd like to hear from you."
      type="inquiry"
      defaultBusiness={business?.slug}
      defaultTopic={business ? "" : topic}
    />
  );
}

export function BookingPage() {
  const [params] = useSearchParams();
  return (
    <FormPage
      pageTitle="Book an appointment"
      eyebrow="Service Center · Appointments"
      title="Request an appointment"
      intro="Tell us when suits you and which service you need. We'll contact you to confirm availability."
      type="booking"
      defaultBusiness={params.get("business") ?? "barbering-shop"}
    />
  );
}

export function InterestPage() {
  const [params] = useSearchParams();
  return (
    <FormPage
      pageTitle="Register interest"
      eyebrow="Service Center · Register interest"
      title="Be the first to know"
      intro="Many of our products, programmes and services are not yet available. Register your interest and we'll contact you when they launch."
      type="interest"
      defaultBusiness={params.get("business") ?? ""}
    />
  );
}
