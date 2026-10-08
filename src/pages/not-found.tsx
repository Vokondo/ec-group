import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { usePageTitle } from "@/lib/use-page-title";
import { buttonVariants } from "@/components/ui/button";
import { PageHero, onDarkPrimary } from "@/components/shared";

export default function NotFoundPage() {
  usePageTitle("Page not found");
  return (
    <PageHero eyebrow="404" title="Page not found" intro="The page you're looking for doesn't exist or has moved.">
      <Link to="/" className={cn(buttonVariants({ size: "lg" }), onDarkPrimary)}>
        Back to home
      </Link>
    </PageHero>
  );
}
