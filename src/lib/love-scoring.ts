import { LoveArchetype, LoveDimension, LoveAnswer, LoveAttributes, LoveResult } from "./love-types";

// ─── Population distributions ────────────────────────────────────────────────

export const LOVE_ARCHETYPE_POPULATION: Record<LoveArchetype, number> = {
  Flame: 14,
  Harbour: 13,
  Wanderer: 12,
  Architect: 10,
  Devotee: 14,
  Mirror: 11,
  Spark: 13,
  Anchor: 13,
};

export const LOVE_DIMENSION_POPULATION: Record<LoveDimension, number> = {
  Devoted: 28,
  Guarded: 22,
  Fierce: 25,
  Gentle: 25,
};

// ─── Compatible-with copy ─────────────────────────────────────────────────────

const COMPAT_COPY: Partial<Record<string, string>> = {
  "Flame+Anchor": "The Anchor is the only type that can hold a Flame without trying to put it out. You bring the heat, they bring the ground. Together you create something that's both passionate and lasting — which is rarer than either of you knows.",
  "Anchor+Flame": "The Flame needs what you naturally are. Their intensity has somewhere safe to go. Your steadiness has something warm to hold. Neither of you has to try — it just fits.",
  "Flame+Architect": "The Architect's slow burn unlocks something in a Flame that no one else does. You make them feel safe enough to open. They make you feel deeply enough to stay. The tension between your intensity and their deliberateness is the whole point.",
  "Architect+Flame": "The Flame's warmth is the only thing that melts an Architect's walls without force. You don't have to perform openness — they make you want it. Slow burn, permanent result.",
  "Harbour+Wanderer": "The Wanderer needs exactly what a Harbour naturally is — somewhere safe to return to without feeling trapped. You don't need them to stay. They don't need you to follow. It works because neither of you asks the other to be different.",
  "Wanderer+Harbour": "The Harbour holds space without demanding presence. That's the only dynamic where a Wanderer truly relaxes. You get to be exactly who you are — and they'll be there when you come back.",
  "Harbour+Flame": "Your calm is the perfect counterweight to their heat. They bring the electricity, you keep the lights on. Most people can't handle a Flame — you're one of the few who can, and they feel it.",
  "Wanderer+Spark": "Two independent spirits who understand the need for freedom. Neither of you will cage the other. The risk is that you both wander in different directions — but when you're together, nothing feels more alive.",
  "Spark+Wanderer": "Two independent spirits who understand the need for freedom. Neither of you will cage the other. The risk is that you both wander in different directions — but when you're together, nothing feels more alive.",
  "Architect+Devotee": "The Devotee's patience and giving nature meets the Architect's need for time and consistency. They never make you feel rushed. You never make them feel unappreciated. Rare alignment.",
  "Devotee+Architect": "Your consistency meets their loyalty. Neither of you loves lightly. The relationship is slow to build and impossible to shake once it's real.",
  "Devotee+Mirror": "The Mirror is the only type that truly sees a Devotee — not just what you give, but who you are underneath the giving. Being understood rather than just needed changes everything for you.",
  "Mirror+Devotee": "The Devotee's giving finally meets someone who receives it fully. You see them — not just their gestures but the need underneath them. That recognition is what they've always been looking for.",
  "Mirror+Spark": "The Spark's energy pulls a Mirror out of their head and into the moment. You give them depth, they give you aliveness. The combination is electric and surprisingly sustainable.",
  "Spark+Mirror": "The Mirror sees through the Spark's performance to what's actually underneath. Being truly seen — not just admired — is what a Spark needs most and finds hardest to find.",
  "Spark+Anchor": "The Anchor gives the Spark somewhere meaningful to land. You don't dim them — you give their energy direction. They make every ordinary moment feel like something. You make every extraordinary moment last.",
  "Anchor+Wanderer": "You don't need them to stay and they don't need you to follow. The Wanderer always comes back to the Anchor — not out of obligation but because you're the only place that feels like home.",
};

function getCompatCopy(archetype: LoveArchetype, compat: LoveArchetype): string {
  return (
    COMPAT_COPY[`${archetype}+${compat}`] ??
    COMPAT_COPY[`${compat}+${archetype}`] ??
    `${archetype} and ${compat} bring out something rare in each other.`
  );
}

// ─── Base copy per archetype ──────────────────────────────────────────────────

interface ArchetypeBase {
  tagline: string;
  whoYouAre: string;
  howYouLove: string;
  compatibleWith: [LoveArchetype, LoveArchetype];
  famousPeople: Array<{ name: string; reason: string }>;
}

const ARCHETYPE_BASE: Record<LoveArchetype, ArchetypeBase> = {
  Flame: {
    tagline: "You love like it's the only thing worth doing.",
    whoYouAre: "You don't do half measures. When you love someone you love them completely — they feel it in everything you do, every message, every moment of attention. People who have been loved by you describe it as one of the most intense experiences of their life. You make ordinary moments feel significant and you genuinely can't imagine doing it any other way.",
    howYouLove: "You initiate, you express, you show up. You're the one who says it first, who reaches out first, who makes the plans. You love out loud and you need someone who can receive that without flinching.",
    compatibleWith: ["Anchor", "Architect"],
    famousPeople: [
      { name: "Frida Kahlo", reason: "Loved with her whole body and soul, made art from heartbreak, never did anything halfway." },
      { name: "Noah (The Notebook)", reason: "Built her a house and waited years. The definition of all-in." },
      { name: "John Legend", reason: "Writes love songs that make people feel seen, openly devoted and expressive." },
    ],
  },
  Harbour: {
    tagline: "You don't say much. But people always come back.",
    whoYouAre: "You love through presence and consistency. You're not the one making grand gestures or writing long messages — you're the one who shows up, remembers the small things, and makes people feel like they have somewhere safe to land. People don't always realise how much you love them until they're without you.",
    howYouLove: "You hold things together quietly. You check in without making a scene, you plan without announcing it, you care without needing credit. Your love language is reliability and most people don't speak it fluently enough to appreciate you.",
    compatibleWith: ["Wanderer", "Flame"],
    famousPeople: [
      { name: "Michelle Obama", reason: "Speaks about love as partnership and consistency, steady and grounding in everything." },
      { name: "Keanu Reeves", reason: "Quietly devoted, known for deep loyalty and showing up without needing attention." },
      { name: "Jim Halpert (The Office)", reason: "Waited patiently, loved steadily, never made it dramatic. Just showed up." },
    ],
  },
  Wanderer: {
    tagline: "You love deeply. You just need to be able to leave.",
    whoYouAre: "You feel things intensely and express them freely — but you also need to be able to breathe. You're not afraid of love, you're afraid of losing yourself in it. The push and pull inside you isn't confusion, it's just the way you're wired. You love best when you feel free to choose it every day rather than feeling trapped by it.",
    howYouLove: "You bring energy and spontaneity. Love with you never feels stale — you're always initiating something new, suggesting something unexpected, making the relationship feel alive. Your partner's life genuinely becomes richer with you in it.",
    compatibleWith: ["Harbour", "Spark"],
    famousPeople: [
      { name: "Rihanna", reason: "Fiercely independent, loves on her own terms, never loses herself in anyone." },
      { name: "Jack Kerouac", reason: "Defined by the tension between love and the open road." },
      { name: "Carrie Bradshaw", reason: "Loves deeply but needs freedom, constantly negotiating between connection and independence." },
    ],
  },
  Architect: {
    tagline: "You don't fall easily. But when you do, it's permanent.",
    whoYouAre: "You are deliberate about everything including love. You don't rush, you don't perform, and you don't say things you don't mean. Getting past your walls takes time — but what's on the other side of them is a loyalty so complete it's rare. People who earn your love often describe it as the most real thing they've ever experienced.",
    howYouLove: "Quietly and completely. You show love through actions that are so consistent they become the architecture of someone's life. You don't need to announce how you feel — the evidence is in everything you do.",
    compatibleWith: ["Flame", "Devotee"],
    famousPeople: [
      { name: "Barack Obama", reason: "Deliberate and measured, but once committed, completely loyal." },
      { name: "Jane Austen", reason: "Believed in love but only the kind that was earned, never rushed." },
      { name: "Mr Darcy", reason: "Slow to open, impossible to read at first, but when he loves it's permanent." },
    ],
  },
  Devotee: {
    tagline: "You love by showing up. Every single time.",
    whoYouAre: "You are the person who remembers everything, does everything, gives everything. Love for you is a practice not just a feeling — and you practice it daily. You don't need grand romance, you need to feel needed and you need to feel like what you give actually lands. When it does, you are the most loyal person someone will ever have.",
    howYouLove: "Through service, attention, and presence. You anticipate what people need before they ask. You remember what matters to them. You make people feel like the most important person in the room because when you love someone, they are.",
    compatibleWith: ["Mirror", "Architect"],
    famousPeople: [
      { name: "Pablo Neruda", reason: "Wrote poetry that made love feel like the only thing worth living for." },
      { name: "Rose (Titanic)", reason: "Carried him for 84 years. Never let go in any sense that mattered." },
      { name: "Lady Gaga", reason: "Pours everything into every relationship, love is service and sacrifice." },
    ],
  },
  Mirror: {
    tagline: "You see people more clearly than they see themselves. And they feel it.",
    whoYouAre: "There's something magnetic about you that you don't fully understand. You don't chase, you don't perform, you don't need to — people are drawn to you because being around you makes them feel understood in a way they rarely do. You love through deep attention and perception. You notice everything.",
    howYouLove: "By truly seeing someone. You remember the things they mentioned once. You understand their patterns better than they do. Your love is a kind of clarity — being with you makes people feel more like themselves.",
    compatibleWith: ["Devotee", "Spark"],
    famousPeople: [
      { name: "Taylor Swift", reason: "Sees people with uncanny clarity, writes about love in a way that makes others feel completely understood." },
      { name: "Atticus Finch", reason: "Understood people at their core, loved through deep seeing." },
      { name: "Audrey Hepburn", reason: "Made everyone she loved feel completely seen and understood." },
    ],
  },
  Spark: {
    tagline: "You make people feel alive. That's not nothing. That's everything.",
    whoYouAre: "You have an energy that's genuinely hard to describe but impossible to ignore. Love with you feels electric — there's always something happening, something building, something to look forward to. You're not afraid to feel things and you're not afraid to show it. People who have loved you carry it with them long after.",
    howYouLove: "With everything you have, right now. You're present in a way that makes people feel like the most important person alive when they're with you. You love in moments of intensity that people remember forever.",
    compatibleWith: ["Anchor", "Mirror"],
    famousPeople: [
      { name: "Marilyn Monroe", reason: "Electric presence, made everyone feel like the most important person alive." },
      { name: "Harry Styles", reason: "Radiates warmth and aliveness, love with him looks like joy." },
      { name: "Patrick Verona (10 Things)", reason: "Shows up with grand gestures and pure electric energy, impossible to ignore." },
    ],
  },
  Anchor: {
    tagline: "People don't always know why they feel safe with you. They just do.",
    whoYouAre: "You are the person everyone wants to be loved by. Not because you're perfect but because being with you feels like exhaling. You don't need to fill silence, you don't need to perform love — you just are it. Consistently, completely, without asking for recognition. The people who have been loved by you know they were lucky even if it took them time to realise it.",
    howYouLove: "By being completely reliable in a world that isn't. You're the person they call when things fall apart. You're the constant. Your love doesn't spike and crash — it just holds, steadily, for as long as it needs to.",
    compatibleWith: ["Flame", "Wanderer"],
    famousPeople: [
      { name: "Dolly Parton", reason: "Has loved the same person quietly and completely for decades, never wavers." },
      { name: "Mufasa (The Lion King)", reason: "Loved so steadily that it outlasted death itself." },
      { name: "Steve Rogers", reason: "Waited 70 years, stayed loyal to one person across time itself." },
    ],
  },
};

// ─── 32 Combination adjectives + blind spots ─────────────────────────────────

interface ComboData {
  adjectives: [string, string, string];
  blindSpot: string;
  attributes: LoveAttributes;
}

const COMBOS: Record<string, ComboData> = {
  "Devoted Flame":   { adjectives: ["Consuming", "Passionate", "Wholehearted"], blindSpot: "Loves so completely that when it's not reciprocated equally, the crash is devastating.", attributes: { intimacy: 5, expressiveness: 5, independence: 2, devotion: 5, openness: 5 } },
  "Guarded Flame":   { adjectives: ["Intense", "Selective", "Magnetic"],         blindSpot: "Burns intensely but pulls back before anyone can get too close — leaving people confused.", attributes: { intimacy: 5, expressiveness: 4, independence: 3, devotion: 4, openness: 4 } },
  "Fierce Flame":    { adjectives: ["Electric", "Fearless", "Overwhelming"],      blindSpot: "The intensity that makes love electric also makes conflict explosive.", attributes: { intimacy: 5, expressiveness: 5, independence: 2, devotion: 5, openness: 5 } },
  "Gentle Flame":    { adjectives: ["Warm", "Tender", "Radiant"],                 blindSpot: "So warm and giving that people sometimes mistake softness for weakness.", attributes: { intimacy: 5, expressiveness: 5, independence: 2, devotion: 5, openness: 5 } },

  "Devoted Harbour": { adjectives: ["Selfless", "Constant", "Nurturing"],         blindSpot: "Gives so consistently that people forget to ask if you need anything back.", attributes: { intimacy: 5, expressiveness: 2, independence: 3, devotion: 5, openness: 4 } },
  "Guarded Harbour": { adjectives: ["Reliable", "Private", "Measured"],           blindSpot: "So self-contained that the people you love most never fully know how much you care.", attributes: { intimacy: 4, expressiveness: 2, independence: 4, devotion: 5, openness: 2 } },
  "Fierce Harbour":  { adjectives: ["Protective", "Unwavering", "Strong"],        blindSpot: "The protectiveness can tip into control without realising it.", attributes: { intimacy: 5, expressiveness: 3, independence: 3, devotion: 5, openness: 3 } },
  "Gentle Harbour":  { adjectives: ["Soft", "Patient", "Safe"],                   blindSpot: "So accommodating that your own needs get quietly buried under everyone else's.", attributes: { intimacy: 4, expressiveness: 2, independence: 3, devotion: 5, openness: 4 } },

  "Devoted Wanderer":{ adjectives: ["Adventurous", "Deep", "Conflicted"],         blindSpot: "Loves deeply but the need for freedom creates distance that partners misread as indifference.", attributes: { intimacy: 4, expressiveness: 4, independence: 5, devotion: 4, openness: 5 } },
  "Guarded Wanderer":{ adjectives: ["Free", "Cautious", "Alluring"],              blindSpot: "The combination of independence and walls means people rarely get close enough to stay.", attributes: { intimacy: 3, expressiveness: 4, independence: 5, devotion: 3, openness: 3 } },
  "Fierce Wanderer": { adjectives: ["Wild", "Honest", "Alive"],                   blindSpot: "The intensity pulls people in fast, the need for space pushes them away just as quickly.", attributes: { intimacy: 4, expressiveness: 5, independence: 5, devotion: 3, openness: 4 } },
  "Gentle Wanderer": { adjectives: ["Curious", "Warm", "Restless"],               blindSpot: "So easy to be with that people don't realise you've already half-left until you're gone.", attributes: { intimacy: 3, expressiveness: 4, independence: 5, devotion: 4, openness: 5 } },

  "Devoted Architect":{ adjectives: ["Loyal", "Deliberate", "Steadfast"],         blindSpot: "By the time you fully open up, some people have already given up waiting.", attributes: { intimacy: 4, expressiveness: 2, independence: 5, devotion: 5, openness: 3 } },
  "Guarded Architect":{ adjectives: ["Careful", "Complex", "Rare"],               blindSpot: "The walls are so well-built that even the people who deserve entry can't find the door.", attributes: { intimacy: 3, expressiveness: 2, independence: 5, devotion: 4, openness: 1 } },
  "Fierce Architect": { adjectives: ["Exacting", "Intense", "Unbreakable"],       blindSpot: "The high standards you hold for love can make people feel like they're always being evaluated.", attributes: { intimacy: 4, expressiveness: 3, independence: 5, devotion: 4, openness: 2 } },
  "Gentle Architect": { adjectives: ["Thoughtful", "Slow", "Certain"],            blindSpot: "The slowness to commit can look like disinterest to people who need more reassurance.", attributes: { intimacy: 3, expressiveness: 2, independence: 5, devotion: 5, openness: 3 } },

  "Devoted Devotee": { adjectives: ["Selfless", "Giving", "Complete"],            blindSpot: "Gives everything so freely that you sometimes lose track of who you are outside the relationship.", attributes: { intimacy: 5, expressiveness: 4, independence: 2, devotion: 5, openness: 5 } },
  "Guarded Devotee": { adjectives: ["Selective", "Deep", "Careful"],              blindSpot: "Wants to give completely but the fear of being too much holds the giving back.", attributes: { intimacy: 4, expressiveness: 4, independence: 3, devotion: 5, openness: 3 } },
  "Fierce Devotee":  { adjectives: ["Intense", "Committed", "Consuming"],         blindSpot: "The commitment is total, which means disappointment when it isn't matched hits extraordinarily hard.", attributes: { intimacy: 5, expressiveness: 5, independence: 2, devotion: 5, openness: 4 } },
  "Gentle Devotee":  { adjectives: ["Tender", "Present", "Generous"],             blindSpot: "So focused on the other person's comfort that your own needs become invisible even to yourself.", attributes: { intimacy: 4, expressiveness: 4, independence: 2, devotion: 5, openness: 5 } },

  "Devoted Mirror":  { adjectives: ["Perceptive", "Loyal", "Absorbing"],          blindSpot: "Understands everyone deeply but rarely lets anyone understand you back.", attributes: { intimacy: 5, expressiveness: 2, independence: 4, devotion: 4, openness: 4 } },
  "Guarded Mirror":  { adjectives: ["Enigmatic", "Deep", "Magnetic"],             blindSpot: "The mystery that draws people in can become a wall that keeps them out permanently.", attributes: { intimacy: 4, expressiveness: 2, independence: 5, devotion: 3, openness: 2 } },
  "Fierce Mirror":   { adjectives: ["Sharp", "Intense", "Unforgettable"],          blindSpot: "The clarity with which you see people can feel invasive to those who aren't ready to be seen.", attributes: { intimacy: 5, expressiveness: 3, independence: 4, devotion: 3, openness: 3 } },
  "Gentle Mirror":   { adjectives: ["Intuitive", "Soft", "Understanding"],         blindSpot: "So attuned to others that you absorb their emotions and lose track of your own.", attributes: { intimacy: 4, expressiveness: 2, independence: 4, devotion: 4, openness: 4 } },

  "Devoted Spark":   { adjectives: ["Electric", "Present", "Alive"],              blindSpot: "The energy that makes love feel electric is hard to sustain — and the lows feel lower because of it.", attributes: { intimacy: 4, expressiveness: 5, independence: 4, devotion: 4, openness: 5 } },
  "Guarded Spark":   { adjectives: ["Magnetic", "Mysterious", "Unpredictable"],   blindSpot: "Lights up every room but keeps the lights off at home where it counts.", attributes: { intimacy: 3, expressiveness: 5, independence: 5, devotion: 3, openness: 4 } },
  "Fierce Spark":    { adjectives: ["Explosive", "Bold", "Irresistible"],          blindSpot: "Loves in bursts of intensity that can overwhelm people who need steadiness.", attributes: { intimacy: 4, expressiveness: 5, independence: 4, devotion: 3, openness: 5 } },
  "Gentle Spark":    { adjectives: ["Playful", "Warm", "Infectious"],              blindSpot: "So focused on keeping things light and joyful that the harder conversations never happen.", attributes: { intimacy: 3, expressiveness: 5, independence: 4, devotion: 4, openness: 5 } },

  "Devoted Anchor":  { adjectives: ["Unshakeable", "Complete", "Constant"],       blindSpot: "So focused on being reliable for others that you rarely ask for the same reliability back.", attributes: { intimacy: 5, expressiveness: 2, independence: 2, devotion: 5, openness: 4 } },
  "Guarded Anchor":  { adjectives: ["Steady", "Private", "Dependable"],           blindSpot: "The steadiness looks like strength but sometimes it's just distance wearing a calmer face.", attributes: { intimacy: 5, expressiveness: 2, independence: 3, devotion: 5, openness: 2 } },
  "Fierce Anchor":   { adjectives: ["Strong", "Protective", "Immovable"],         blindSpot: "The protectiveness is total — but it can tip into making decisions for people instead of with them.", attributes: { intimacy: 5, expressiveness: 3, independence: 2, devotion: 5, openness: 3 } },
  "Gentle Anchor":   { adjectives: ["Calm", "Safe", "Eternal"],                   blindSpot: "So patient and accommodating that people don't always realise they've been taking you for granted.", attributes: { intimacy: 5, expressiveness: 2, independence: 2, devotion: 5, openness: 4 } },
};

// ─── Scoring function ─────────────────────────────────────────────────────────

export function scoreLoveQuiz(answers: Record<number, LoveAnswer>): LoveResult {
  const IM  = { I: 0, M: 0 };
  const ER  = { E: 0, R: 0 };
  const RoP = { Ro: 0, P: 0 };
  const APa = { A: 0, Pa: 0 };
  const Dim = { De: 0, Gu: 0, Fi: 0, Ge: 0 };

  const add = (a: typeof answers[number]) => a;

  // Q1 Binary IM
  const q1 = answers[1];
  if (q1 === "LEFT")  { IM.M += 2; RoP.Ro += 2; }
  if (q1 === "RIGHT") { IM.I += 2; RoP.P  += 2; }

  // Q2 Bare ER
  const q2 = answers[2];
  if (q2 === "A") { ER.E += 2; APa.A += 2; }
  if (q2 === "B") { ER.R += 2; APa.Pa += 2; }
  if (q2 === "C") { ER.R += 2; Dim.Gu += 2; }
  if (q2 === "D") { ER.E += 2; Dim.Gu += 2; }

  // Q3 Bare ATTACHMENT
  const q3 = answers[3];
  if (q3 === "A") { IM.I += 2; }
  if (q3 === "B") { IM.I += 2; ER.R += 2; }
  if (q3 === "C") { IM.M += 2; ER.E += 2; }
  if (q3 === "D") { IM.I += 2; RoP.P += 2; }

  // Q4 Slider IM (1=I, 5=M)
  const q4 = parseInt(answers[4] as string) || 3;
  IM.I += (6 - q4);
  IM.M += q4;

  // Q5 Binary ER
  const q5 = answers[5];
  if (q5 === "LEFT")  { ER.E += 2; Dim.Fi += 2; }
  if (q5 === "RIGHT") { ER.R += 2; Dim.De += 2; }

  // Q6 Bare D
  const q6 = answers[6];
  if (q6 === "A") { Dim.Fi += 2; ER.E += 2; }
  if (q6 === "B") { Dim.De += 2; IM.M += 2; }
  if (q6 === "C") { Dim.Gu += 2; IM.I += 2; }
  if (q6 === "D") { Dim.Gu += 2; ER.R += 2; }

  // Q7 Slider RoP (1=Ro, 5=P)
  const q7 = parseInt(answers[7] as string) || 3;
  RoP.Ro += (6 - q7);
  RoP.P  += q7;

  // Q8 Bare ATTACHMENT
  const q8 = answers[8];
  if (q8 === "A") { IM.I += 2; }
  if (q8 === "B") { IM.M += 2; ER.E += 2; }
  if (q8 === "C") { IM.I += 2; ER.R += 2; }
  if (q8 === "D") { ER.E += 2; APa.A += 2; }

  // Q9 Bare ER+A/Pa
  const q9 = answers[9];
  if (q9 === "A") { ER.E += 2; APa.A += 2; }
  if (q9 === "B") { ER.R += 2; APa.Pa += 2; }
  if (q9 === "C") { ER.E += 2; APa.Pa += 2; }
  if (q9 === "D") { ER.R += 2; APa.Pa += 2; }

  // Q10 Binary RP
  const q10 = answers[10];
  if (q10 === "LEFT")  { RoP.Ro += 2; IM.M += 2; }
  if (q10 === "RIGHT") { RoP.P  += 2; IM.I += 2; }

  // Q11 Slider D (1=Gu, 5=Fi)
  const q11 = parseInt(answers[11] as string) || 3;
  Dim.Gu += (6 - q11);
  Dim.Fi += q11;

  // Q12 Bare IM
  const q12 = answers[12];
  if (q12 === "A") { IM.I += 2; RoP.P  += 2; }
  if (q12 === "B") { IM.M += 2; RoP.Ro += 2; }
  if (q12 === "C") { IM.I += 2; RoP.Ro += 2; }
  if (q12 === "D") { IM.M += 2; Dim.De += 2; }

  // Q13 Pill ER+A/Pa
  const q13 = answers[13];
  if (q13 === "A") { ER.E += 2; APa.A  += 2; }
  if (q13 === "B") { ER.R += 2; APa.A  += 2; }
  if (q13 === "C") { ER.R += 2; APa.Pa += 2; }
  if (q13 === "D") { ER.R += 2; APa.Pa += 2; Dim.Gu += 2; }

  // Q14 Bare RP
  const q14 = answers[14];
  if (q14 === "A") { RoP.Ro += 2; Dim.Fi += 2; }
  if (q14 === "B") { RoP.P  += 2; Dim.De += 2; }
  if (q14 === "C") { RoP.P  += 2; IM.I   += 2; }
  if (q14 === "D") { RoP.P  += 2; IM.M   += 2; }

  // Q15 Binary D+A/Pa
  const q15 = answers[15];
  if (q15 === "LEFT")  { Dim.De += 2; APa.A  += 2; }
  if (q15 === "RIGHT") { Dim.Gu += 2; APa.Pa += 2; }

  // Q16 Slider IM (1=I, 5=M)
  const q16 = parseInt(answers[16] as string) || 3;
  IM.I += (6 - q16);
  IM.M += q16;

  // Q17 Binary ER+A/Pa
  const q17 = answers[17];
  if (q17 === "LEFT")  { ER.E += 2; APa.A  += 2; }
  if (q17 === "RIGHT") { ER.R += 2; APa.Pa += 2; }

  // Q18 Bare ATTACHMENT
  const q18 = answers[18];
  if (q18 === "A") { IM.M += 2; RoP.Ro += 2; }
  if (q18 === "B") { IM.M += 2; ER.E   += 2; }
  if (q18 === "C") { IM.I += 2; RoP.P  += 2; }
  // D = balanced, no scoring

  // Q19 Bare D+A/Pa
  const q19 = answers[19];
  if (q19 === "A") { Dim.Gu += 2; APa.Pa += 2; }
  if (q19 === "B") { Dim.De += 2; APa.A  += 2; }
  if (q19 === "C") { Dim.Fi += 2; APa.A  += 2; }
  if (q19 === "D") { Dim.Ge += 2; APa.Pa += 2; }

  // Q20 Bare ATTACHMENT
  const q20 = answers[20];
  if (q20 === "A") { IM.M += 2; ER.E += 2; APa.A  += 2; }
  if (q20 === "B") { IM.I += 2; ER.R += 2; APa.Pa += 2; }
  if (q20 === "C") { IM.M += 2; Dim.Gu += 2; }
  if (q20 === "D") { ER.E += 2; APa.A += 2; }

  // Q21 Slider ER (1=R, 5=E)
  const q21 = parseInt(answers[21] as string) || 3;
  ER.R += (6 - q21);
  ER.E += q21;

  // Q22 Bare RP
  const q22 = answers[22];
  if (q22 === "A") { RoP.Ro += 2; IM.M += 2; }
  if (q22 === "B") { RoP.P  += 2; IM.I += 2; }
  if (q22 === "C") { RoP.P  += 2; RoP.Ro += 2; }
  if (q22 === "D") { RoP.P  += 2; Dim.Ge += 2; }

  // Q23 Binary D+A/Pa
  const q23 = answers[23];
  if (q23 === "LEFT")  { Dim.Gu += 2; APa.Pa += 2; }
  if (q23 === "RIGHT") { Dim.Fi += 2; APa.A  += 2; }

  // Q24 Bare IM
  const q24 = answers[24];
  if (q24 === "A") { IM.M += 2; RoP.Ro += 2; }
  if (q24 === "B") { IM.I += 2; RoP.Ro += 2; }
  if (q24 === "C") { ER.E += 2; Dim.Gu += 2; }
  if (q24 === "D") { IM.I += 2; RoP.P  += 2; }

  void add; // suppress unused warning

  // ── Determine axes ──────────────────────────────────────────────────────────
  const iOrM  = IM.I  >= IM.M  ? "I"  : "M";
  const eOrR  = ER.E  >= ER.R  ? "E"  : "R";
  const roOrP = RoP.Ro >= RoP.P ? "Ro" : "P";
  const aOrPa = APa.A >= APa.Pa ? "A"  : "Pa";

  // ── Match archetype ─────────────────────────────────────────────────────────
  // | Archetype | I/M | E/R | Ro/P | A/Pa |
  // | Flame     | M   | E   | Ro   | A    |
  // | Harbour   | M   | R   | P    | A    |
  // | Wanderer  | I   | E   | Ro   | A    |
  // | Architect | I   | R   | P    | Pa   |
  // | Devotee   | M   | E   | P    | A    |
  // | Mirror    | I   | R   | Ro   | Pa   |
  // | Spark     | I   | E   | Ro   | A    |
  // | Anchor    | M   | R   | P    | Pa   |
  const ARCHETYPE_MAP: Array<[LoveArchetype, string, string, string, string]> = [
    ["Flame",     "M", "E", "Ro", "A" ],
    ["Harbour",   "M", "R", "P",  "A" ],
    ["Wanderer",  "I", "E", "Ro", "A" ],
    ["Architect", "I", "R", "P",  "Pa"],
    ["Devotee",   "M", "E", "P",  "A" ],
    ["Mirror",    "I", "R", "Ro", "Pa"],
    ["Spark",     "I", "E", "Ro", "A" ],
    ["Anchor",    "M", "R", "P",  "Pa"],
  ];

  // Score each archetype by how many axes match
  let bestArchetype: LoveArchetype = "Flame";
  let bestScore = -1;
  for (const [arch, m, e, ro, a] of ARCHETYPE_MAP) {
    let score = 0;
    if (m === iOrM)  score++;
    if (e === eOrR)  score++;
    if (ro === roOrP) score++;
    if (a === aOrPa) score++;
    if (score > bestScore) { bestScore = score; bestArchetype = arch; }
  }

  // ── Determine dimension ─────────────────────────────────────────────────────
  const dimEntries = Object.entries(Dim) as Array<[keyof typeof Dim, number]>;
  const bestDimKey = dimEntries.sort((a, b) => b[1] - a[1])[0][0];
  const DIM_MAP: Record<keyof typeof Dim, LoveDimension> = {
    De: "Devoted", Gu: "Guarded", Fi: "Fierce", Ge: "Gentle",
  };
  const dimension: LoveDimension = DIM_MAP[bestDimKey];

  // ── Look up copy ────────────────────────────────────────────────────────────
  const comboKey = `${dimension} ${bestArchetype}`;
  const combo = COMBOS[comboKey] ?? COMBOS["Fierce Flame"]!;
  const base  = ARCHETYPE_BASE[bestArchetype];

  return {
    dimension,
    archetype: bestArchetype,
    fullTitle: `The ${dimension} ${bestArchetype}`,
    tagline: base.tagline,
    whoYouAre: base.whoYouAre,
    howYouLove: base.howYouLove,
    adjectives: combo.adjectives,
    blindSpot: combo.blindSpot,
    compatibleWith: base.compatibleWith,
    famousPeople: base.famousPeople,
    attributes: combo.attributes,
    compatCopy: [
      getCompatCopy(bestArchetype, base.compatibleWith[0]),
      getCompatCopy(bestArchetype, base.compatibleWith[1]),
    ],
  };
}
