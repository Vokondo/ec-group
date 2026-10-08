// Single source of truth for all site content.
// Placeholders in [brackets] must be replaced once the owner confirms names and details.
// Anything not yet operational is marked status "proposed" and must not show prices or timelines.

export const SITE = {
  holdingName: "[Holding Company Name]",
  founderName: "[Founder Name]",
  description:
    "The official home of [Founder Name] and [Holding Company Name], bringing together the group's businesses, initiatives and opportunities.",
  contactEmail: "hello@example.com",
  contactPhone: "+000 000 000 000",
  address: "[City, Country]",
};

export type BusinessStatus = "available" | "proposed";

export type Business = {
  slug: string;
  name: string;
  sector: string;
  status: BusinessStatus;
  summary: string;
  why: string;
  offers: string[];
  audience: string;
  available: string[];
  cta: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  // Cover photo, e.g. "/images/businesses/green-foods.jpg" (put files in public/images/businesses/).
  // Leave unset to show an image placeholder.
  image?: string;
};

export const BUSINESSES: Business[] = [
  {
    slug: "university",
    name: "University",
    sector: "Education",
    status: "proposed",
    summary: "An institution dedicated to education, skills development and professional advancement.",
    why: "To widen access to quality higher education and to prepare graduates for real professional impact.",
    offers: [
      "Proposed academic areas (to be confirmed)",
      "Prospective programmes and certifications",
      "Skills development and professional training",
    ],
    audience: "Prospective students, educators and academic partners.",
    available: ["Expressions of interest from students and educators"],
    cta: { label: "Express interest", to: "/service-center/interest?business=university" },
    secondaryCta: { label: "Contact us", to: "/contact" },
  },
  {
    slug: "green-foods",
    name: "Green Foods",
    sector: "Food & Nutrition",
    status: "proposed",
    summary: "A business focused on food products, nutrition and related commercial activities.",
    why: "To make nutritious, carefully sourced food easier to find for everyday households.",
    offers: [
      "Intended product categories (to be confirmed)",
      "Quality-focused sourcing and handling",
      "Distribution partnerships",
    ],
    audience: "Health-conscious consumers, retailers and distributors.",
    available: ["Distributor and customer inquiries"],
    cta: { label: "Make an inquiry", to: "/contact?topic=green-foods" },
  },
  {
    slug: "barbering-shop",
    name: "Barbering Shop",
    sector: "Grooming & Personal Care",
    status: "proposed",
    summary: "A grooming and personal care service focused on a consistently good customer experience.",
    why: "To give clients a reliable, comfortable place for quality grooming.",
    offers: ["Haircuts and styling (proposed)", "Beard and shave services (proposed)", "Appointment booking"],
    audience: "Men looking for regular, quality grooming.",
    available: ["Appointment and service requests"],
    cta: { label: "Request an appointment", to: "/service-center/booking?business=barbering-shop" },
  },
  {
    slug: "bank",
    name: "Bank",
    sector: "Financial Services",
    status: "proposed",
    summary: "A proposed financial institution aiming to serve individuals, businesses and economic development.",
    why: "To broaden access to financial services and support local enterprise.",
    offers: [
      "Proposed areas of financial service (to be confirmed)",
      "Services will be offered only once duly authorized",
    ],
    audience: "Individuals, small businesses and potential partners.",
    available: ["No banking services are offered at this time", "Registering interest for future updates"],
    cta: { label: "Register interest", to: "/service-center/interest?business=bank" },
    secondaryCta: { label: "Contact us", to: "/contact" },
  },
  {
    slug: "cosmetics",
    name: "Cosmetics",
    sector: "Beauty & Skincare",
    status: "proposed",
    summary: "A brand focused on beauty, skincare and personal care products.",
    why: "To offer effective, well-presented products for everyday self-care.",
    offers: ["Intended product categories (to be confirmed)", "Skincare and personal care lines (proposed)"],
    audience: "Beauty and skincare customers and retailers.",
    available: ["Product interest registration"],
    cta: { label: "Register interest", to: "/service-center/interest?business=cosmetics" },
  },
  {
    slug: "foundation",
    name: "Foundation",
    sector: "Social Impact",
    status: "proposed",
    summary: "The group's social impact and community development arm.",
    why: "To express the group's commitment to social responsibility and positive community outcomes.",
    offers: [
      "Community initiatives (to be confirmed)",
      "Prospective programmes",
      "Partnership, volunteering and support opportunities",
    ],
    audience: "Communities, volunteers, donors and partner organizations.",
    available: ["Volunteering and partnership inquiries"],
    cta: { label: "Get involved", to: "/contact?topic=foundation" },
  },
  {
    slug: "bicycle-run",
    name: "Bicycle Run",
    sector: "Cycling & Wellness",
    status: "proposed",
    summary: "An initiative for cycling, recreation, fitness, wellness and community participation.",
    why: "To build an active community around cycling and healthy living.",
    offers: ["Proposed cycling activities (to be confirmed)", "Community rides and events (prospective)"],
    audience: "Cyclists, fitness enthusiasts and community groups.",
    available: ["Interest registration for upcoming activities"],
    cta: { label: "Join the community", to: "/service-center/interest?business=bicycle-run" },
  },
];

export const getBusiness = (slug: string | undefined) => BUSINESSES.find((b) => b.slug === slug);

export const NAV_LINKS = [
  { to: "/about", label: "Founder" },
  { to: "/holding", label: "Holding Company" },
  { to: "/businesses", label: "Businesses" },
  { to: "/service-center", label: "Service Center" },
  { to: "/contact", label: "Contact" },
];

// ---------------------------------------------------------------------------
// Unified Service Center catalog
// `price: null` means the price is not yet confirmed: the item shows "Register interest"
// instead of "Add to cart". Set a price and status "available" to make a product purchasable.

export type OfferingKind = "product" | "service" | "programme" | "event";

export type Offering = {
  id: string;
  business: string; // Business slug
  kind: OfferingKind;
  name: string;
  description: string;
  category: string;
  price: number | null;
  status: BusinessStatus;
  image?: string; // Optional photo; falls back to the business's image
};

export const KIND_LABELS: Record<OfferingKind, string> = {
  product: "Products",
  service: "Services",
  programme: "Programmes",
  event: "Events",
};

export const CATALOG: Offering[] = [
  { id: "uni-programmes", business: "university", kind: "programme", name: "Prospective academic programmes", description: "Register interest in proposed programmes as academic areas are confirmed.", category: "Education", price: null, status: "proposed" },
  { id: "uni-faculty", business: "university", kind: "programme", name: "Educator & faculty interest", description: "For educators who would like to teach or collaborate with the university.", category: "Education", price: null, status: "proposed" },
  { id: "gf-products", business: "green-foods", kind: "product", name: "Green Foods product range", description: "Nutritious food products, with categories to be announced.", category: "Food", price: null, status: "proposed" },
  { id: "gf-distribution", business: "green-foods", kind: "service", name: "Distribution partnership", description: "For retailers and distributors interested in stocking Green Foods.", category: "Food", price: null, status: "proposed" },
  { id: "bb-haircut", business: "barbering-shop", kind: "service", name: "Haircut & styling", description: "Classic and modern cuts. Request an appointment.", category: "Grooming", price: null, status: "proposed" },
  { id: "bb-beard", business: "barbering-shop", kind: "service", name: "Beard trim & shave", description: "Beard shaping, trims and hot-towel shaves.", category: "Grooming", price: null, status: "proposed" },
  { id: "bank-interest", business: "bank", kind: "service", name: "Future financial services", description: "Register interest only. No banking services are offered at this time.", category: "Finance", price: null, status: "proposed" },
  { id: "cos-skincare", business: "cosmetics", kind: "product", name: "Skincare collection", description: "Everyday skincare products, coming soon.", category: "Beauty", price: null, status: "proposed" },
  { id: "cos-personal-care", business: "cosmetics", kind: "product", name: "Personal care range", description: "Personal care essentials, coming soon.", category: "Beauty", price: null, status: "proposed" },
  { id: "fd-volunteer", business: "foundation", kind: "programme", name: "Volunteer programme", description: "Support the Foundation's community initiatives.", category: "Community", price: null, status: "proposed" },
  { id: "fd-partner", business: "foundation", kind: "programme", name: "Community partnerships", description: "For organizations interested in partnering on community programmes.", category: "Community", price: null, status: "proposed" },
  { id: "br-rides", business: "bicycle-run", kind: "event", name: "Community rides", description: "Group rides for all levels. Register to hear about upcoming dates.", category: "Wellness", price: null, status: "proposed" },
  { id: "br-events", business: "bicycle-run", kind: "event", name: "Bicycle Run events", description: "Prospective cycling events and fitness activities.", category: "Wellness", price: null, status: "proposed" },
];

// Mobile Money payment details shown at checkout. Replace with the confirmed account.
export const PAYMENT = {
  currency: "GHS", // confirm with the client
  momoNetwork: "[Mobile Money network]",
  momoNumber: "[Mobile Money number]",
  momoAccountName: "[Registered account name]",
};

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: PAYMENT.currency }).format(amount);
