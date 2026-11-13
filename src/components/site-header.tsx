import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { MailIcon, MenuIcon, MessageCircleIcon, MoonIcon, PhoneIcon, SearchIcon, ShoppingBagIcon, SunIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { monoButtonClass } from "@/lib/mono-button";
import { useCart } from "@/components/cart-provider";
import { useTheme } from "@/lib/theme";

// The header and the mobile menu both list Home.
const MENU_LINKS = [{ to: "/", label: "Home" }, ...NAV_LINKS];

const phoneDigits = SITE.contactPhone.replace(/\D/g, "");
const CONTACT_LINKS = [
  { icon: PhoneIcon, label: "Call us", href: `tel:+${phoneDigits}` },
  { icon: MessageCircleIcon, label: "WhatsApp us", href: `https://wa.me/${phoneDigits}` },
  { icon: MailIcon, label: "Email us", href: `mailto:${SITE.contactEmail}` },
];

const iconButton = cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full text-muted-foreground hover:text-foreground");

// A full-width white header in the page flow, flush with the top and sides: contact links, the
// name and search on the first row, the page links centred on the second. Content starts right below it.
export function SiteHeader() {
  const { count, setOpen } = useCart();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const themeLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  const ThemeIcon = theme === "dark" ? SunIcon : MoonIcon;
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header className="sticky top-0 z-40 border-b bg-card text-foreground">
      <div>
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 sm:h-20 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className={cn(iconButton, "md:hidden")}>
              <MenuIcon />
            </button>
            <div className="hidden items-center gap-0.5 md:flex">
              {CONTACT_LINKS.map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} aria-label={label} className={iconButton} {...(href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}>
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <Link to="/" className="text-base font-light tracking-wide whitespace-nowrap sm:text-xl">
            {SITE.siteName}
          </Link>

          <div className="flex items-center justify-end gap-1.5">
            <HeaderSearch className="hidden md:flex" />
            <button type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel} className={iconButton}>
              <ThemeIcon />
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
              className={cn(iconButton, "relative")}
            >
              <ShoppingBagIcon />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-brand text-[10px] font-semibold text-brand-foreground">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="hidden h-12 items-center justify-center gap-1 border-t md:flex">
          {MENU_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={cn(
                "px-3 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-colors lg:px-4",
                isActive(link.to) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className={cn("border-b pb-0.5", isActive(link.to) ? "border-foreground" : "border-transparent")}>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        {/* Full-screen dark menu: search, page links and one call to action */}
        <SheetContent
          side="top"
          showCloseButton={false}
          className="gap-0 border-0 bg-ink p-0 text-white data-[side=top]:h-dvh data-[side=top]:border-b-0"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
            <SheetTitle className="text-base font-light tracking-wide text-white">{SITE.siteName}</SheetTitle>
            <SheetClose className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hover:bg-white/10 hover:text-white")} aria-label="Close menu">
              <XIcon />
            </SheetClose>
          </div>
          <div className="px-4 sm:px-6">
            <HeaderSearch dark onSearch={() => setMenuOpen(false)} />
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 pt-6 sm:px-6">
            {MENU_LINKS.map((link) => (
              <SheetClose
                key={link.to}
                render={<Link to={link.to} />}
                nativeButton={false}
                aria-current={isActive(link.to) ? "page" : undefined}
                className={cn(
                  "py-2.5 text-left text-2xl font-light transition-colors",
                  isActive(link.to) ? "text-white" : "text-white/60 hover:text-white",
                )}
              >
                {link.label}
              </SheetClose>
            ))}
          </nav>
          <div className="shrink-0 px-4 pt-4 pb-8 sm:px-6">
            <div className="mb-4 flex gap-1">
              {CONTACT_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full text-white/70 hover:bg-white/10 hover:text-white")}
                >
                  <Icon className="size-4" />
                </a>
              ))}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={themeLabel}
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "ml-auto rounded-full text-white/70 hover:bg-white/10 hover:text-white")}
              >
                <ThemeIcon className="size-4" />
              </button>
            </div>
            <SheetClose render={<Link to="/contact?topic=partnership" />} nativeButton={false} className={monoButtonClass("solid", "w-full")}>
              Partner with us
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

// Rounded search field that searches the Service Center.
function HeaderSearch({ className, dark, onSearch }: { className?: string; dark?: boolean; onSearch?: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        navigate(q ? `/service-center?q=${encodeURIComponent(q)}` : "/service-center");
        setQuery("");
        onSearch?.();
      }}
      className={cn(
        "flex h-10 items-center rounded-full border pr-1 pl-4",
        dark ? "border-white/25 bg-white/5" : "w-56 border-foreground/20 lg:w-64",
        className,
      )}
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="I'm searching for…"
        aria-label="Search products and services"
        className={cn(
          "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:italic",
          dark ? "text-white placeholder:text-white/50" : "placeholder:text-muted-foreground",
        )}
      />
      <button type="submit" aria-label="Search" className={cn("grid size-8 place-items-center rounded-full", dark ? "text-white" : "text-foreground")}>
        <SearchIcon className="size-4" />
      </button>
    </form>
  );
}
