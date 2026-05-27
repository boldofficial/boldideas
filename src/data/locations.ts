export interface LocationCity {
  slug: string;
  name: string;
  state: string;
  stateAbbr: string;
  label: string;           // "Rockford, IL"
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  localContext: string[];  // Unique local points
  industries: string[];    // Prominent local industries
  nearbyAreas: string[];
  testimonials?: { quote: string; author: string; role: string }[];
}

export const locations: LocationCity[] = [
  {
    slug: "rockford-il",
    name: "Rockford",
    state: "Illinois",
    stateAbbr: "IL",
    label: "Rockford, IL",
    metaTitle: "Web Design & Automation Agency | Rockford, IL | Bold Ideas",
    metaDescription:
      "Bold Ideas helps Rockford-area small businesses build better websites, automate lead follow-up, and connect their tools. Local agency, practical systems.",
    heroTitle: "A digital agency built for Rockford businesses",
    heroSubtitle:
      "Better websites. Connected tools. Follow-up that actually happens. Small-business technology designed for how Rockford works.",
    description:
      "Rockford businesses serve a community that values reliability, quality, and relationships. Your website and follow-up systems should reflect that same standard. We build professional websites, intake flows, and CRM-connected automations for home services, manufacturers, healthcare providers, and professional firms across the Rockford region — from downtown to Loves Park, Machesney Park, and Belvidere.",
    localContext: [
      "Located in the Rockford region — serving businesses in Winnebago, Boone, and Ogle counties",
      "Deep understanding of Rockford's manufacturing, healthcare, and service-industry roots",
      "Experience with businesses that serve both the Rockford metro and surrounding rural communities",
      "We build for the way Rockford buyers decide — on trust, reputation, and local credibility",
      "Familiar with the local business landscape — from East State Street corridors to downtown independents",
    ],
    industries: [
      "Home services (HVAC, plumbing, electrical, landscaping)",
      "Medical and dental practices",
      "Manufacturing and industrial suppliers",
      "Professional services (legal, accounting, consulting)",
      "Retail and local service businesses",
    ],
    nearbyAreas: [
      "Loves Park, IL",
      "Machesney Park, IL",
      "Belvidere, IL",
      "Cherry Valley, IL",
      "Roscoe, IL",
      "South Beloit, IL",
      "Byron, IL",
      "Winnebago, IL",
    ],
  },
  {
    slug: "madison-wi",
    name: "Madison",
    state: "Wisconsin",
    stateAbbr: "WI",
    label: "Madison, WI",
    metaTitle: "Web Design & Automation Agency | Madison, WI | Bold Ideas",
    metaDescription:
      "Bold Ideas helps Madison-area small businesses build better websites, automate intake, and connect CRM workflows. Practical systems for Wisconsin businesses.",
    heroTitle: "Smart websites and systems for Madison businesses",
    heroSubtitle:
      "Professional websites, automated intake, and CRM connections built for the way Madison does business.",
    description:
      "Madison is a city of innovators — from the University and biotech to local service businesses that set a high bar. Your digital presence needs to match that standard. We build websites and connected systems for Madison small businesses that need clearer trust signals, better lead capture, and follow-up automation that keeps every inquiry moving. Whether you are a downtown restaurant group, a West Side medical practice, or a Middleton professional firm, we design systems that reflect your quality.",
    localContext: [
      "Based in the Wisconsin market — serving businesses across Dane County",
      "Understanding of Madison's unique mix of university, government, healthcare, and small business",
      "Experience with businesses that serve both urban Madison and surrounding communities like Middleton and Sun Prairie",
      "We build for the informed, discerning Madison buyer who expects clarity and professionalism online",
      "Familiar with the local business environment — from the Capitol Square to the suburban growth corridors",
    ],
    industries: [
      "Medical and dental practices",
      "Professional services (legal, consulting, financial)",
      "Food and hospitality businesses",
      "Health and wellness providers",
      "Home services and local trades",
    ],
    nearbyAreas: [
      "Middleton, WI",
      "Sun Prairie, WI",
      "Fitchburg, WI",
      "Verona, WI",
      "Waunakee, WI",
      "Monona, WI",
      "McFarland, WI",
      "Oregon, WI",
    ],
  },
  {
    slug: "janesville-wi",
    name: "Janesville",
    state: "Wisconsin",
    stateAbbr: "WI",
    label: "Janesville, WI",
    metaTitle: "Web Design & Automation Agency | Janesville, WI | Bold Ideas",
    metaDescription:
      "Bold Ideas helps Janesville-area small businesses with professional websites, lead intake automation, and CRM-connected workflows. Local expertise.",
    heroTitle: "Professional websites and systems for Janesville businesses",
    heroSubtitle:
      "Websites, intake flows, and follow-up automation that help Janesville-area businesses look established and respond faster.",
    description:
      "Janesville and the surrounding Rock County area are home to businesses that value practical results and straight talk. We build professional websites and connected systems for small businesses in Janesville, Beloit, and the wider stateline region. From home service providers and healthcare practices to local retailers and professional firms, we design digital systems that help local businesses capture more qualified leads and follow up without dropping the ball.",
    localContext: [
      "Serving businesses in Rock County and the stateline region",
      "Understanding of Janesville's business community — grounded, practical, and relationship-driven",
      "Experience with businesses that serve both Janesville metro and surrounding rural communities",
      "We build for buyers who make decisions based on trust, local reputation, and clear communication",
      "Familiar with the cross-state dynamics of businesses serving both Wisconsin and Illinois customers",
    ],
    industries: [
      "Home services (HVAC, plumbing, construction)",
      "Healthcare and dental practices",
      "Manufacturing and industrial services",
      "Professional services (legal, accounting, real estate)",
      "Retail and local service businesses",
    ],
    nearbyAreas: [
      "Beloit, WI",
      "Beloit, IL — Stateline area",
      "Edgerton, WI",
      "Milton, WI",
      "Evansville, WI",
      "Orfordville, WI",
      "Clinton, WI",
      "South Beloit, IL",
    ],
  },
];

export function getLocationsList() {
  return locations.map(({ slug, name, state, label, metaDescription }) => ({
    slug,
    name,
    state,
    label,
    metaDescription,
  }));
}

export function getLocationBySlug(slug: string) {
  return locations.find((l) => l.slug === slug) || null;
}
