import { usePageTitle } from "@/lib/use-page-title";
import { MonoLink } from "@/components/mono-link";
import { PageHero } from "@/components/shared";

export default function NotFoundPage() {
  usePageTitle("Page not found");
  return (
    <PageHero eyebrow="404" title="Page not found" intro="The page you're looking for doesn't exist or has moved.">
      <MonoLink to="/">Back to home</MonoLink>
    </PageHero>
  );
}
