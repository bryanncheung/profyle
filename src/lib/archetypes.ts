import { Archetype, Prefix } from "./types";

export interface ArchetypeTheme {
  accent: string;
  bgTint: string;
  pillBg: string;
  pillBorder: string;
}

export const ARCHETYPE_THEMES: Record<Archetype, ArchetypeTheme> = {
  Builder:   { accent: "#E8650A", bgTint: "#FDF6EE", pillBg: "#F5EAD8", pillBorder: "#EAD4B0" },
  Disruptor: { accent: "#E82B2B", bgTint: "#FEF4F4", pillBg: "#FCDEDE", pillBorder: "#F5BABA" },
  Anchor:    { accent: "#0F8A8A", bgTint: "#F0FAF9", pillBg: "#D8F2F0", pillBorder: "#B0E4E0" },
  Catalyst:  { accent: "#C4A800", bgTint: "#FDFBEE", pillBg: "#F5F0C8", pillBorder: "#EAE090" },
  Sovereign: { accent: "#7B4FE0", bgTint: "#F5F2FF", pillBg: "#EAE0FF", pillBorder: "#D0BBFF" },
};

export const ADJECTIVE_PILL_COLORS = [
  { bg: "#E8F7EF", text: "#2A7A4E" },
  { bg: "#EDE9FF", text: "#5B3FD6" },
  { bg: "#FFF4E8", text: "#B86A1A" },
] as const;

export const ATTRIBUTE_LABELS: Record<string, string> = {
  execution: "Execution",
  vision: "Vision",
  independence: "Independence",
  collaboration: "Collaboration",
  adaptability: "Adaptability",
};

// Industry recommendations by archetype + Q18 answer
const INDUSTRY_MAP: Record<Archetype, Record<string, { industries: string[]; companies: string[] }>> = {
  Builder: {
    A: { industries: ["Early-stage startups", "Product engineering"], companies: ["Stripe", "Linear", "Vercel", "Figma", "Notion"] },
    B: { industries: ["Scaleups", "Established tech"], companies: ["Apple", "Shopify", "Atlassian", "Canva", "HubSpot"] },
    C: { industries: ["Mission-driven tech", "Social impact"], companies: ["Khan Academy", "Duolingo", "Patagonia", "Headspace"] },
    D: { industries: ["Fintech", "DeepTech", "Consulting"], companies: ["Jane Street", "Two Sigma", "McKinsey", "Palantir"] },
  },
  Disruptor: {
    A: { industries: ["Venture-backed startups", "Frontier tech"], companies: ["OpenAI", "Anduril", "Ramp", "Brex", "Perplexity"] },
    B: { industries: ["Established companies ripe for change", "Strategy"], companies: ["BCG", "IDEO", "Amazon", "Netflix"] },
    C: { industries: ["Advocacy", "Policy", "Nonprofit leadership"], companies: ["Charity: Water", "GiveDirectly", "Acumen"] },
    D: { industries: ["Research", "Quant finance", "Academia"], companies: ["DeepMind", "Citadel", "Renaissance Technologies"] },
  },
  Anchor: {
    A: { industries: ["High-growth teams", "Operations"], companies: ["Airbnb", "Uber", "DoorDash", "Instacart"] },
    B: { industries: ["Enterprise", "Institutional teams"], companies: ["Microsoft", "Salesforce", "JPMorgan", "Goldman Sachs"] },
    C: { industries: ["Education", "Healthcare", "Civic sector"], companies: ["IDEO.org", "Teach For America", "Kaiser Permanente"] },
    D: { industries: ["Finance", "Law", "Professional services"], companies: ["McKinsey", "Deloitte", "PwC", "Latham & Watkins"] },
  },
  Catalyst: {
    A: { industries: ["Startup GTM", "Community-led growth"], companies: ["Loom", "Coda", "Miro", "Slack", "Discord"] },
    B: { industries: ["Brand", "Culture", "Exec leadership"], companies: ["Patagonia", "Nike", "Spotify", "LinkedIn"] },
    C: { industries: ["People ops", "Education", "Wellbeing"], companies: ["BetterUp", "Noom", "Coursera", "IDEO"] },
    D: { industries: ["Climate", "Global health", "Scale impact"], companies: ["Gavi", "Carbon180", "Impossible Foods"] },
  },
  Sovereign: {
    A: { industries: ["Founder track", "General management"], companies: ["Y Combinator", "a16z portfolio", "Benchmark portfolio"] },
    B: { industries: ["Strategy", "COO/CPO roles", "GP/MD track"], companies: ["McKinsey", "Sequoia", "Bessemer", "Bain"] },
    C: { industries: ["CEO of mission-driven org", "Foundation leadership"], companies: ["Gates Foundation", "Omidyar Network"] },
    D: { industries: ["Finance leadership", "Policy", "Research"], companies: ["IMF", "Federal Reserve", "Bridgewater", "OpenAI"] },
  },
};

export function getIndustryRecommendations(
  archetype: Archetype,
  q18Answer: string
): { industries: string[]; companies: string[] } {
  const key = q18Answer in INDUSTRY_MAP[archetype] ? q18Answer : "A";
  return INDUSTRY_MAP[archetype][key];
}

export const DIMENSION_DESCRIPTIONS: Record<Prefix, string> = {
  Relentless: "You don't stop. Where others slow down, you accelerate. Your output is relentless — not because you're working harder, but because you simply don't know how to half-commit.",
  Quiet: "You don't need the room to know you're in it. Your power is understated and that's by design. The best work you do, nobody sees coming.",
  Bold: "You walk into rooms like you own them — not out of arrogance, but out of conviction. You set the pace, frame the narrative, and make other people feel like they're capable of more.",
  Grounded: "Nothing rattles you. While everyone else is reacting, you're observing. Your steadiness isn't passive — it's the most active thing in the room.",
};

export const ARCHETYPE_POPULATION: Record<Archetype, number> = {
  Builder: 24,
  Anchor: 22,
  Catalyst: 21,
  Sovereign: 18,
  Disruptor: 15,
};

export const DIMENSION_POPULATION: Record<Prefix, number> = {
  Bold: 31,
  Grounded: 27,
  Quiet: 25,
  Relentless: 17,
};
