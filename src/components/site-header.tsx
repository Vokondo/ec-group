import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { MenuIcon, ShoppingBagIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { monoButtonClass } from "@/lib/mono-button";
import { useCart } from "@/components/cart-provider";

// The mobile menu also lists Home.
const MENU_LINKS = [{ to: "/", label: "Home" }, ...NAV_LINKS];

export function SiteHeader() {
  const { count } = useCart();
  const overlayHover = "hover:bg-white/10 hover:text-white";
  const scrolled = useScrolled(8);
  const { pathname } = useLocation();

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
            {/* Full-screen dark menu: page links and one call to action */}
            <SheetContent
              side="top"
              showCloseButton={false}
              className="gap-0 border-0 bg-ink p-0 text-white data-[side=top]:h-dvh data-[side=top]:border-b-0"
            >
              <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
                <SheetTitle className="text-sm font-semibold tracking-wide text-white sm:text-base">{SITE.siteName}</SheetTitle>
                <SheetClose className={cn(buttonVariants({ variant: "ghost", size: "icon" }), overlayHover)} aria-label="Close menu">
                  <XIcon />
                </SheetClose>
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pt-6 sm:px-6">
                {MENU_LINKS.map((link) => {
                  const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
                  return (
                    <SheetClose
                      key={link.to}
                      render={<Link to={link.to} />}
                      nativeButton={false}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "py-2.5 text-left text-2xl font-light transition-colors",
                        active ? "text-white" : "text-white/60 hover:text-white",
                      )}
                    >
                      {link.label}
                    </SheetClose>
                  );
                })}
              </nav>
              <div className="shrink-0 px-4 pt-4 pb-8 sm:px-6">
                <SheetClose
                  render={<Link to="/contact?topic=partnership" />}
                  nativeButton={false}
                  className={monoButtonClass("solid", "w-full")}
                >
                  Partner with us
                </SheetClose>
              </div>
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
