import {
  AnswerOption,
  Archetype,
  ArchetypeScores,
  AttributeScores,
  Prefix,
  PrefixScores,
  QuizResult,
} from "./types";

// [A] question scoring: each answer → +2 to two dimensions
// Axes: V=Vision, E=Execution, I=Individual, C=Collective
const ARCHETYPE_SCORING: Record<number, Record<AnswerOption, [keyof ArchetypeScores, keyof ArchetypeScores]>> = {
  1:  { A: ["V", "I"], B: ["V", "C"], C: ["E", "I"], D: ["E", "C"] },
  3:  { A: ["V", "I"], B: ["E", "I"], C: ["V", "C"], D: ["E", "C"] },
  5:  { A: ["V", "I"], B: ["V", "C"], C: ["E", "I"], D: ["E", "C"] },
  7:  { A: ["V", "I"], B: ["E", "I"], C: ["E", "C"], D: ["V", "C"] },
  9:  { A: ["V", "I"], B: ["V", "C"], C: ["E", "I"], D: ["E", "C"] },
  11: { A: ["V", "I"], B: ["E", "I"], C: ["V", "C"], D: ["E", "C"] },
  13: { A: ["V", "I"], B: ["E", "I"], C: ["E", "C"], D: ["V", "C"] },
  15: { A: ["V", "I"], B: ["E", "I"], C: ["V", "C"], D: ["E", "C"] },
  17: { A: ["V", "I"], B: ["V", "C"], C: ["E", "I"], D: ["E", "C"] },
};

// [P] question scoring: each answer → +2 to one prefix
// R=Relentless, Q=Quiet, B=Bold, G=Grounded
const PREFIX_SCORING: Record<number, Record<AnswerOption, keyof PrefixScores>> = {
  2:  { A: "Q", B: "B", C: "G", D: "R" },
  4:  { A: "R", B: "Q", C: "G", D: "B" },
  6:  { A: "R", B: "Q", C: "B", D: "G" },
  8:  { A: "R", B: "Q", C: "B", D: "G" },
  10: { A: "R", B: "Q", C: "B", D: "G" },
  12: { A: "R", B: "Q", C: "B", D: "G" },
  14: { A: "R", B: "Q", C: "B", D: "G" },
  16: { A: "R", B: "Q", C: "B", D: "G" },
  20: { A: "R", B: "Q", C: "B", D: "G" },
};

// Base attribute scores per archetype
const BASE_ATTRIBUTES: Record<Archetype, AttributeScores> = {
  Builder:   { execution: 4, vision: 2, independence: 4, collaboration: 2, adaptability: 3 },
  Disruptor: { execution: 2, vision: 5, independence: 4, collaboration: 2, adaptability: 3 },
  Anchor:    { execution: 4, vision: 2, independence: 2, collaboration: 5, adaptability: 3 },
  Catalyst:  { execution: 2, vision: 4, independence: 2, collaboration: 5, adaptability: 3 },
  Sovereign: { execution: 4, vision: 4, independence: 3, collaboration: 3, adaptability: 5 },
};

// Prefix attribute modifiers (+1 to two attributes, capped at 5)
const PREFIX_MODIFIERS: Record<Prefix, [keyof AttributeScores, keyof AttributeScores]> = {
  Relentless: ["execution", "independence"],
  Quiet:      ["independence", "vision"],
  Bold:       ["collaboration", "vision"],
  Grounded:   ["collaboration", "adaptability"],
};

function computeArchetypeScores(answers: Record<number, AnswerOption>): ArchetypeScores {
  const scores: ArchetypeScores = { V: 0, E: 0, I: 0, C: 0 };
  for (const [qId, answer] of Object.entries(ARCHETYPE_SCORING)) {
    const userAnswer = answers[Number(qId)];
    if (userAnswer) {
      const [dim1, dim2] = answer[userAnswer];
      scores[dim1] += 2;
      scores[dim2] += 2;
    }
  }
  return scores;
}

function computePrefixScores(answers: Record<number, AnswerOption>): PrefixScores {
  const scores: PrefixScores = { R: 0, Q: 0, B: 0, G: 0 };
  for (const [qId, answer] of Object.entries(PREFIX_SCORING)) {
    const userAnswer = answers[Number(qId)];
    if (userAnswer) {
      scores[answer[userAnswer]] += 2;
    }
  }
  return scores;
}

function determineArchetype(s: ArchetypeScores): Archetype {
  // Sovereign: Vision vs Execution within 2 AND Individual vs Collective within 2
  if (Math.abs(s.V - s.E) <= 2 && Math.abs(s.I - s.C) <= 2) return "Sovereign";

  // Quadrant scores
  const quadrants: Record<Archetype, number> = {
    Disruptor: s.V + s.I,
    Catalyst:  s.V + s.C,
    Builder:   s.E + s.I,
    Anchor:    s.E + s.C,
    Sovereign: 0,
  };

  let best: Archetype = "Builder";
  let bestScore = -1;
  for (const [archetype, score] of Object.entries(quadrants) as [Archetype, number][]) {
    if (archetype !== "Sovereign" && score > bestScore) {
      bestScore = score;
      best = archetype;
    }
  }
  return best;
}

function determinePrefix(s: PrefixScores): Prefix {
  const entries: [Prefix, number][] = [
    ["Relentless", s.R],
    ["Quiet", s.Q],
    ["Bold", s.B],
    ["Grounded", s.G],
  ];
  return entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

function computeAttributes(archetype: Archetype, prefix: Prefix): AttributeScores {
  const base = { ...BASE_ATTRIBUTES[archetype] };
  const [attr1, attr2] = PREFIX_MODIFIERS[prefix];
  base[attr1] = Math.min(5, base[attr1] + 1);
  base[attr2] = Math.min(5, base[attr2] + 1);
  return base;
}

// Full copy data per combination
const COPY: Record<string, Pick<QuizResult, "tagline" | "description" | "howYouWork" | "adjectives" | "blindSpot" | "compatibleWith" | "famousPeople">> = {
  "Relentless Builder": {
    tagline: "You don't talk about it. You build it.",
    description: "You're the person who makes things real. While others are still debating the idea, you've already started. There's a quiet satisfaction you get from tangible progress that most people don't understand — for you, a finished thing will always beat a perfect plan. People underestimate you until they see your output, and by then you're already onto the next thing.",
    howYouWork: "You work best with autonomy and a clear goal. Give you a problem and space to solve it and you'll deliver something nobody expected. You don't need a lot of meetings, check-ins, or validation — you need time and trust.",
    adjectives: ["Unstoppable", "Precise", "Driven"],
    blindSpot: "Builds so fast they risk perfecting the wrong thing before realising it.",
    compatibleWith: ["Catalyst", "Disruptor"],
    famousPeople: [
      { name: "Jensen Huang", reason: "Ran 30-year sprints at Nvidia — obsessive output that never let up until the world caught up to his vision." },
      { name: "Sara Blakely", reason: "Built Spanx from a $5k idea alone, shipping product every day before anyone in the industry took her seriously." },
      { name: "Elon Musk", reason: "Built SpaceX, Tesla, and Neuralink in parallel — an unrelenting output machine who ships rockets, cars, and brain chips simultaneously." },
    ],
  },
  "Quiet Builder": {
    tagline: "You don't talk about it. You build it.",
    description: "You're the person who makes things real. While others are still debating the idea, you've already started. There's a quiet satisfaction you get from tangible progress that most people don't understand — for you, a finished thing will always beat a perfect plan. People underestimate you until they see your output, and by then you're already onto the next thing.",
    howYouWork: "You work best with autonomy and a clear goal. Give you a problem and space to solve it and you'll deliver something nobody expected. You don't need a lot of meetings, check-ins, or validation — you need time and trust.",
    adjectives: ["Focused", "Dependable", "Sharp"],
    blindSpot: "Does exceptional work and then waits — indefinitely — for someone to notice.",
    compatibleWith: ["Catalyst", "Disruptor"],
    famousPeople: [
      { name: "Jony Ive", reason: "Designed the iMac, iPod, and iPhone in near-silence — his work spoke so loudly he never had to." },
      { name: "James Dyson", reason: "Made 5,127 prototypes alone before releasing a product, letting the work carry all the weight." },
      { name: "Hayao Miyazaki", reason: "Handcrafted entire cinematic worlds frame by frame over decades, building an animation legacy through obsessive, solitary craftsmanship." },
    ],
  },
  "Bold Builder": {
    tagline: "You don't talk about it. You build it.",
    description: "You're the person who makes things real. While others are still debating the idea, you've already started. There's a quiet satisfaction you get from tangible progress that most people don't understand — for you, a finished thing will always beat a perfect plan. People underestimate you until they see your output, and by then you're already onto the next thing.",
    howYouWork: "You work best with autonomy and a clear goal. Give you a problem and space to solve it and you'll deliver something nobody expected. You don't need a lot of meetings, check-ins, or validation — you need time and trust.",
    adjectives: ["Decisive", "Ambitious", "Direct"],
    blindSpot: "Makes big promises about what they're building, then has to ship under the weight of their own hype.",
    compatibleWith: ["Catalyst", "Disruptor"],
    famousPeople: [
      { name: "Mark Cuban", reason: "Declared ambitions loudly, then built the companies and deals to back every word." },
      { name: "Anna Wintour", reason: "Commanded Vogue with unwavering authority — she built an institution by making her standards impossible to ignore." },
      { name: "Gary Vaynerchuk", reason: "Built a media and marketing empire by declaring where the world was going, then building companies to prove it." },
    ],
  },
  "Grounded Builder": {
    tagline: "You don't talk about it. You build it.",
    description: "You're the person who makes things real. While others are still debating the idea, you've already started. There's a quiet satisfaction you get from tangible progress that most people don't understand — for you, a finished thing will always beat a perfect plan. People underestimate you until they see your output, and by then you're already onto the next thing.",
    howYouWork: "You work best with autonomy and a clear goal. Give you a problem and space to solve it and you'll deliver something nobody expected. You don't need a lot of meetings, check-ins, or validation — you need time and trust.",
    adjectives: ["Reliable", "Methodical", "Steady"],
    blindSpot: "Builds exactly what was agreed — even when what was agreed has quietly become wrong.",
    compatibleWith: ["Catalyst", "Disruptor"],
    famousPeople: [
      { name: "Tim Cook", reason: "Turned Apple's supply chain into an unbeatable moat — patient, methodical building compounded into the world's most valuable company." },
      { name: "Phil Knight", reason: "Built Nike over decades through disciplined incrementalism, never letting urgency override the long game." },
      { name: "Howard Schultz", reason: "Scaled Starbucks from 11 stores to 30,000 by staying steady on culture and quality through every growth phase." },
    ],
  },
  "Relentless Disruptor": {
    tagline: "You see what everyone else has normalised. And it bothers you.",
    description: "You have an almost allergic reaction to the way things have always been done. You notice inefficiencies, assumptions, and blind spots that others walk past every day — and you can't help but say something. You're not difficult, you're just operating at a different altitude. The best teams in the world need someone like you, even when they don't immediately realise it.",
    howYouWork: "You do your sharpest thinking alone, away from consensus and noise. Your ideas need space to develop before they're ready for the room. Once you've figured out what you think, you communicate it with a clarity that's hard to argue with.",
    adjectives: ["Relentless", "Unconventional", "Sharp"],
    blindSpot: "Challenges so much, so often, that the one time it really matters people have stopped listening.",
    compatibleWith: ["Anchor", "Builder"],
    famousPeople: [
      { name: "Steve Jobs", reason: "Refused to ship anything ordinary — relentlessly tore up his own drafts until the product was impossible to ignore." },
      { name: "Reed Hastings", reason: "Disrupted cable TV and then disrupted his own DVD business before the market could do it for him." },
      { name: "Travis Kalanick", reason: "Relentlessly dismantled the global taxi industry before it knew what was happening — built Uber by refusing to accept the status quo was fixed." },
    ],
  },
  "Quiet Disruptor": {
    tagline: "You see what everyone else has normalised. And it bothers you.",
    description: "You have an almost allergic reaction to the way things have always been done. You notice inefficiencies, assumptions, and blind spots that others walk past every day — and you can't help but say something. You're not difficult, you're just operating at a different altitude. The best teams in the world need someone like you, even when they don't immediately realise it.",
    howYouWork: "You do your sharpest thinking alone, away from consensus and noise. Your ideas need space to develop before they're ready for the room. Once you've figured out what you think, you communicate it with a clarity that's hard to argue with.",
    adjectives: ["Perceptive", "Unconventional", "Deep"],
    blindSpot: "Watches the wrong thing happen in slow motion, certain someone else will eventually say something.",
    compatibleWith: ["Anchor", "Builder"],
    famousPeople: [
      { name: "Elon Musk", reason: "Worked in near-isolation on electric vehicles and private rocketry long before they were mainstream — disrupting industries one quiet, obsessive bet at a time." },
      { name: "Yuval Noah Harari", reason: "Overturned how the world thinks about humanity and technology through deep, solitary research that reached hundreds of millions of readers." },
      { name: "Nikola Tesla", reason: "Worked in near-isolation to overturn the established electrical order — his disruption was silent until it lit up the world." },
    ],
  },
  "Bold Disruptor": {
    tagline: "You see what everyone else has normalised. And it bothers you.",
    description: "You have an almost allergic reaction to the way things have always been done. You notice inefficiencies, assumptions, and blind spots that others walk past every day — and you can't help but say something. You're not difficult, you're just operating at a different altitude. The best teams in the world need someone like you, even when they don't immediately realise it.",
    howYouWork: "You do your sharpest thinking alone, away from consensus and noise. Your ideas need space to develop before they're ready for the room. Once you've figured out what you think, you communicate it with a clarity that's hard to argue with.",
    adjectives: ["Provocative", "Visionary", "Fearless"],
    blindSpot: "Says what needs to change so loudly they get excluded from the rooms where change actually happens.",
    compatibleWith: ["Anchor", "Builder"],
    famousPeople: [
      { name: "Jack Dorsey", reason: "Publicly challenged how communication and finance work, launching platforms that rewrote both conversations." },
      { name: "Arianna Huffington", reason: "Called out hustle culture from a mainstream stage and built a media empire that changed how people consume news." },
      { name: "Kanye West", reason: "Declared himself a genius and then disrupted music, fashion, and culture with output that routinely forced the world to reckon with his terms." },
    ],
  },
  "Grounded Disruptor": {
    tagline: "You see what everyone else has normalised. And it bothers you.",
    description: "You have an almost allergic reaction to the way things have always been done. You notice inefficiencies, assumptions, and blind spots that others walk past every day — and you can't help but say something. You're not difficult, you're just operating at a different altitude. The best teams in the world need someone like you, even when they don't immediately realise it.",
    howYouWork: "You do your sharpest thinking alone, away from consensus and noise. Your ideas need space to develop before they're ready for the room. Once you've figured out what you think, you communicate it with a clarity that's hard to argue with.",
    adjectives: ["Thoughtful", "Independent", "Calm"],
    blindSpot: "Raises the right challenges so calmly that the system absorbs them without actually changing.",
    compatibleWith: ["Anchor", "Builder"],
    famousPeople: [
      { name: "Ray Dalio", reason: "Challenged conventional investing wisdom with principles-first thinking, disrupting finance from a place of deep, steady conviction." },
      { name: "Naval Ravikant", reason: "Dismantled conventional thinking about wealth, status, and leverage through calm, methodical reasoning that rewired how a generation thinks about work." },
      { name: "Jordan Peterson", reason: "Challenged cultural orthodoxies with steady, structured arguments — methodically disrupting mainstream assumptions about identity, meaning, and responsibility." },
    ],
  },
  "Relentless Anchor": {
    tagline: "People don't always know why they trust you. They just do.",
    description: "You are the person every high performing team quietly depends on. Not because you're the loudest or the most visible, but because you're the most reliable. When things get uncertain, people look to you — not for answers necessarily, but for steadiness. You have a rare ability to hold a team together under pressure without making it look like effort.",
    howYouWork: "You work best when you're connected to people and purpose. You're not just executing tasks, you're holding the fabric of the team together while doing it. Your consistency is your superpower — people build their best work on top of your reliability.",
    adjectives: ["Dependable", "Tireless", "Selfless"],
    blindSpot: "Pours everything into holding others steady until there's nothing left to steady themselves with.",
    compatibleWith: ["Disruptor", "Catalyst"],
    famousPeople: [
      { name: "Beyoncé", reason: "Holds an unrelenting standard for herself and her entire team — no detail is too small, no output too polished." },
      { name: "Kobe Bryant", reason: "Anchored every team he played for through obsessive preparation and a refusal to let standards drop." },
      { name: "Serena Williams", reason: "Anchored women's tennis for two decades through tireless dedication — her relentlessness held the sport to a higher standard than it had ever set for itself." },
    ],
  },
  "Quiet Anchor": {
    tagline: "People don't always know why they trust you. They just do.",
    description: "You are the person every high performing team quietly depends on. Not because you're the loudest or the most visible, but because you're the most reliable. When things get uncertain, people look to you — not for answers necessarily, but for steadiness. You have a rare ability to hold a team together under pressure without making it look like effort.",
    howYouWork: "You work best when you're connected to people and purpose. You're not just executing tasks, you're holding the fabric of the team together while doing it. Your consistency is your superpower — people build their best work on top of your reliability.",
    adjectives: ["Steady", "Trustworthy", "Understated"],
    blindSpot: "Carries more than anyone realises, and never mentions it until they're already at the limit.",
    compatibleWith: ["Disruptor", "Catalyst"],
    famousPeople: [
      { name: "Fred Rogers", reason: "Anchored a generation of children with quiet, consistent warmth — no spotlight needed, just presence." },
      { name: "Melinda Gates", reason: "Holds the moral and operational centre of one of the world's most consequential philanthropic organisations, without seeking the stage." },
      { name: "Jacinda Ardern", reason: "Led New Zealand through crises with understated steadiness, earning deep trust by never performing more than she delivered." },
    ],
  },
  "Bold Anchor": {
    tagline: "People don't always know why they trust you. They just do.",
    description: "You are the person every high performing team quietly depends on. Not because you're the loudest or the most visible, but because you're the most reliable. When things get uncertain, people look to you — not for answers necessarily, but for steadiness. You have a rare ability to hold a team together under pressure without making it look like effort.",
    howYouWork: "You work best when you're connected to people and purpose. You're not just executing tasks, you're holding the fabric of the team together while doing it. Your consistency is your superpower — people build their best work on top of your reliability.",
    adjectives: ["Warm", "Magnetic", "Grounding"],
    blindSpot: "Becomes so central to holding things together that the team quietly stops functioning without them.",
    compatibleWith: ["Disruptor", "Catalyst"],
    famousPeople: [
      { name: "Michelle Obama", reason: "Publicly anchors values of empathy, service, and dignity — her bold presence makes whole rooms believe in what's possible." },
      { name: "Oprah Winfrey", reason: "Held a global audience together through bold, empathetic presence — her platform became the most trusted anchor in American culture." },
      { name: "Magic Johnson", reason: "Held his teams together through sheer force of spirit, commanding the floor while making everyone around him better." },
    ],
  },
  "Grounded Anchor": {
    tagline: "People don't always know why they trust you. They just do.",
    description: "You are the person every high performing team quietly depends on. Not because you're the loudest or the most visible, but because you're the most reliable. When things get uncertain, people look to you — not for answers necessarily, but for steadiness. You have a rare ability to hold a team together under pressure without making it look like effort.",
    howYouWork: "You work best when you're connected to people and purpose. You're not just executing tasks, you're holding the fabric of the team together while doing it. Your consistency is your superpower — people build their best work on top of your reliability.",
    adjectives: ["Unshakeable", "Patient", "Loyal"],
    blindSpot: "So good at absorbing turbulence that they protect the team from the disruption it actually needed.",
    compatibleWith: ["Disruptor", "Catalyst"],
    famousPeople: [
      { name: "Angela Merkel", reason: "Anchored Germany and the EU through 16 years of turbulence through calm, methodical, long-term governance." },
      { name: "Satya Nadella", reason: "Transformed Microsoft not through disruption but through grounded, consistent trust-building that compounded over a decade." },
      { name: "Warren Buffett", reason: "Has anchored Berkshire Hathaway and investor confidence for six decades through patient, grounded consistency that never wavered." },
    ],
  },
  "Relentless Catalyst": {
    tagline: "You don't just raise the energy in a room. You change what the room believes is possible.",
    description: "You operate through people. Your superpower isn't an idea or a skill — it's your ability to unlock both of those things in everyone around you. You make people feel capable of more than they thought, and that's rarer and more valuable than most people realise. The best versions of teams, projects, and companies have someone like you somewhere near the centre of them.",
    howYouWork: "You thrive in environments where collaboration is the currency. You're at your best when you're connecting people, ideas, and momentum — and at your worst when you're isolated or working in a silo. You need people the way some people need quiet.",
    adjectives: ["Energising", "Driven", "Infectious"],
    blindSpot: "Lights fires across the room and moves on before knowing if any of them actually caught.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Oprah Winfrey", reason: "Relentlessly catalyses transformation in the people she platforms — her output across media, giving, and community never slows." },
      { name: "Will Smith", reason: "Spent three decades relentlessly catalysing his audiences — from music to film to social media, always investing in unlocking something in the people watching." },
      { name: "LeBron James", reason: "Makes every team he joins perform beyond expectation through tireless investment in the people around him." },
    ],
  },
  "Quiet Catalyst": {
    tagline: "You don't just raise the energy in a room. You change what the room believes is possible.",
    description: "You operate through people. Your superpower isn't an idea or a skill — it's your ability to unlock both of those things in everyone around you. You make people feel capable of more than they thought, and that's rarer and more valuable than most people realise. The best versions of teams, projects, and companies have someone like you somewhere near the centre of them.",
    howYouWork: "You thrive in environments where collaboration is the currency. You're at your best when you're connecting people, ideas, and momentum — and at your worst when you're isolated or working in a silo. You need people the way some people need quiet.",
    adjectives: ["Magnetic", "Intuitive", "Deep"],
    blindSpot: "Creates the conditions for everyone else's breakthrough and is rarely in the story they tell about it.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Sheryl Sandberg", reason: "Shifted the conversation around women in leadership through precise, understated advocacy that moved organisations from the inside." },
      { name: "Malala Yousafzai", reason: "Catalysed a global conversation about girls' education through quiet, unwavering conviction that moved governments and millions of people." },
      { name: "Brené Brown", reason: "Changed how people understand courage and vulnerability through careful research that catalysed a worldwide shift in how people talk about emotion." },
    ],
  },
  "Bold Catalyst": {
    tagline: "You don't just raise the energy in a room. You change what the room believes is possible.",
    description: "You operate through people. Your superpower isn't an idea or a skill — it's your ability to unlock both of those things in everyone around you. You make people feel capable of more than they thought, and that's rarer and more valuable than most people realise. The best versions of teams, projects, and companies have someone like you somewhere near the centre of them.",
    howYouWork: "You thrive in environments where collaboration is the currency. You're at your best when you're connecting people, ideas, and momentum — and at your worst when you're isolated or working in a silo. You need people the way some people need quiet.",
    adjectives: ["Electric", "Charismatic", "Visionary"],
    blindSpot: "So magnetic on the vision that people leave the room energised but unclear on what to actually do.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Richard Branson", reason: "Publicly declares belief in people and ideas — turning his enthusiasm into companies that pull others along with him." },
      { name: "Gary Vaynerchuk", reason: "Catalyses ambition at scale from a very loud stage, making millions of people feel seen and capable of more." },
      { name: "Tony Robbins", reason: "Has spent decades on global stages boldly catalysing transformation in millions — making audiences believe they are capable of more than they imagined." },
    ],
  },
  "Grounded Catalyst": {
    tagline: "You don't just raise the energy in a room. You change what the room believes is possible.",
    description: "You operate through people. Your superpower isn't an idea or a skill — it's your ability to unlock both of those things in everyone around you. You make people feel capable of more than they thought, and that's rarer and more valuable than most people realise. The best versions of teams, projects, and companies have someone like you somewhere near the centre of them.",
    howYouWork: "You thrive in environments where collaboration is the currency. You're at your best when you're connecting people, ideas, and momentum — and at your worst when you're isolated or working in a silo. You need people the way some people need quiet.",
    adjectives: ["Warm", "Consistent", "Inspiring"],
    blindSpot: "Consistently raises everyone around them while their own ambitions quietly stall in the background.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Nelson Mandela", reason: "Catalysed national transformation through 27 years of patient, grounded conviction — then held a fractured country together with steady purpose." },
      { name: "Maya Angelou", reason: "Unlocked something in every reader and listener through calm, earned wisdom that never needed urgency to move people." },
      { name: "Jacinda Ardern", reason: "Catalysed empathetic leadership on a world stage through grounded consistency, proving steadiness can be as galvanising as fire." },
    ],
  },
  "Relentless Sovereign": {
    tagline: "You're hard to put in a box. That's not a coincidence.",
    description: "You don't fit neatly into one mode because you've never needed to. You can hold a vision and execute it. You can lead a room and do the quiet work. Most people develop one of these as a strength and compensate for the others — you've developed all of them, which makes you genuinely rare. People often find you difficult to read at first, and then realise that what they mistook for mystery was just range.",
    howYouWork: "You adapt to what the moment needs rather than defaulting to one style. In a crisis you're calm. In a vacuum you lead. In execution mode you deliver. The challenge isn't capability — it's deciding where to point it.",
    adjectives: ["Formidable", "Versatile", "Driven"],
    blindSpot: "Operates across every domain at once and risks being formidable in none of them.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Jeff Bezos", reason: "Relentlessly expanded Amazon's scope across a dozen industries simultaneously, never pausing to consolidate before pushing further." },
      { name: "Rihanna", reason: "Built dominant positions in music, beauty, and fashion in parallel — a sovereign who never stops adding territory." },
      { name: "Cristiano Ronaldo", reason: "Built dominance across football, business, and global brand simultaneously — a sovereign who never stops expanding his territory." },
    ],
  },
  "Quiet Sovereign": {
    tagline: "You're hard to put in a box. That's not a coincidence.",
    description: "You don't fit neatly into one mode because you've never needed to. You can hold a vision and execute it. You can lead a room and do the quiet work. Most people develop one of these as a strength and compensate for the others — you've developed all of them, which makes you genuinely rare. People often find you difficult to read at first, and then realise that what they mistook for mystery was just range.",
    howYouWork: "You adapt to what the moment needs rather than defaulting to one style. In a crisis you're calm. In a vacuum you lead. In execution mode you deliver. The challenge isn't capability — it's deciding where to point it.",
    adjectives: ["Enigmatic", "Razor-sharp", "Composed"],
    blindSpot: "So self-contained that people around them feel like observers in a partnership rather than participants.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Barack Obama", reason: "Held vision and execution across the world's most complex job, doing it with a quiet composure that made the range invisible." },
      { name: "Bill Gates", reason: "Built Microsoft as a full-stack sovereign — setting technical direction, managing operations, and shaping industry quietly from every angle." },
      { name: "Taylor Swift", reason: "Built and rebuilt a music empire on her own terms across multiple genres — a quiet sovereign whose strategic control of her career is only visible in retrospect." },
    ],
  },
  "Bold Sovereign": {
    tagline: "You're hard to put in a box. That's not a coincidence.",
    description: "You don't fit neatly into one mode because you've never needed to. You can hold a vision and execute it. You can lead a room and do the quiet work. Most people develop one of these as a strength and compensate for the others — you've developed all of them, which makes you genuinely rare. People often find you difficult to read at first, and then realise that what they mistook for mystery was just range.",
    howYouWork: "You adapt to what the moment needs rather than defaulting to one style. In a crisis you're calm. In a vacuum you lead. In execution mode you deliver. The challenge isn't capability — it's deciding where to point it.",
    adjectives: ["Commanding", "Visionary", "Dynamic"],
    blindSpot: "Decides with such authority that the people closest to the work stop sharing what they actually think.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Jay-Z", reason: "Built music, spirits, sports, and media empires while boldly declaring his ambition — a sovereign who claims every room before entering it." },
      { name: "Kanye West", reason: "Claimed sovereignty over music, fashion, and culture from a very loud position — a bold sovereign who defines the terms before entering any room." },
      { name: "Beyoncé", reason: "Commands music, film, fashion, and cultural conversation as a bold sovereign — her authority in every room is total before she speaks." },
    ],
  },
  "Grounded Sovereign": {
    tagline: "You're hard to put in a box. That's not a coincidence.",
    description: "You don't fit neatly into one mode because you've never needed to. You can hold a vision and execute it. You can lead a room and do the quiet work. Most people develop one of these as a strength and compensate for the others — you've developed all of them, which makes you genuinely rare. People often find you difficult to read at first, and then realise that what they mistook for mystery was just range.",
    howYouWork: "You adapt to what the moment needs rather than defaulting to one style. In a crisis you're calm. In a vacuum you lead. In execution mode you deliver. The challenge isn't capability — it's deciding where to point it.",
    adjectives: ["Composed", "Adaptable", "Rare"],
    blindSpot: "Moves through every mode so smoothly that people can't tell when something actually needs urgency.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Warren Buffett", reason: "A sovereign across investing, capital allocation, and public influence — built over decades through patient, grounded compounding." },
      { name: "Angela Merkel", reason: "Governed with full-spectrum sovereign range — strategic vision, operational control, and crisis leadership — all from a place of methodical calm." },
      { name: "Serena Williams", reason: "Built a dominant multi-decade sporting legacy and a business empire through grounded discipline that never confused range with recklessness." },
    ],
  },
};

export function scoreQuiz(answers: Record<number, AnswerOption>): QuizResult {
  const archetypeScores = computeArchetypeScores(answers);
  const prefixScores = computePrefixScores(answers);

  const archetype = determineArchetype(archetypeScores);
  const prefix = determinePrefix(prefixScores);
  const attributes = computeAttributes(archetype, prefix);

  const key = `${prefix} ${archetype}`;
  const copy = COPY[key];

  const industryAnswers: AnswerOption[] = [answers[18], answers[19]].filter(Boolean) as AnswerOption[];

  return {
    prefix,
    archetype,
    fullTitle: `The ${prefix} ${archetype}`,
    attributes,
    industryAnswers,
    ...copy,
  };
}
