// Per-business page structure. Every business page uses the same visual style and the same section
// building blocks (components/business-sections.tsx); each business picks its own section order,
// section layouts and labels. Each order is modelled on how leading sites in that field arrange
// their pages (noted above each entry), so every page reads like a site of its kind.

export type SectionSpec =
  | { type: "why"; variant: "card" }
  | { type: "gallery"; variant: "trio" | "feature" | "wide" | "collage" }
  | { type: "offers"; variant: "cards" | "grid" | "list" | "pills" }
  | { type: "audience"; variant: "aside" | "banner" }
  | { type: "steps"; variant: "cards" | "timeline" | "numbers" }
  | { type: "faq"; variant: "accordion" | "grid" }
  | { type: "contact"; variant: "dark" | "split" | "strip" }
  | { type: "statement"; variant: "plain" | "image" }
  | { type: "pillars"; variant: "row" | "dark" }
  | { type: "feature"; variant: "left" | "right" }
  | { type: "stats" }
  | { type: "segments" }
  | { type: "checklist" }
  | { type: "note" }
  | { type: "notice" }
  | { type: "actions" }
  | { type: "catalog" }
  // Flagship content, shown only for businesses that have it
  | { type: "schools" }
  | { type: "synergy" }
  | { type: "donation" };

export type SectionType = SectionSpec["type"];

export type BusinessLayout = {
  sections: SectionSpec[];
  labels?: Partial<Record<SectionType, string>>;
};

export const BUSINESS_LAYOUTS: Record<string, BusinessLayout> = {
  // Like university sites (Ashesi, ALU): purpose, figures, programmes, the learning model, then
  // admissions with a clear fraud warning, the path to apply and questions.
  university: {
    sections: [
      { type: "statement", variant: "plain" },
      { type: "why", variant: "card" },
      { type: "stats" },
      { type: "schools" },
      { type: "synergy" },
      { type: "gallery", variant: "feature" },
      { type: "notice" },
      { type: "steps", variant: "timeline" },
      { type: "audience", variant: "banner" },
      { type: "faq", variant: "grid" },
      { type: "contact", variant: "split" },
    ],
    labels: { why: "Our purpose", stats: "At a glance", notice: "Admissions", steps: "How to join", audience: "Who it is for" },
  },
  // Like produce box sites (Oddbox): values up front, the boxes, how it works, who it is for,
  // then the growers behind the food.
  "green-foods": {
    sections: [
      { type: "why", variant: "card" },
      { type: "pillars", variant: "row" },
      { type: "offers", variant: "cards" },
      { type: "gallery", variant: "trio" },
      { type: "steps", variant: "cards" },
      { type: "segments" },
      { type: "feature", variant: "left" },
      { type: "faq", variant: "accordion" },
      { type: "contact", variant: "strip" },
    ],
    labels: { pillars: "Our values", offers: "What we supply", steps: "From farm to table", segments: "Who it is for", feature: "Our growers" },
  },
  // Like barbershop sites (Blind Barber): the look, the service menu, booking, a note in the
  // brand's voice, then where to find the shop.
  "barbering-shop": {
    sections: [
      { type: "why", variant: "card" },
      { type: "gallery", variant: "collage" },
      { type: "offers", variant: "cards" },
      { type: "steps", variant: "numbers" },
      { type: "note" },
      { type: "feature", variant: "right" },
      { type: "faq", variant: "accordion" },
      { type: "contact", variant: "dark" },
    ],
    labels: { why: "Our standard", offers: "The menu", steps: "Book in three steps", feature: "The shop" },
  },
  // Like digital bank sites (Kuda): trust first, then the three planned pillars. Because nothing is
  // authorized yet, the path to launch and what that means today come before anything else.
  bank: {
    sections: [
      { type: "why", variant: "card" },
      { type: "steps", variant: "timeline" },
      { type: "checklist" },
      { type: "pillars", variant: "dark" },
      { type: "gallery", variant: "wide" },
      { type: "faq", variant: "accordion" },
      { type: "audience", variant: "aside" },
      { type: "contact", variant: "split" },
    ],
    labels: { steps: "Our path to launch", checklist: "Where things stand", pillars: "The plan", audience: "Stay informed" },
  },
  // Like beauty brand sites (Glossier): a short brand line, the products first, then the
  // philosophy behind them.
  cosmetics: {
    sections: [
      { type: "statement", variant: "plain" },
      { type: "catalog" },
      { type: "gallery", variant: "feature" },
      { type: "why", variant: "card" },
      { type: "offers", variant: "pills" },
      { type: "steps", variant: "cards" },
      { type: "audience", variant: "banner" },
      { type: "faq", variant: "grid" },
      { type: "contact", variant: "strip" },
    ],
    labels: { catalog: "The range", why: "Our philosophy", offers: "Coming to the range", steps: "Launch list" },
  },
  // Like fashion label sites (Christie Brown): the categories and pieces first, then the story
  // behind the name.
  "enock-chanimbe": {
    sections: [
      { type: "offers", variant: "grid" },
      { type: "gallery", variant: "trio" },
      { type: "catalog" },
      { type: "why", variant: "card" },
      { type: "note" },
      { type: "audience", variant: "banner" },
      { type: "steps", variant: "numbers" },
      { type: "faq", variant: "grid" },
      { type: "contact", variant: "dark" },
    ],
    labels: { offers: "The line", catalog: "Shop the line", why: "The idea", audience: "Custom orders", steps: "Get the first drop" },
  },
  // Like education charities (Pencils of Promise, charity: water): the mission in one line, the
  // numbers, the story, giving, why it matters and ways to take action.
  foundation: {
    sections: [
      { type: "statement", variant: "plain" },
      { type: "stats" },
      { type: "why", variant: "card" },
      { type: "donation" },
      { type: "pillars", variant: "row" },
      { type: "actions" },
      { type: "faq", variant: "accordion" },
      { type: "contact", variant: "dark" },
    ],
    labels: { why: "Our mission", stats: "The goal", pillars: "Why it matters", actions: "Take action" },
  },
  // Like cycling club sites (Rapha Cycling Club): a punchy line, member benefits, the ride
  // programmes, how to join and where the club rides.
  "bicycle-run": {
    sections: [
      { type: "statement", variant: "plain" },
      { type: "checklist" },
      { type: "offers", variant: "cards" },
      { type: "gallery", variant: "trio" },
      { type: "steps", variant: "numbers" },
      { type: "why", variant: "card" },
      { type: "feature", variant: "left" },
      { type: "faq", variant: "grid" },
      { type: "contact", variant: "strip" },
    ],
    labels: { checklist: "Membership", offers: "Rides and events", steps: "How to join", feature: "Routes" },
  },
};

// Used for any business without its own entry.
export const DEFAULT_LAYOUT: BusinessLayout = {
  sections: [
    { type: "why", variant: "card" },
    { type: "gallery", variant: "trio" },
    { type: "offers", variant: "cards" },
    { type: "audience", variant: "aside" },
    { type: "steps", variant: "cards" },
    { type: "faq", variant: "accordion" },
    { type: "contact", variant: "dark" },
  ],
};
