export type AnswerOption = "A" | "B" | "C" | "D";

export type QuestionTag = "A" | "P" | "I";

export type QuestionFormat = "standard" | "binary" | "pill" | "bare" | "slider";

export interface Question {
  id: number;
  tag: QuestionTag;
  type: string;
  text: string;
  options: Record<AnswerOption, string>;
  format?: QuestionFormat;
  binaryLeft?: AnswerOption;
  binaryRight?: AnswerOption;
}

export type Archetype = "Builder" | "Disruptor" | "Anchor" | "Catalyst" | "Sovereign";
export type Prefix = "Relentless" | "Quiet" | "Bold" | "Grounded";

export interface ArchetypeScores {
  V: number; // Vision
  E: number; // Execution
  I: number; // Individual
  C: number; // Collective
}

export interface PrefixScores {
  R: number; // Relentless
  Q: number; // Quiet
  B: number; // Bold
  G: number; // Grounded
}

export interface AttributeScores {
  execution: number;
  vision: number;
  independence: number;
  collaboration: number;
  adaptability: number;
}

export interface QuizResult {
  prefix: Prefix;
  archetype: Archetype;
  fullTitle: string; // e.g. "The Quiet Builder"
  tagline: string;
  description: string;
  howYouWork: string;
  adjectives: [string, string, string];
  blindSpot: string;
  compatibleWith: [Archetype, Archetype];
  famousPeople: Array<{ name: string; reason: string }>;
  attributes: AttributeScores;
  industryAnswers: AnswerOption[];
}

export interface SubmitPayload {
  answers: Record<number, AnswerOption>; // questionId → answer
}
