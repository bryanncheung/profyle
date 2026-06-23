export type LoveArchetype = "Flame" | "Harbour" | "Wanderer" | "Architect" | "Devotee" | "Mirror" | "Spark" | "Anchor";
export type LoveDimension = "Devoted" | "Guarded" | "Fierce" | "Gentle";
export type LoveAnswer = "A" | "B" | "C" | "D" | "LEFT" | "RIGHT" | "1" | "2" | "3" | "4" | "5";
export type LoveQuestionType = "binary" | "bare" | "pill" | "slider";

export interface LoveQuestion {
  id: number;
  type: LoveQuestionType;
  text: string;
  left?: string;
  right?: string;
  options?: { A: string; B: string; C: string; D: string };
  sliderLeft?: string;
  sliderRight?: string;
}

export interface LoveAttributes {
  intimacy: number;
  expressiveness: number;
  independence: number;
  devotion: number;
  openness: number;
}

export interface LoveResult {
  dimension: LoveDimension;
  archetype: LoveArchetype;
  fullTitle: string;
  tagline: string;
  whoYouAre: string;
  howYouLove: string;
  adjectives: [string, string, string];
  blindSpot: string;
  compatibleWith: [LoveArchetype, LoveArchetype];
  famousPeople: Array<{ name: string; reason: string }>;
  attributes: LoveAttributes;
  compatCopy: [string, string];
}

export interface LoveSubmitPayload {
  answers: Record<number, LoveAnswer>;
}
