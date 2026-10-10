import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { MenuIcon, ShoppingBagIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/components/cart-provider";

export function SiteHeader() {
  const { count } = useCart();
  const overlayHover = "hover:bg-white/10 hover:text-white";
  const scrolled = useScrolled(8);

  return (
    // Transparent over each page's dark hero; once the page scrolls it pops in as a solid bar.
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 w-full text-white transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-b border-white/10 bg-ink shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)]"
          : "border-b border-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-[height] duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-14" : "h-16",
        )}
      >
        <Link to="/" className="text-sm font-semibold tracking-wide sm:text-base">
          {SITE.siteName}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-xs font-medium tracking-wider uppercase transition-opacity hover:opacity-100",
                  isActive ? "opacity-100" : "opacity-70",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/service-center/checkout"
            aria-label={`Cart, ${count} items`}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative rounded-full", overlayHover)}
          >
            <ShoppingBagIcon />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-brand text-[10px] font-semibold text-brand-foreground">
                {count}
              </span>
            )}
          </Link>
          <Link
            to="/contact?topic=partnership"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "hidden rounded-full sm:inline-flex",
              "border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white",
            )}
          >
            Partner with us
          </Link>
          <Sheet>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden", overlayHover)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{SITE.siteName}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <SheetClose
                    key={link.to}
                    render={<Link to={link.to} />}
                    nativeButton={false}
                    className="rounded-md px-2 py-2.5 text-left text-sm hover:bg-muted"
                  >
                    {link.label}
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// True once the page has scrolled past `threshold` pixels.
function useScrolled(threshold: number) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);
  return scrolled;
}
