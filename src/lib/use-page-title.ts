import { useEffect } from "react";
import { SITE } from "@/lib/site";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE.holdingName}` : SITE.holdingName;
  }, [title]);
}
