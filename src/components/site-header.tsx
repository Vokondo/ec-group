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

  return (
    // Every page opens with a dark hero, so the header sits transparently over it, as on the landing page.
    <header className="absolute inset-x-0 top-0 z-40 w-full text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
