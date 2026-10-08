import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { SITE } from "@/lib/site";
import { usePageTitle } from "@/lib/use-page-title";
import { Container, PageHero } from "@/components/shared";
import { InquiryForm, type FormType } from "@/components/inquiry-form";

export function FormPage({
  pageTitle,
  eyebrow,
  title,
  intro,
  type,
  defaultBusiness = "",
  defaultTopic = "",
}: {
  pageTitle: string;
  eyebrow: string;
  title: string;
  intro: string;
  type: FormType;
  defaultBusiness?: string;
  defaultTopic?: string;
}) {
  usePageTitle(pageTitle);
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} intro={intro} />
      <section className="py-12 sm:py-16 lg:py-20">
        <Container className="grid gap-8 lg:gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="light bg-background text-foreground rounded-3xl p-6 sm:p-10">
            {/* Keyed so the form resets when the URL preselects a different business or topic */}
            <InquiryForm
              key={`${defaultBusiness}-${defaultTopic}`}
              type={type}
              defaultBusiness={defaultBusiness}
              defaultTopic={defaultTopic}
            />
          </div>
          <aside className="space-y-6">
            <div className="rounded-3xl bg-muted/60 p-6">
              <h2 className="font-semibold">Contact the group</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3"><MailIcon className="size-4 shrink-0" />{SITE.contactEmail}</li>
                <li className="flex gap-3"><PhoneIcon className="size-4 shrink-0" />{SITE.contactPhone}</li>
                <li className="flex gap-3"><MapPinIcon className="size-4 shrink-0" />{SITE.address}</li>
              </ul>
            </div>
            <p className="px-2 text-xs text-muted-foreground">
              Several of our businesses are still being established. Submitting a request registers your interest; it
              is not a confirmed booking, order or account until we contact you.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
