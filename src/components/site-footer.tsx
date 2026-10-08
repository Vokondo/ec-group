import { Link } from "react-router";
import { ArrowRightIcon } from "lucide-react";
import { BUSINESSES, SITE } from "@/lib/site";

const YEAR = new Date().getFullYear();

const COLUMNS = [
  {
    title: "Group",
    links: [
      { to: "/about", label: "The Founder" },
      { to: "/holding", label: "Holding Company" },
      { to: "/businesses", label: "Portfolio" },
      { to: "/contact?topic=partnership", label: "Partnerships" },
    ],
  },
  {
    title: "Businesses",
    links: BUSINESSES.map((b) => ({ to: `/businesses/${b.slug}`, label: b.name })),
  },
  {
    title: "Service Center",
    links: [
      { to: "/service-center", label: "Browse offerings" },
      { to: "/service-center/booking", label: "Book an appointment" },
      { to: "/service-center/interest", label: "Register interest" },
      { to: "/service-center/checkout", label: "Cart & checkout" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6 lg:grid-cols-[1fr_1fr_1fr_1.4fr] lg:px-8">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-sm font-semibold text-white">{col.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/60 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="sm:col-span-3 lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-white">Stay updated</h3>
          <p className="mb-5 text-sm text-white/60">
            Many of our businesses are still being established. Register your interest to hear when products,
            programmes and services become available.
          </p>
          <Link
            to="/service-center/interest"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition hover:bg-brand/85"
          >
            Register interest <ArrowRightIcon className="size-4" />
          </Link>
          <div className="mt-6 space-y-1 text-sm text-white/60">
            <p>{SITE.contactEmail}</p>
            <p>{SITE.contactPhone}</p>
            <p>{SITE.address}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {YEAR} {SITE.holdingName}. All rights reserved.
      </div>
    </footer>
  );
}
