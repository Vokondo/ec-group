import { useEffect } from "react";
import { SITE } from "@/lib/site";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE.siteName}` : SITE.siteName;
  }, [title]);
}
