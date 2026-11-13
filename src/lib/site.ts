import { media } from "@/lib/media";

// Single source of truth for all site content.
// Placeholders in [brackets] must be replaced once the owner confirms names and details.
// Anything not yet operational is marked status "proposed" and must not show prices or timelines.

export const SITE = {
  // Brand shown in the header, browser tab titles and footer, with this exact casing.
  siteName: "Enock Chanimbe",
  holdingName: "CHANIMBE GROUP",
  founderName: "Enock Chanimbe",
  // Founder portrait, e.g. "/images/founder.jpg" in public/. Shown on the home page and the Founder page.
  founderImage: undefined as string | undefined,
  description:
    "The official home of Enock Chanimbe and CHANIMBE GROUP, bringing together the group's businesses, initiatives and opportunities.",
  contactEmail: "hello@enockchanimbe.com",
  contactPhone: "+233 24 039 8035",
  address: "Central Region, Ghana",
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
  // The longer story behind "why", shown as paragraphs on the business page.
  story: string[];
  // "How it works" steps and "Questions" shown on the business page.
  steps: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  // Opening hours, once known. Shown as "To be announced" until set.
  hours?: string;
  // Optional content for the page sections each business uses (see lib/business-layouts.ts).
  statement?: string; // A short, bold line shown large on its own
  stats?: { value: string; label: string }[]; // Only facts or stated goals, never invented results
  pillars?: { heading: string; items: { title: string; text: string }[] };
  segments?: { heading: string; items: { title: string; text: string; image?: string }[] };
  checklist?: { heading: string; items: string[] };
  note?: { quote: string; by: string };
  feature?: { heading: string; text: string; image?: string; cta?: { label: string; to: string } };
  notice?: { heading: string; text: string };
  actions?: { heading: string; items: { title: string; text: string; cta: { label: string; to: string } }[] };
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
    name: "Chanimbe University",
    sector: "Education",
    status: "proposed",
    summary:
      "Three schools built around one idea: practical, career-ready education in media and creative arts, science and technology, and the green economy.",
    why: "To turn talent, science and agriculture into careers and businesses, so graduates leave with real skills, real portfolios and links to industry, not just a certificate.",
    offers: [
      "School of Media, Communication, Creative & Skilled Arts",
      "School of Pure Science & Technology",
      "School of Agriculture, Sanitation & Recycling (Green Economy)",
    ],
    audience:
      "Prospective students, creatives, artisans, future scientists, engineers and farmers, as well as educators, industry partners and affiliated companies.",
    available: ["Expressions of interest from students and educators"],
    cta: { label: "Express interest", to: "/service-center/interest?business=university" },
    secondaryCta: { label: "Contact us", to: "/contact" },
    image: "/images/businesses/university.jpg",
    statement: "Learn by doing. Graduate with a portfolio, not just a certificate.",
    stats: [
      { value: "3", label: "Schools, each linked to industry" },
      { value: "16", label: "Programme areas, from skilled arts to AI" },
      { value: "1", label: "Goal: a career or a business for every graduate" },
    ],
    notice: {
      heading: "Admissions are not yet open",
      text: "Chanimbe University is in development and is not admitting students or collecting fees. Express interest to hear when admissions open, and never pay anyone who claims they can enrol you on our behalf.",
    },
    story: [
      "Too many talented people leave school with a certificate but no clear path to work. At the same time, businesses across Ghana struggle to find creatives, technicians and agripreneurs who can deliver from day one.",
      "Chanimbe University is being built to close that gap. Each of its three schools pairs practical training with real projects and industry links, so students graduate with skills, a portfolio and the confidence to build a career or a business.",
    ],
    steps: [
      { title: "Express interest", text: "Tell us which school and programme area interests you." },
      { title: "Receive updates", text: "We share programme details, entry requirements and fees as they are confirmed." },
      { title: "Apply and enrol", text: "Apply once admissions open and start learning by doing." },
    ],
    faqs: [
      { q: "Is Chanimbe University accredited?", a: "Chanimbe University is in development. Programmes will be offered in line with the required national accreditation, and we will publish the status of each one." },
      { q: "When do admissions open?", a: "Admission dates have not been set yet. Express interest and you will be among the first to hear." },
      { q: "Can I teach or partner with you?", a: "Yes. Educators, industry practitioners and companies offering internships are welcome to get in touch." },
      { q: "How much will programmes cost?", a: "Fees will be published with each programme. Express interest to hear first." },
    ],
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
    summary: "Fresh, nutritious food products sourced with care for everyday households.",
    why: "Healthy food should be easy to find, affordable and trustworthy.",
    pillars: {
      heading: "What we stand for",
      items: [
        { title: "Fresh first", text: "Picked, packed and delivered with care, so food reaches you at its best." },
        { title: "Local growers", text: "Working with farmers across the region and paying them fairly for good produce." },
        { title: "Less waste", text: "Seasonal boxes and careful handling keep good food out of the bin." },
      ],
    },
    segments: {
      heading: "Good food for every table",
      items: [
        { title: "Households", text: "A weekly box of seasonal fruit and vegetables, plus healthy staples for the pantry." },
        { title: "Offices", text: "Fresh fruit and healthy snacks that keep teams going through the day." },
        { title: "Shops and restaurants", text: "Reliable bulk supply of fresh produce, delivered on a schedule that suits you." },
        { title: "Distributors", text: "Partner with us to bring Green Foods to more communities." },
      ],
    },
    feature: {
      heading: "The people behind the produce",
      text: "Green Foods is being built with local growers, not around them. Fair prices, steady orders and careful handling mean better food for you and a better living for the farmers who grow it.",
      image: "/images/offerings/gf-distribution.jpg",
      cta: { label: "Partner with us", to: "/contact?topic=green-foods" },
    },
    story: [
      "Eating well should not depend on where you live or how much time you have. Many households still struggle to find fresh, trustworthy produce at fair prices.",
      "Green Foods is being established to close that gap by working with local growers, handling food with care and delivering it simply, so that healthy choices become the easy choices.",
    ],
    offers: [
      "Fresh produce boxes",
      "Healthy pantry staples",
      { title: "Bulk supply for retailers and offices", image: "/images/offerings/gf-distribution.jpg" },
    ],
    audience: "Households, health conscious shoppers, shops, restaurants and offices.",
    available: ["Pre-order interest for produce boxes", "Distributor and retailer enquiries"],
    cta: { label: "Register interest", to: "/service-center/interest?business=green-foods" },
    secondaryCta: { label: "Stock Green Foods", to: "/contact?topic=green-foods" },
    image: "/images/home/green-foods.jpg",
    steps: [
      { title: "Register interest", text: "Let us know you would like a produce box or pantry staples." },
      { title: "Confirm your order", text: "At launch we confirm what is in each box, the price and the delivery day." },
      { title: "Enjoy fresh food", text: "Receive fresh, carefully sourced food at your door." },
    ],
    faqs: [
      { q: "When will produce boxes be available?", a: "Green Foods is in development. Register interest and we will let you know as soon as boxes launch." },
      { q: "Do you deliver?", a: "Delivery areas within the Central Region will be confirmed at launch." },
      { q: "Can my shop stock Green Foods?", a: "Yes. Wholesale and retail enquiries are welcome through the contact page." },
      { q: "Are your products certified?", a: "Packaged products will be registered with the relevant authorities before they are sold." },
    ],
  },
  {
    slug: "barbering-shop",
    name: "Degree Barber 1942",
    sector: "Grooming & Personal Care",
    status: "proposed",
    summary: "A modern barbershop for sharp cuts, clean shaves and a relaxed, on-time experience.",
    why: "Great grooming should be dependable: book a time, get seen on time, leave looking your best.",
    note: {
      quote: "A good cut should never cost you your afternoon. Book a time, we keep it, and you leave looking your best.",
      by: "The Degree Barber 1942 promise",
    },
    feature: {
      heading: "Visit the shop",
      text: "We are setting up in the Central Region of Ghana: clean chairs, sharp tools and a team that respects your time. The full address and opening hours will be shared before we open.",
      image: "/images/businesses/barbering-shop.jpg",
      cta: { label: "Book an appointment", to: "/service-center/booking?business=barbering-shop" },
    },
    story: [
      "A good barber is part of a man's routine and part of his confidence. Degree Barber 1942 is built on the idea that every cut should be precise, every visit should start on time and every client should feel welcome.",
      "We are bringing the craft of traditional barbering together with modern styles, clean tools and a booking system that respects your time.",
    ],
    offers: [
      { title: "Haircuts and fades", image: "/images/offerings/bb-haircut.jpg" },
      { title: "Beard trims, shaping and hot towel shaves", image: "/images/offerings/bb-beard.jpg" },
      "Kids' cuts",
      "Appointments and walk-ins",
    ],
    audience: "Men and boys who want consistent, quality grooming without the wait.",
    available: ["Request an appointment online", "Walk-ins when chairs are free, once open"],
    cta: { label: "Book an appointment", to: "/service-center/booking?business=barbering-shop" },
    image: "/images/businesses/barbering-shop.jpg",
    steps: [
      { title: "Book online", text: "Choose a service and a time that suits you." },
      { title: "We confirm", text: "We contact you to confirm your appointment." },
      { title: "Visit and relax", text: "Arrive, take a seat and leave looking sharp." },
    ],
    faqs: [
      { q: "Do I need an appointment?", a: "Appointments are recommended so you are seen on time, but walk-ins are welcome when chairs are free." },
      { q: "How much does a haircut cost?", a: "Prices will be published before opening." },
      { q: "Where are you located?", a: "Central Region, Ghana. The full address will be shared at opening." },
      { q: "Do you cut children's hair?", a: "Yes. Kids' cuts are part of our services." },
    ],
  },
  {
    slug: "bank",
    name: "Bank",
    sector: "Financial Services",
    status: "proposed",
    summary: "A proposed financial institution aiming to serve individuals, businesses and economic development.",
    why: "To broaden access to financial services and support local enterprise.",
    pillars: {
      heading: "Planned services, subject to authorization",
      items: [
        { title: "Save", text: "Savings products to help households and businesses build a cushion for the future." },
        { title: "Borrow", text: "Responsible credit for small businesses and individuals with a plan to grow." },
        { title: "Pay", text: "Everyday payments and transfers that are simple, fast and secure." },
      ],
    },
    checklist: {
      heading: "What this means today",
      items: [
        "No accounts are open",
        "No deposits are accepted",
        "No loans are offered",
        "No fees are charged",
        "Updates are shared by email only",
        "Never send money to anyone claiming to act for the Bank",
      ],
    },
    story: [
      "Small businesses and households across the region need better access to savings, credit and everyday financial services. The Bank is being planned to help meet that need and to support local enterprise.",
      "It will only offer services once every required regulatory authorization has been obtained. Until then, this page shares our intentions and progress, and nothing more.",
    ],
    offers: [
      "Proposed areas of financial service (to be confirmed)",
      "Services will be offered only once duly authorized",
    ],
    audience: "Individuals, small businesses and potential partners.",
    available: ["No banking services are offered at this time", "Registering interest for future updates"],
    cta: { label: "Register interest", to: "/service-center/interest?business=bank" },
    secondaryCta: { label: "Contact us", to: "/contact" },
    image: "/images/businesses/bank.jpg",
    steps: [
      { title: "Register interest", text: "Leave your details to receive updates." },
      { title: "Follow our progress", text: "We share updates as the authorization process advances." },
      { title: "Hear first", text: "Registered contacts are notified if and when services become available." },
    ],
    faqs: [
      { q: "Can I open an account?", a: "No. The Bank is a proposed financial institution and does not offer accounts or accept deposits." },
      { q: "When will services be available?", a: "Only after all required regulatory authorizations have been obtained. We will not give a date before then." },
      { q: "Can I send money to the Bank?", a: "No. The Bank does not accept funds from the public. Never send money to anyone claiming to collect deposits on its behalf." },
      { q: "How can I partner with the Bank?", a: "Potential partners can get in touch through the contact page." },
    ],
  },
  {
    slug: "cosmetics",
    name: "Degree Cosmetics",
    sector: "Beauty & Skincare",
    status: "proposed",
    summary: "A beauty and skincare brand made for everyday self care.",
    why: "Good skincare should be simple, effective and suited to our climate and skin types.",
    statement: "Simple routines. Honest ingredients. Made for our skin and our climate.",
    story: [
      "Skincare should be simple, effective and made for the skin and climate it is used in. Too often, people pay more for products that were never designed with them in mind.",
      "Degree Cosmetics is being created to offer a focused range of everyday essentials, with clear ingredients, honest claims and quality you can feel.",
    ],
    offers: ["Skincare essentials: cleansers, moisturisers and sunscreen", "Body care", "Gift sets"],
    audience: "Women and men looking for reliable daily skincare, and beauty retailers.",
    available: ["Join the launch list", "Retail and stockist enquiries"],
    cta: { label: "Join the launch list", to: "/service-center/interest?business=cosmetics" },
    secondaryCta: { label: "Stockist enquiries", to: "/contact?topic=cosmetics" },
    steps: [
      { title: "Join the launch list", text: "Sign up to hear about our first products." },
      { title: "Be first to know", text: "Launch list members get product details and launch dates first." },
      { title: "Order at launch", text: "Buy your favourites as soon as they are available." },
    ],
    faqs: [
      { q: "When will products be available?", a: "Degree Cosmetics is in development. Join the launch list and we will tell you first." },
      { q: "Will the products suit my skin?", a: "Products are being developed for everyday use and our climate. Full ingredient lists will be published with each product." },
      { q: "Can I stock Degree Cosmetics?", a: "Yes. Shops and salons are welcome to make stockist enquiries through the contact page." },
      { q: "Are the products registered?", a: "Products will be registered with the relevant authorities before they are sold." },
    ],
  },
  {
    slug: "enock-chanimbe",
    name: "Enock Chanimbe",
    sector: "Fashion & Clothing",
    status: "proposed",
    summary: "The group's clothing line, bringing everyday style under the Enock Chanimbe name.",
    why: "To create quality, distinctive clothing that people are proud to wear.",
    statement: "Well made. Worn with pride.",
    note: {
      quote: "Every piece should feel personal: the fit, the fabric and the finish. That is the standard behind the name.",
      by: "The Enock Chanimbe line",
    },
    story: [
      "Clothing is one of the most personal ways we express who we are. The Enock Chanimbe line is being created to make well made, distinctive pieces that people are proud to wear every day.",
      "Starting with a small first collection, the line will grow carefully, with attention to fit, fabric and finish, and with custom pieces for the teams and communities around us.",
    ],
    offers: ["Everyday wear: the first collection", "Limited edition pieces", "Custom and group orders"],
    audience: "Men and women who value quality and distinctive style, plus retailers and corporate clients.",
    available: ["Join the launch list", "Custom and group order enquiries"],
    cta: { label: "Join the launch list", to: "/service-center/interest?business=enock-chanimbe" },
    secondaryCta: { label: "Custom orders", to: "/contact?topic=enock-chanimbe" },
    steps: [
      { title: "Join the launch list", text: "Sign up to hear when the first collection drops." },
      { title: "Preview the collection", text: "See the first pieces before they go on sale." },
      { title: "Order your pieces", text: "Buy at launch, or place a custom or group order." },
    ],
    faqs: [
      { q: "When is the first collection?", a: "The Enock Chanimbe clothing line is in development. Join the launch list to hear first." },
      { q: "Do you take custom orders?", a: "Yes. We make custom and group orders for teams, events and organisations. Contact us to discuss yours." },
      { q: "What sizes will be available?", a: "Size guides will be published with the collection." },
      { q: "Where can I buy?", a: "Online here at launch. Retail partners will be announced." },
    ],
  },
  {
    slug: "foundation",
    name: "Chanimbe Africa Foundation",
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
    statement: "Every child deserves a classroom.",
    stats: [
      { value: "1 Cedi", label: "is all it takes to start giving" },
      { value: "20 years", label: "our goal to end schools under trees in Ghana" },
      { value: "1 school", label: "at a time, starting in the communities we know" },
    ],
    pillars: {
      heading: "Why a classroom changes everything",
      items: [
        { title: "Safety", text: "Walls and a roof protect children from sun, rain and distraction." },
        { title: "Learning", text: "Desks, boards and materials make real lessons possible." },
        { title: "Attendance", text: "A proper school keeps children, and teachers, coming back." },
        { title: "Community", text: "A school becomes the heart of the community around it." },
      ],
    },
    actions: {
      heading: "Ways to take action",
      items: [
        { title: "Give 1 Cedi or more", text: "Every donation, however small, goes towards a classroom.", cta: { label: "Donate", to: "/businesses/foundation#donate" } },
        { title: "Spread the word", text: "Share #1CediForSchoolsUnderTrees with friends, family and colleagues.", cta: { label: "Share the project", to: "/businesses/foundation#donate" } },
        { title: "Volunteer", text: "Give your time and skills on outreach days and school projects.", cta: { label: "Volunteer", to: "/contact?topic=foundation" } },
        { title: "Partner with us", text: "Companies, churches and community groups can fund or build a school.", cta: { label: "Partner", to: "/contact?topic=foundation" } },
      ],
    },
    story: [
      "Every business in the group depends on the communities around it. Chanimbe Africa Foundation LBG is the group's community arm, created to give back in ways that are practical and lasting.",
      "Education comes first. Our vision for the next 20 years is to end schools under trees in Ghana, and every Cedi given brings a proper classroom closer for children who need one.",
    ],
    steps: [
      { title: "Give 1 Cedi or more", text: "Send a donation by Mobile Money to Chanimbe Africa Foundation LBG." },
      { title: "Spread the word", text: "Share #1CediForSchoolsUnderTrees so more people can join in." },
      { title: "Volunteer or partner", text: "Give your time, skills or resources to help build and reform schools." },
    ],
    faqs: [
      { q: "How do I donate?", a: "Send any amount, starting from 1 Cedi, by Mobile Money to Chanimbe Africa Foundation LBG. The account details are in the donation section on this page." },
      { q: "What will my donation be used for?", a: "Donations go towards building and reforming schools in communities where children currently learn under trees." },
      { q: "Can organisations partner with the Foundation?", a: "Yes. Schools, companies, churches and community groups are welcome to partner with us. Get in touch through the contact page." },
      { q: "How can I volunteer?", a: "Use Get involved to send us your details and how you would like to help." },
    ],
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
    name: "Pedal with Enock",
    sector: "Cycling & Wellness",
    status: "proposed",
    summary: "A cycling community bringing people together for group rides, fitness and fun.",
    why: "Cycling keeps people healthy, connects neighbourhoods and is open to every fitness level.",
    statement: "One community. Every pace welcome.",
    checklist: {
      heading: "Why ride with us",
      items: [
        "Free monthly community rides",
        "Routes for beginners and regular riders",
        "Ride leaders to guide every group",
        "A safety briefing before every ride",
        "Charity and fun ride events",
        "Group rides for companies and clubs",
      ],
    },
    feature: {
      heading: "Where we ride",
      text: "Rides start across the Central Region of Ghana, with routes chosen for safety and scenery. The meeting point, distance and pace are shared before every ride.",
      image: "/images/businesses/bicycle-run.jpg",
      cta: { label: "Join the next ride", to: "/service-center/interest?business=bicycle-run" },
    },
    story: [
      "Cycling is one of the simplest ways to stay fit, meet people and see your surroundings differently. Pedal with Enock is being built to make it accessible to everyone, whatever their level.",
      "Through regular community rides, fun events and group sessions, we want to grow a friendly cycling community that keeps people moving and brings neighbourhoods together.",
    ],
    offers: [
      { title: "Monthly community rides", image: "/images/offerings/br-rides.jpg" },
      { title: "Charity and fun ride events", image: "/images/offerings/br-events.jpg" },
      "Beginner friendly routes",
      "Corporate and group rides",
    ],
    audience: "Cyclists of all levels, fitness groups, families and companies.",
    available: ["Sign up for the next community ride", "Enquire about group and corporate rides"],
    cta: { label: "Join the next ride", to: "/service-center/interest?business=bicycle-run" },
    secondaryCta: { label: "Group rides", to: "/contact?topic=bicycle-run" },
    image: "/images/businesses/bicycle-run.jpg",
    steps: [
      { title: "Sign up", text: "Register for the next community ride." },
      { title: "Get ride details", text: "We share the date, route and meeting point." },
      { title: "Ride with us", text: "Join the group and enjoy the ride at your own pace." },
    ],
    faqs: [
      { q: "Do I need my own bike?", a: "For now, yes. Bike hire options may be added later." },
      { q: "I am a beginner. Can I join?", a: "Yes. Community rides are paced for all levels." },
      { q: "How much does it cost?", a: "Community rides are free. Special events may have an entry fee." },
      { q: "Can my company book a group ride?", a: "Yes. Contact us about corporate and group rides." },
    ],
  },
];

// Photos added to src/media/<business-slug>/ replace the defaults above (see src/media/README.md).
for (const b of BUSINESSES) {
  b.image = media(b.slug, "cover") ?? b.image;
  b.offers = b.offers.map((o, i) => {
    const offer = toOffer(o);
    return { ...offer, image: media(b.slug, `offer-${i + 1}`) ?? offer.image };
  });
  if (b.feature) b.feature.image = media(b.slug, "feature") ?? b.feature.image;
  b.donation?.gallery?.forEach((item, i) => {
    item.image = media(b.slug, `project-${i + 1}`) ?? item.image;
  });
}

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
  // Product page extras (all optional):
  subtitle?: string; // Short line under the name, e.g. "Everyday skincare essentials"
  compareAtPrice?: number; // Previous price, shown struck through with a "Save" badge when higher than `price`
  rating?: { score: number; count: number }; // Only set from real customer reviews
  // Photos for the product page, main photo first; labels show under the thumbnails.
  gallery?: { src: string; label?: string }[];
  // Test-only price so the checkout can be tried end to end. Purchasable while "proposed" and
  // labelled "Sample price". Remove `sample` and set status "available" once the real price is set.
  sample?: boolean;
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
  { id: "uni-faculty", business: "university", kind: "programme", name: "Teach with us", description: "For educators and industry practitioners who would like to teach, mentor or collaborate with Chanimbe University.", category: "Education", price: null, status: "proposed", image: "/images/offerings/uni-faculty.jpg" },
  { id: "gf-products", business: "green-foods", kind: "product", name: "Green Foods product range", subtitle: "Nutritious everyday foods", description: "Fresh produce boxes and healthy pantry staples for everyday households. Register interest to hear when the range launches.", category: "Food", price: 25, status: "proposed", sample: true },
  { id: "gf-distribution", business: "green-foods", kind: "service", name: "Wholesale and distribution", description: "Bulk supply for shops, restaurants and offices, and partnerships with distributors who want to stock Green Foods.", category: "Food", price: null, status: "proposed", image: "/images/offerings/gf-distribution.jpg" },
  { id: "bb-haircut", business: "barbering-shop", kind: "service", name: "Haircut & styling", description: "Classic and modern cuts, fades and line ups at Degree Barber 1942. Request an appointment.", category: "Grooming", price: null, status: "proposed", image: "/images/offerings/bb-haircut.jpg" },
  { id: "bb-beard", business: "barbering-shop", kind: "service", name: "Beard trim & shave", description: "Beard shaping, trims and hot towel shaves at Degree Barber 1942.", category: "Grooming", price: null, status: "proposed", image: "/images/offerings/bb-beard.jpg" },
  { id: "bank-interest", business: "bank", kind: "service", name: "Future financial services", description: "Register interest only. No banking services are offered at this time.", category: "Finance", price: null, status: "proposed", image: "/images/offerings/bank-interest.jpg" },
  { id: "cos-skincare", business: "cosmetics", kind: "product", name: "Skincare collection", subtitle: "Everyday skincare essentials", description: "Cleanser, moisturiser and sunscreen made for everyday use and our climate, from Degree Cosmetics.", category: "Beauty", price: 85, status: "proposed", sample: true },
  { id: "cos-personal-care", business: "cosmetics", kind: "product", name: "Personal care range", subtitle: "Personal care essentials", description: "Body lotions and oils for soft, healthy skin, from Degree Cosmetics.", category: "Beauty", price: 40, status: "proposed", sample: true },
  { id: "fd-schools", business: "foundation", kind: "programme", name: "1 Cedi for Schools Under Trees", description: "Help end schools under trees in Ghana. Donate via Mobile Money to Chanimbe Africa Foundation LBG.", category: "Community", price: null, status: "proposed" },
  { id: "fd-volunteer", business: "foundation", kind: "programme", name: "Volunteer programme", description: "Give your time and skills to Chanimbe Africa Foundation's outreach and school projects.", category: "Community", price: null, status: "proposed" },
  { id: "fd-partner", business: "foundation", kind: "programme", name: "Community partnerships", description: "For schools, companies and community groups who want to partner with Chanimbe Africa Foundation on building and reforming schools.", category: "Community", price: null, status: "proposed" },
  { id: "br-rides", business: "bicycle-run", kind: "event", name: "Community rides", description: "Free monthly group rides with Pedal with Enock, paced for all levels. Register to hear about the next date.", category: "Wellness", price: null, status: "proposed", image: "/images/offerings/br-rides.jpg" },
  { id: "br-events", business: "bicycle-run", kind: "event", name: "Charity and fun rides", description: "Themed rides with Pedal with Enock that raise funds for community causes, with dates announced in advance.", category: "Wellness", price: null, status: "proposed", image: "/images/offerings/br-events.jpg" },
  { id: "ec-collection", business: "enock-chanimbe", kind: "product", name: "First collection", subtitle: "Everyday wear", description: "The first Enock Chanimbe clothing collection. Join the launch list to see it first.", category: "Fashion", price: null, status: "proposed" },
  { id: "ec-custom", business: "enock-chanimbe", kind: "service", name: "Custom and group orders", description: "Branded or custom pieces for teams, events, churches and organisations.", category: "Fashion", price: null, status: "proposed" },
];

// Product photos added as src/media/<business-slug>/<offering-id>.jpg replace the defaults above.
for (const o of CATALOG) o.image = media(o.business, o.id) ?? o.image;

// Mobile Money payment details shown at checkout. Replace with the confirmed account.
export const PAYMENT = {
  currency: "GHS",
  // Online payments (Mobile Money and card) through Paystack. Set VITE_PAYSTACK_PUBLIC_KEY
  // (pk_test_… or pk_live_…) in .env, or as a repository variable for the deployed site.
  // Without it, checkout offers manual Mobile Money only.
  paystackPublicKey: (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined) || undefined,
  // Manual Mobile Money transfer, offered alongside Paystack.
  momoNetwork: "MTN Mobile Money",
  momoNumber: "024 039 9035",
  momoAccountName: "Enock Chanimbe",
};

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: PAYMENT.currency }).format(amount);
