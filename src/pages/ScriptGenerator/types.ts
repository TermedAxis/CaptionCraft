export type Platform = 'youtube' | 'instagram_reels' | 'tiktok' | 'youtube_shorts';
export type ScriptLength = 'very_short' | 'short' | 'medium' | 'long' | 'very_long';
export type ScriptTone = 'educational' | 'storytelling' | 'entertaining' | 'professional';

export interface ScriptMainPoint {
  title: string;
  content: string;
}

export interface ScriptVariation {
  hook: string;
  intro: string;
  mainPoints: ScriptMainPoint[];
  cta: string;
  estimatedDuration: string;
  wordCount: number;
}

export interface ScriptFormValues {
  platform: Platform;
  topic: string;
  targetAudience: string;
  length: ScriptLength;
  tone: ScriptTone;
  cta: string;
  variations: number;
  inspirationUrls: string[];
}

export const CREDIT_COSTS: Record<ScriptLength, number> = {
  very_short: 20,
  short: 20,
  medium: 30,
  long: 40,
  very_long: 40,
};

export const LENGTH_LABELS: Record<ScriptLength, string> = {
  very_short: 'Very Short',
  short: 'Short (30–60 sec)',
  medium: 'Medium (5–10 min)',
  long: 'Long (10–15 min)',
  very_long: 'Very Long (20–25 min)',
};
