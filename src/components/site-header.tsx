import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { MenuIcon, ShoppingBagIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { monoButtonClass } from "@/lib/mono-button";
import { useCart } from "@/components/cart-provider";

// Glass edge: a bright top highlight, a faint lower rim and a soft drop shadow.
const glassEdge =
  "shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-1px_0_rgb(255_255_255/0.08),0_12px_32px_-12px_rgb(0_0_0/0.45)]";

// The mobile menu also lists Home.
const MENU_LINKS = [{ to: "/", label: "Home" }, ...NAV_LINKS];

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const overlayHover = "hover:bg-white/10 hover:text-white";
  const scrolled = useScrolled(8);
  const { pathname } = useLocation();

  return (
    // A floating frosted-glass pill below the top edge: light frost over the dark hero, smoked
    // frost once the page scrolls so white text stays readable over light sections.
    <header className="fixed inset-x-0 top-0 z-40 w-full px-3 pt-3 text-white sm:px-6 sm:pt-4">
      <div
        className={cn(
          "relative isolate mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto] items-center gap-4 rounded-full pr-2 pl-5 ring-1 backdrop-blur-2xl backdrop-saturate-[1.8] transition-[background-color,box-shadow] duration-300 sm:pl-6 lg:grid-cols-[1fr_auto_1fr]",
          glassEdge,
          scrolled ? "bg-neutral-900/55 ring-white/15" : "bg-white/10 ring-white/25",
        )}
      >
        {/* Liquid sheen: a soft light falling from the top edge */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-white/20 via-white/5 to-transparent"
        />
        <Link to="/" className="text-[13px] font-light tracking-wide sm:text-sm">
          {SITE.siteName}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-light transition-colors",
                  isActive
                    ? "bg-white/20 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3)]"
                    : "text-white/75 hover:bg-white/10 hover:text-white",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative rounded-full", overlayHover)}
          >
            <ShoppingBagIcon />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-brand text-[10px] font-semibold text-brand-foreground">
                {count}
              </span>
            )}
          </button>
          <Link
            to="/contact?topic=partnership"
            className="hidden h-10 items-center rounded-full bg-white/90 px-5 text-sm font-medium text-ink shadow-[inset_0_1px_0_rgb(255_255_255),0_4px_14px_-4px_rgb(0_0_0/0.3)] transition-colors hover:bg-white sm:inline-flex"
          >
            Partner with us
          </Link>
          <Sheet>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full lg:hidden", overlayHover)}
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
                <SheetTitle className="text-[13px] font-light tracking-wide text-white sm:text-sm">{SITE.siteName}</SheetTitle>
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
