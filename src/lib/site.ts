// Single source of truth for all site content.
// Placeholders in [brackets] must be replaced once the owner confirms names and details.
// Anything not yet operational is marked status "proposed" and must not show prices or timelines.

export const SITE = {
  // Brand shown in the header, browser tab titles and footer, with this exact casing.
  siteName: "enock CHANIMBE",
  holdingName: "CHANIMBE GROUP",
  founderName: "Enock Chanimbe",
  // Founder portrait, e.g. "/images/founder.jpg" in public/. Shown on the home page and the Founder page.
  founderImage: undefined as string | undefined,
  description:
    "The official home of Enock Chanimbe and CHANIMBE GROUP, bringing together the group's businesses, initiatives and opportunities.",
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
  // A plain string, or { title, image } to give the offer card a photo
  // (e.g. "/images/offers/university-media.jpg" in public/). Cards without one show a placeholder.
  offers: (string | Offer)[];
  audience: string;
  available: string[];
  cta: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  // Cover photo, e.g. "/images/businesses/green-foods.jpg" (put files in public/images/businesses/).
  // Leave unset to show an image placeholder.
  image?: string;
  // Optional schools/departments, shown as a dedicated section on the detail page.
  schools?: School[];
  // Optional "how it all fits together" section shown after the schools.
  synergy?: { title: string; points: string[]; closing: string };
  // Optional flagship project with Mobile Money donation details, shown on the detail page.
  donation?: Donation;
};

export type Donation = {
  project: string;
  hashtag: string;
  intro: string;
  appeal: string;
  momoAccountName: string;
  momoNumber: string;
  merchantId: string;
  email: string;
  // "About the project" paragraphs, shown above the gallery.
  about?: string[];
  // Project photos, e.g. { image: "/images/foundation/school-1.jpg", caption: "…" } (files in public/).
  // Items without an image show a placeholder.
  gallery?: { image?: string; caption?: string }[];
};

export type Offer = { title: string; image?: string };

export const toOffer = (o: string | Offer): Offer => (typeof o === "string" ? { title: o } : o);

export type School = {
  name: string;
  tagline: string;
  intro: string;
  programmes: string[];
  outcome: string;
};

export const BUSINESSES: Business[] = [
  {
    slug: "university",
    name: "University",
    sector: "Education",
    status: "proposed",
    summary:
      "Three schools built around one idea: practical, career-ready education in media and creative arts, science and technology, and the green economy.",
    why: "To turn talent, science and agriculture into careers and businesses, so graduates leave with real skills, real portfolios and links to industry, not just a certificate.",
    offers: [
      "School of Media, Communication, Creative & Skilled Arts",
      "School of Pure Science & Technology",
      "School of Agriculture, Sanitation & Recycling (Green Economy)",
      "Industry internships and portfolio-based learning",
    ],
    audience:
      "Prospective students, creatives, artisans, future scientists, engineers and farmers, as well as educators, industry partners and affiliated companies.",
    available: ["Expressions of interest from students and educators"],
    cta: { label: "Express interest", to: "/service-center/interest?business=university" },
    secondaryCta: { label: "Contact us", to: "/contact" },
    image: "/images/businesses/university.jpg",
    schools: [
      {
        name: "School of Media, Communication, Creative & Skilled Arts",
        tagline: "Where Talent Becomes a Career",
        intro:
          "Our star school. It trains people to make money from creativity, not just to earn a certificate.",
        programmes: [
          "Skilled Arts: Makeup, Interior Design, Event Management, Barbering, Steel Bending, Carpentry, Plumbing and Shoe Making",
          "Social Media & Digital Marketing",
          "Journalism, PR & Strategic Communication",
          "Film, Photography & Content Creation",
          "Graphic Design & Animation",
          "Fashion, Music & Performing Arts",
        ],
        outcome:
          "Every business in Ghana needs content creators, social media managers and designers. Students graduate with a portfolio, not just a certificate.",
      },
      {
        name: "School of Pure Science & Technology",
        tagline: "Science That Solves Real Problems",
        intro: "Not just theory. Practical science and technology that builds things.",
        programmes: [
          "Computer Science, AI & Data",
          "Software Engineering & Cybersecurity",
          "Pure Sciences: Biology, Chemistry, Physics and Mathematics",
          "Biomedical Science & Lab Technology",
          "Engineering Technology: Electrical, Mechanical, Civil Tech, Robotics and Industrial Tech",
        ],
        outcome:
          "Africa needs technical people who can build industrial equipment to turn our raw materials into finished products, build roads, and build and maintain modern labs, especially industrial chemistry labs. Students are linked directly to industries and affiliated companies for internships.",
      },
      {
        name: "School of Agriculture, Sanitation & Recycling (Green Economy)",
        tagline: "Feeding the Nation, Cleaning the Future",
        intro: "Agriculture feeds the world. Sanitation and recycling are the next big business.",
        programmes: [
          "Modern Agriculture & Agribusiness",
          "Food Processing & Food Science",
          "Environmental Sanitation & Public Health",
          "Waste Management, Recycling & Circular Economy",
          "Water Technology & Renewable Energy",
        ],
        outcome:
          "Students learn how to turn waste into money, plastic into products, and farms into businesses.",
      },
    ],
    synergy: {
      title: "How the three schools work together",
      points: [
        "Media students promote the products made by Agriculture students.",
        "Tech students build apps for farmers and waste collectors.",
        "Agriculture students feed the students and supply the community.",
      ],
      closing: "That is the Chanimbe difference: Create, Innovate, Sustain.",
    },
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
    image: "/images/businesses/barbering-shop.jpg",
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
    image: "/images/businesses/bank.jpg",
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
    summary:
      "Chanimbe Africa Foundation LBG. Our vision for the next 20 years is to end schools under trees in Ghana.",
    why: "No child should learn under a tree. We are changing the narrative, one school at a time, because our schools must be reformed.",
    offers: [
      "1 Cedi for Schools Under Trees",
      "Building and reforming schools in underserved communities",
      "Partnership, volunteering and support opportunities",
    ],
    audience: "Communities, schools, volunteers, donors and partner organizations.",
    available: ["Donations via Mobile Money", "Volunteering and partnership inquiries"],
    cta: { label: "Donate 1 Cedi", to: "/businesses/foundation#donate" },
    secondaryCta: { label: "Get involved", to: "/contact?topic=foundation" },
    donation: {
      project: "1 Cedi for Schools Under Trees",
      hashtag: "#1CediForSchoolsUnderTrees",
      intro: "We are changing the narrative, one school at a time. Our schools must be reformed.",
      appeal:
        "Don't wait until you have 100,000 or even 10,000 to make an impact on a person or a people. Use your 1 Cedi today.",
      momoAccountName: "Chanimbe Africa Foundation LBG",
      momoNumber: "0247045213",
      merchantId: "264430",
      email: "chanimbeafricafoundation@gmail.com",
      about: [
        "Across Ghana, many children still learn under trees, exposed to sun and rain, without classrooms, desks or proper learning materials.",
        "1 Cedi for Schools Under Trees invites everyone to give what they can, starting from just 1 Cedi. Small contributions, pooled together, help build classrooms and reform schools in the communities that need them most.",
        "Over the next 20 years, Chanimbe Africa Foundation LBG aims to end schools under trees in Ghana, one school at a time.",
      ],
      gallery: [{}, {}, {}, {}, {}],
    },
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
    image: "/images/businesses/bicycle-run.jpg",
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
  { id: "uni-media", business: "university", kind: "programme", name: "School of Media, Communication, Creative & Skilled Arts", description: "Where talent becomes a career: skilled arts, digital marketing, journalism, film, design, fashion, music and performing arts.", category: "Education", price: null, status: "proposed", image: "/images/offerings/uni-programmes.jpg" },
  { id: "uni-science", business: "university", kind: "programme", name: "School of Pure Science & Technology", description: "Science that solves real problems: computing, AI, cybersecurity, pure sciences, biomedical science and engineering technology.", category: "Education", price: null, status: "proposed", image: "/images/offerings/uni-programmes.jpg" },
  { id: "uni-green", business: "university", kind: "programme", name: "School of Agriculture, Sanitation & Recycling", description: "Feeding the nation, cleaning the future: agribusiness, food science, sanitation, recycling, water and renewable energy.", category: "Education", price: null, status: "proposed", image: "/images/offerings/uni-programmes.jpg" },
  { id: "uni-faculty", business: "university", kind: "programme", name: "Educator & faculty interest", description: "For educators who would like to teach or collaborate with the university.", category: "Education", price: null, status: "proposed", image: "/images/offerings/uni-faculty.jpg" },
  { id: "gf-products", business: "green-foods", kind: "product", name: "Green Foods product range", description: "Nutritious food products, with categories to be announced.", category: "Food", price: null, status: "proposed" },
  { id: "gf-distribution", business: "green-foods", kind: "service", name: "Distribution partnership", description: "For retailers and distributors interested in stocking Green Foods.", category: "Food", price: null, status: "proposed", image: "/images/offerings/gf-distribution.jpg" },
  { id: "bb-haircut", business: "barbering-shop", kind: "service", name: "Haircut & styling", description: "Classic and modern cuts. Request an appointment.", category: "Grooming", price: null, status: "proposed", image: "/images/offerings/bb-haircut.jpg" },
  { id: "bb-beard", business: "barbering-shop", kind: "service", name: "Beard trim & shave", description: "Beard shaping, trims and hot-towel shaves.", category: "Grooming", price: null, status: "proposed", image: "/images/offerings/bb-beard.jpg" },
  { id: "bank-interest", business: "bank", kind: "service", name: "Future financial services", description: "Register interest only. No banking services are offered at this time.", category: "Finance", price: null, status: "proposed", image: "/images/offerings/bank-interest.jpg" },
  { id: "cos-skincare", business: "cosmetics", kind: "product", name: "Skincare collection", description: "Everyday skincare products, coming soon.", category: "Beauty", price: null, status: "proposed" },
  { id: "cos-personal-care", business: "cosmetics", kind: "product", name: "Personal care range", description: "Personal care essentials, coming soon.", category: "Beauty", price: null, status: "proposed" },
  { id: "fd-schools", business: "foundation", kind: "programme", name: "1 Cedi for Schools Under Trees", description: "Help end schools under trees in Ghana. Donate via Mobile Money to Chanimbe Africa Foundation LBG.", category: "Community", price: null, status: "proposed" },
  { id: "fd-volunteer", business: "foundation", kind: "programme", name: "Volunteer programme", description: "Support the Foundation's community initiatives.", category: "Community", price: null, status: "proposed" },
  { id: "fd-partner", business: "foundation", kind: "programme", name: "Community partnerships", description: "For organizations interested in partnering on community programmes.", category: "Community", price: null, status: "proposed" },
  { id: "br-rides", business: "bicycle-run", kind: "event", name: "Community rides", description: "Group rides for all levels. Register to hear about upcoming dates.", category: "Wellness", price: null, status: "proposed", image: "/images/offerings/br-rides.jpg" },
  { id: "br-events", business: "bicycle-run", kind: "event", name: "Bicycle Run events", description: "Prospective cycling events and fitness activities.", category: "Wellness", price: null, status: "proposed", image: "/images/offerings/br-events.jpg" },
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
