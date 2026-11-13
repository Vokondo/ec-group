import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { MenuIcon, ShoppingBagIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { monoButtonClass } from "@/lib/mono-button";
import { useCart } from "@/components/cart-provider";

// Glass edge: a bright top highlight and a faint lower rim.
const glassEdge = "shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-1px_0_rgb(255_255_255/0.08)]";

// Collapse motion: a soft, decelerating ease shared by the glass, its shadow and its edge.
const flow = "duration-[650ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";

// The mobile menu also lists Home.
const MENU_LINKS = [{ to: "/", label: "Home" }, ...NAV_LINKS];

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  // Past the hero, the bar flows into a round menu button at the right.
  const collapsed = usePastHero(pathname);
  const overlayHover = "hover:bg-white/10 hover:text-white";

  return (
    // One fixed look everywhere: smoked frosted glass with white text, readable over both dark
    // photos and light sections, so nothing about the glass changes while the page scrolls.
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 w-full px-3 pt-3 sm:px-6 sm:pt-4">
      {/* Past the hero the bar folds into a circle at the right. The glass never changes size:
          it is clipped down instead, which avoids re-laying out and re-blurring it every frame. */}
      <div className="relative mx-auto h-14 max-w-6xl">
        {/* Drop shadow, kept outside the clipped glass so it follows the shape */}
        <div
          aria-hidden
          className={cn(
            "absolute top-0 right-0 h-14 rounded-full shadow-[0_12px_32px_-12px_rgb(0_0_0/0.45)] transition-[width]",
            flow,
            collapsed ? "w-14" : "w-full",
          )}
        />
        <div
          style={{ clipPath: collapsed ? "inset(0 0 0 calc(100% - 3.5rem) round 9999px)" : "inset(0 0 0 0 round 9999px)" }}
          className={cn(
            "pointer-events-auto absolute inset-0 isolate overflow-hidden rounded-full bg-neutral-900/45 text-white ring-1 ring-white/20 ring-inset backdrop-blur-xl backdrop-saturate-[1.8] transition-[clip-path] will-change-[clip-path]",
            flow,
            glassEdge,
          )}
        >
          {/* Liquid sheen: a soft light falling from the top edge */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-white/20 via-white/5 to-transparent"
          />

          <div
            inert={collapsed}
            className={cn(
              "absolute inset-0 grid grid-cols-[1fr_auto] items-center gap-4 pr-2 pl-5 transition-opacity sm:pl-6 lg:grid-cols-[1fr_auto_1fr]",
              collapsed ? "opacity-0 duration-200" : "opacity-100 delay-200 duration-300",
            )}
          >
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
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full lg:hidden", overlayHover)}
              >
                <MenuIcon />
              </button>
            </div>
          </div>

          {/* The circle's menu button, with its own glass edge, shown once the bar has collapsed */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            tabIndex={collapsed ? 0 : -1}
            aria-hidden={!collapsed}
            className={cn(
              "absolute inset-y-0 right-0 grid w-14 place-items-center rounded-full ring-1 ring-white/20 ring-inset transition-opacity",
              glassEdge,
              collapsed ? "opacity-100 delay-300 duration-300" : "pointer-events-none opacity-0 duration-150",
            )}
          >
            <MenuIcon className="size-5" />
          </button>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        {/* Full-screen dark menu: page links and one call to action */}
        <SheetContent
          side="top"
          showCloseButton={false}
          className="gap-0 border-0 bg-ink p-0 text-white data-[side=top]:h-dvh data-[side=top]:border-b-0"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
            <SheetTitle className="text-[13px] font-light tracking-wide text-white sm:text-sm">{SITE.siteName}</SheetTitle>
            <SheetClose className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hover:bg-white/10 hover:text-white")} aria-label="Close menu">
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
    </header>
  );
}

// True once the page has scrolled past the hero (the first block of the page), with a little
// slack either side so the bar does not flicker between states right at the boundary.
function usePastHero(pathname: string) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const check = () => {
      const hero = document.querySelector("main")?.firstElementChild as HTMLElement | null;
      const end = Math.max(hero?.offsetHeight ?? 0, window.innerHeight * 0.5) - 80;
      setPast((prev) => (prev ? window.scrollY > end - 24 : window.scrollY > end + 24));
    };
    check();
    const timer = window.setTimeout(check, 150);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [pathname]);
  return past;
}
