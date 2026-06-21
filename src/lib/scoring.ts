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
    blindSpot: "Runs so fast they forget to check if they're still going the right way.",
    compatibleWith: ["Catalyst", "Disruptor"],
    famousPeople: [
      { name: "Jensen Huang", reason: "Obsessive executor who turned vision into hardware dominance." },
      { name: "Kanye West", reason: "Relentlessly builds — albums, brands, collections — without waiting for permission." },
      { name: "Sara Blakely", reason: "Built Spanx alone, brick by brick, from a $5k idea to a billion-dollar company." },
    ],
  },
  "Quiet Builder": {
    tagline: "You don't talk about it. You build it.",
    description: "You're the person who makes things real. While others are still debating the idea, you've already started. There's a quiet satisfaction you get from tangible progress that most people don't understand — for you, a finished thing will always beat a perfect plan. People underestimate you until they see your output, and by then you're already onto the next thing.",
    howYouWork: "You work best with autonomy and a clear goal. Give you a problem and space to solve it and you'll deliver something nobody expected. You don't need a lot of meetings, check-ins, or validation — you need time and trust.",
    adjectives: ["Focused", "Dependable", "Sharp"],
    blindSpot: "Does the work without taking credit, then wonders why they're overlooked.",
    compatibleWith: ["Catalyst", "Disruptor"],
    famousPeople: [
      { name: "Jensen Huang", reason: "Obsessive executor who turned vision into hardware dominance." },
      { name: "Kanye West", reason: "Builds in silence until the output speaks for itself." },
      { name: "Sara Blakely", reason: "Built Spanx alone, brick by brick, from a $5k idea to a billion-dollar company." },
    ],
  },
  "Bold Builder": {
    tagline: "You don't talk about it. You build it.",
    description: "You're the person who makes things real. While others are still debating the idea, you've already started. There's a quiet satisfaction you get from tangible progress that most people don't understand — for you, a finished thing will always beat a perfect plan. People underestimate you until they see your output, and by then you're already onto the next thing.",
    howYouWork: "You work best with autonomy and a clear goal. Give you a problem and space to solve it and you'll deliver something nobody expected. You don't need a lot of meetings, check-ins, or validation — you need time and trust.",
    adjectives: ["Decisive", "Ambitious", "Direct"],
    blindSpot: "Moves so fast they sometimes leave the team behind without realising.",
    compatibleWith: ["Catalyst", "Disruptor"],
    famousPeople: [
      { name: "Jensen Huang", reason: "Obsessive executor who turned vision into hardware dominance." },
      { name: "Kanye West", reason: "Relentlessly builds — albums, brands, collections — without waiting for permission." },
      { name: "Sara Blakely", reason: "Built Spanx alone, brick by brick, from a $5k idea to a billion-dollar company." },
    ],
  },
  "Grounded Builder": {
    tagline: "You don't talk about it. You build it.",
    description: "You're the person who makes things real. While others are still debating the idea, you've already started. There's a quiet satisfaction you get from tangible progress that most people don't understand — for you, a finished thing will always beat a perfect plan. People underestimate you until they see your output, and by then you're already onto the next thing.",
    howYouWork: "You work best with autonomy and a clear goal. Give you a problem and space to solve it and you'll deliver something nobody expected. You don't need a lot of meetings, check-ins, or validation — you need time and trust.",
    adjectives: ["Reliable", "Methodical", "Steady"],
    blindSpot: "So committed to the plan they can be slow to pivot when things change.",
    compatibleWith: ["Catalyst", "Disruptor"],
    famousPeople: [
      { name: "Jensen Huang", reason: "Obsessive executor who turned vision into hardware dominance." },
      { name: "Kanye West", reason: "Relentlessly builds — albums, brands, collections — without waiting for permission." },
      { name: "Sara Blakely", reason: "Built Spanx alone, brick by brick, from a $5k idea to a billion-dollar company." },
    ],
  },
  "Relentless Disruptor": {
    tagline: "You see what everyone else has normalised. And it bothers you.",
    description: "You have an almost allergic reaction to the way things have always been done. You notice inefficiencies, assumptions, and blind spots that others walk past every day — and you can't help but say something. You're not difficult, you're just operating at a different altitude. The best teams in the world need someone like you, even when they don't immediately realise it.",
    howYouWork: "You do your sharpest thinking alone, away from consensus and noise. Your ideas need space to develop before they're ready for the room. Once you've figured out what you think, you communicate it with a clarity that's hard to argue with.",
    adjectives: ["Relentless", "Unconventional", "Sharp"],
    blindSpot: "Challenges everything so consistently that people sometimes stop listening.",
    compatibleWith: ["Anchor", "Builder"],
    famousPeople: [
      { name: "Steve Jobs", reason: "Refused to accept the ordinary — built the extraordinary instead." },
      { name: "Elon Musk", reason: "Sees every industry's assumptions as an invitation to challenge them." },
      { name: "Malala Yousafzai", reason: "Disrupted a system that tried to silence her, with relentless conviction." },
    ],
  },
  "Quiet Disruptor": {
    tagline: "You see what everyone else has normalised. And it bothers you.",
    description: "You have an almost allergic reaction to the way things have always been done. You notice inefficiencies, assumptions, and blind spots that others walk past every day — and you can't help but say something. You're not difficult, you're just operating at a different altitude. The best teams in the world need someone like you, even when they don't immediately realise it.",
    howYouWork: "You do your sharpest thinking alone, away from consensus and noise. Your ideas need space to develop before they're ready for the room. Once you've figured out what you think, you communicate it with a clarity that's hard to argue with.",
    adjectives: ["Perceptive", "Unconventional", "Deep"],
    blindSpot: "Sees the problem clearly but waits too long to say something about it.",
    compatibleWith: ["Anchor", "Builder"],
    famousPeople: [
      { name: "Steve Jobs", reason: "Refused to accept the ordinary — built the extraordinary instead." },
      { name: "Elon Musk", reason: "Sees every industry's assumptions as an invitation to challenge them." },
      { name: "Malala Yousafzai", reason: "Disrupted a system that tried to silence her, with quiet, unshakeable courage." },
    ],
  },
  "Bold Disruptor": {
    tagline: "You see what everyone else has normalised. And it bothers you.",
    description: "You have an almost allergic reaction to the way things have always been done. You notice inefficiencies, assumptions, and blind spots that others walk past every day — and you can't help but say something. You're not difficult, you're just operating at a different altitude. The best teams in the world need someone like you, even when they don't immediately realise it.",
    howYouWork: "You do your sharpest thinking alone, away from consensus and noise. Your ideas need space to develop before they're ready for the room. Once you've figured out what you think, you communicate it with a clarity that's hard to argue with.",
    adjectives: ["Provocative", "Visionary", "Fearless"],
    blindSpot: "Can be so convinced they're right that they don't leave room for other perspectives.",
    compatibleWith: ["Anchor", "Builder"],
    famousPeople: [
      { name: "Steve Jobs", reason: "Refused to accept the ordinary — built the extraordinary instead." },
      { name: "Elon Musk", reason: "Sees every industry's assumptions as an invitation to challenge them." },
      { name: "Malala Yousafzai", reason: "Disrupted a system that tried to silence her, fearlessly and publicly." },
    ],
  },
  "Grounded Disruptor": {
    tagline: "You see what everyone else has normalised. And it bothers you.",
    description: "You have an almost allergic reaction to the way things have always been done. You notice inefficiencies, assumptions, and blind spots that others walk past every day — and you can't help but say something. You're not difficult, you're just operating at a different altitude. The best teams in the world need someone like you, even when they don't immediately realise it.",
    howYouWork: "You do your sharpest thinking alone, away from consensus and noise. Your ideas need space to develop before they're ready for the room. Once you've figured out what you think, you communicate it with a clarity that's hard to argue with.",
    adjectives: ["Thoughtful", "Independent", "Calm"],
    blindSpot: "Challenges the system quietly enough that the impact doesn't always land.",
    compatibleWith: ["Anchor", "Builder"],
    famousPeople: [
      { name: "Steve Jobs", reason: "Refused to accept the ordinary — built the extraordinary instead." },
      { name: "Elon Musk", reason: "Sees every industry's assumptions as an invitation to challenge them." },
      { name: "Malala Yousafzai", reason: "Disrupted a system that tried to silence her, with grounded, unwavering purpose." },
    ],
  },
  "Relentless Anchor": {
    tagline: "People don't always know why they trust you. They just do.",
    description: "You are the person every high performing team quietly depends on. Not because you're the loudest or the most visible, but because you're the most reliable. When things get uncertain, people look to you — not for answers necessarily, but for steadiness. You have a rare ability to hold a team together under pressure without making it look like effort.",
    howYouWork: "You work best when you're connected to people and purpose. You're not just executing tasks, you're holding the fabric of the team together while doing it. Your consistency is your superpower — people build their best work on top of your reliability.",
    adjectives: ["Dependable", "Tireless", "Selfless"],
    blindSpot: "Gives so much to others that their own needs consistently come last.",
    compatibleWith: ["Disruptor", "Catalyst"],
    famousPeople: [
      { name: "Tim Cook", reason: "The operational anchor who made Apple's vision scalable." },
      { name: "Beyoncé", reason: "Relentlessly holds the standard — for herself and everyone around her." },
      { name: "Satya Nadella", reason: "Transformed Microsoft by being the steady force that trusted people to grow." },
    ],
  },
  "Quiet Anchor": {
    tagline: "People don't always know why they trust you. They just do.",
    description: "You are the person every high performing team quietly depends on. Not because you're the loudest or the most visible, but because you're the most reliable. When things get uncertain, people look to you — not for answers necessarily, but for steadiness. You have a rare ability to hold a team together under pressure without making it look like effort.",
    howYouWork: "You work best when you're connected to people and purpose. You're not just executing tasks, you're holding the fabric of the team together while doing it. Your consistency is your superpower — people build their best work on top of your reliability.",
    adjectives: ["Steady", "Trustworthy", "Understated"],
    blindSpot: "So understated that people don't always realise how much they're carrying.",
    compatibleWith: ["Disruptor", "Catalyst"],
    famousPeople: [
      { name: "Tim Cook", reason: "The operational anchor who made Apple's vision scalable." },
      { name: "Beyoncé", reason: "Holds the standard quietly — her consistency speaks louder than any announcement." },
      { name: "Satya Nadella", reason: "Transformed Microsoft by being the steady force that trusted people to grow." },
    ],
  },
  "Bold Anchor": {
    tagline: "People don't always know why they trust you. They just do.",
    description: "You are the person every high performing team quietly depends on. Not because you're the loudest or the most visible, but because you're the most reliable. When things get uncertain, people look to you — not for answers necessarily, but for steadiness. You have a rare ability to hold a team together under pressure without making it look like effort.",
    howYouWork: "You work best when you're connected to people and purpose. You're not just executing tasks, you're holding the fabric of the team together while doing it. Your consistency is your superpower — people build their best work on top of your reliability.",
    adjectives: ["Warm", "Magnetic", "Grounding"],
    blindSpot: "Takes up so much space holding others together that they neglect their own direction.",
    compatibleWith: ["Disruptor", "Catalyst"],
    famousPeople: [
      { name: "Tim Cook", reason: "The operational anchor who made Apple's vision scalable." },
      { name: "Beyoncé", reason: "Anchors any room she's in — bold, reliable, and impossible to ignore." },
      { name: "Satya Nadella", reason: "Transformed Microsoft by being the steady force that trusted people to grow." },
    ],
  },
  "Grounded Anchor": {
    tagline: "People don't always know why they trust you. They just do.",
    description: "You are the person every high performing team quietly depends on. Not because you're the loudest or the most visible, but because you're the most reliable. When things get uncertain, people look to you — not for answers necessarily, but for steadiness. You have a rare ability to hold a team together under pressure without making it look like effort.",
    howYouWork: "You work best when you're connected to people and purpose. You're not just executing tasks, you're holding the fabric of the team together while doing it. Your consistency is your superpower — people build their best work on top of your reliability.",
    adjectives: ["Unshakeable", "Patient", "Loyal"],
    blindSpot: "So focused on stability that they can resist necessary change for too long.",
    compatibleWith: ["Disruptor", "Catalyst"],
    famousPeople: [
      { name: "Tim Cook", reason: "The operational anchor who made Apple's vision scalable." },
      { name: "Beyoncé", reason: "The grounded anchor behind decades of consistent, world-class output." },
      { name: "Satya Nadella", reason: "Transformed Microsoft by being the steady force that trusted people to grow." },
    ],
  },
  "Relentless Catalyst": {
    tagline: "You don't just raise the energy in a room. You change what the room believes is possible.",
    description: "You operate through people. Your superpower isn't an idea or a skill — it's your ability to unlock both of those things in everyone around you. You make people feel capable of more than they thought, and that's rarer and more valuable than most people realise. The best versions of teams, projects, and companies have someone like you somewhere near the centre of them.",
    howYouWork: "You thrive in environments where collaboration is the currency. You're at your best when you're connecting people, ideas, and momentum — and at your worst when you're isolated or working in a silo. You need people the way some people need quiet.",
    adjectives: ["Energising", "Driven", "Infectious"],
    blindSpot: "Moves so fast between ideas that the people they inspire can't keep up.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Oprah Winfrey", reason: "Relentlessly catalyses growth in everyone she meets." },
      { name: "Richard Branson", reason: "Turns people's belief in the impossible into companies." },
      { name: "LeBron James", reason: "Makes every team he joins perform beyond what anyone expected." },
    ],
  },
  "Quiet Catalyst": {
    tagline: "You don't just raise the energy in a room. You change what the room believes is possible.",
    description: "You operate through people. Your superpower isn't an idea or a skill — it's your ability to unlock both of those things in everyone around you. You make people feel capable of more than they thought, and that's rarer and more valuable than most people realise. The best versions of teams, projects, and companies have someone like you somewhere near the centre of them.",
    howYouWork: "You thrive in environments where collaboration is the currency. You're at your best when you're connecting people, ideas, and momentum — and at your worst when you're isolated or working in a silo. You need people the way some people need quiet.",
    adjectives: ["Magnetic", "Intuitive", "Deep"],
    blindSpot: "Unlocks everyone around them but rarely stops to invest in themselves.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Oprah Winfrey", reason: "Catalyses breakthroughs through deep listening and quiet intuition." },
      { name: "Richard Branson", reason: "Turns people's belief in the impossible into companies." },
      { name: "LeBron James", reason: "Makes every team he joins perform beyond what anyone expected." },
    ],
  },
  "Bold Catalyst": {
    tagline: "You don't just raise the energy in a room. You change what the room believes is possible.",
    description: "You operate through people. Your superpower isn't an idea or a skill — it's your ability to unlock both of those things in everyone around you. You make people feel capable of more than they thought, and that's rarer and more valuable than most people realise. The best versions of teams, projects, and companies have someone like you somewhere near the centre of them.",
    howYouWork: "You thrive in environments where collaboration is the currency. You're at your best when you're connecting people, ideas, and momentum — and at your worst when you're isolated or working in a silo. You need people the way some people need quiet.",
    adjectives: ["Electric", "Charismatic", "Visionary"],
    blindSpot: "So focused on what's possible that they underestimate what's actually hard.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Oprah Winfrey", reason: "Electric in any room — changes what people believe is possible for themselves." },
      { name: "Richard Branson", reason: "Turns people's belief in the impossible into companies." },
      { name: "LeBron James", reason: "Makes every team he joins perform beyond what anyone expected." },
    ],
  },
  "Grounded Catalyst": {
    tagline: "You don't just raise the energy in a room. You change what the room believes is possible.",
    description: "You operate through people. Your superpower isn't an idea or a skill — it's your ability to unlock both of those things in everyone around you. You make people feel capable of more than they thought, and that's rarer and more valuable than most people realise. The best versions of teams, projects, and companies have someone like you somewhere near the centre of them.",
    howYouWork: "You thrive in environments where collaboration is the currency. You're at your best when you're connecting people, ideas, and momentum — and at your worst when you're isolated or working in a silo. You need people the way some people need quiet.",
    adjectives: ["Warm", "Consistent", "Inspiring"],
    blindSpot: "So invested in the team's success that they downplay their own contribution.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Oprah Winfrey", reason: "Consistently catalyses growth in people through warmth and grounded presence." },
      { name: "Richard Branson", reason: "Turns people's belief in the impossible into companies." },
      { name: "LeBron James", reason: "Makes every team he joins perform beyond what anyone expected." },
    ],
  },
  "Relentless Sovereign": {
    tagline: "You're hard to put in a box. That's not a coincidence.",
    description: "You don't fit neatly into one mode because you've never needed to. You can hold a vision and execute it. You can lead a room and do the quiet work. Most people develop one of these as a strength and compensate for the others — you've developed all of them, which makes you genuinely rare. People often find you difficult to read at first, and then realise that what they mistook for mystery was just range.",
    howYouWork: "You adapt to what the moment needs rather than defaulting to one style. In a crisis you're calm. In a vacuum you lead. In execution mode you deliver. The challenge isn't capability — it's deciding where to point it.",
    adjectives: ["Formidable", "Versatile", "Driven"],
    blindSpot: "Takes on everything because they can, until they're spread too thin to excel at any of it.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Barack Obama", reason: "Brought vision, execution, and humanity to the world's most complex job." },
      { name: "Rihanna", reason: "Sovereign across music, beauty, and fashion — relentlessly expanding what's possible." },
      { name: "Jeff Bezos", reason: "Held the long vision and drove the daily execution simultaneously." },
    ],
  },
  "Quiet Sovereign": {
    tagline: "You're hard to put in a box. That's not a coincidence.",
    description: "You don't fit neatly into one mode because you've never needed to. You can hold a vision and execute it. You can lead a room and do the quiet work. Most people develop one of these as a strength and compensate for the others — you've developed all of them, which makes you genuinely rare. People often find you difficult to read at first, and then realise that what they mistook for mystery was just range.",
    howYouWork: "You adapt to what the moment needs rather than defaulting to one style. In a crisis you're calm. In a vacuum you lead. In execution mode you deliver. The challenge isn't capability — it's deciding where to point it.",
    adjectives: ["Enigmatic", "Razor-sharp", "Composed"],
    blindSpot: "So self-sufficient that people don't always feel needed or invited in.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Barack Obama", reason: "Brought vision, execution, and humanity to the world's most complex job." },
      { name: "Rihanna", reason: "Moves in silence, then changes the industry entirely." },
      { name: "Jeff Bezos", reason: "Held the long vision and drove the daily execution simultaneously." },
    ],
  },
  "Bold Sovereign": {
    tagline: "You're hard to put in a box. That's not a coincidence.",
    description: "You don't fit neatly into one mode because you've never needed to. You can hold a vision and execute it. You can lead a room and do the quiet work. Most people develop one of these as a strength and compensate for the others — you've developed all of them, which makes you genuinely rare. People often find you difficult to read at first, and then realise that what they mistook for mystery was just range.",
    howYouWork: "You adapt to what the moment needs rather than defaulting to one style. In a crisis you're calm. In a vacuum you lead. In execution mode you deliver. The challenge isn't capability — it's deciding where to point it.",
    adjectives: ["Commanding", "Visionary", "Dynamic"],
    blindSpot: "Can dominate a room so naturally that collaboration becomes performance rather than partnership.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Barack Obama", reason: "Brought vision, execution, and humanity to the world's most complex job." },
      { name: "Rihanna", reason: "Commands every room and every industry she enters." },
      { name: "Jeff Bezos", reason: "Held the long vision and drove the daily execution simultaneously." },
    ],
  },
  "Grounded Sovereign": {
    tagline: "You're hard to put in a box. That's not a coincidence.",
    description: "You don't fit neatly into one mode because you've never needed to. You can hold a vision and execute it. You can lead a room and do the quiet work. Most people develop one of these as a strength and compensate for the others — you've developed all of them, which makes you genuinely rare. People often find you difficult to read at first, and then realise that what they mistook for mystery was just range.",
    howYouWork: "You adapt to what the moment needs rather than defaulting to one style. In a crisis you're calm. In a vacuum you lead. In execution mode you deliver. The challenge isn't capability — it's deciding where to point it.",
    adjectives: ["Composed", "Adaptable", "Rare"],
    blindSpot: "So balanced that they sometimes lack the single-minded intensity a moment demands.",
    compatibleWith: ["Builder", "Anchor"],
    famousPeople: [
      { name: "Barack Obama", reason: "Brought vision, execution, and humanity to the world's most complex job." },
      { name: "Rihanna", reason: "Grounded at the centre of multiple empires, built with quiet, deliberate range." },
      { name: "Jeff Bezos", reason: "Held the long vision and drove the daily execution simultaneously." },
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
