export type ContentTab = "post" | "carousel" | "video" | "thread";

export interface ContentFormValues {
  platform: string;
  topic: string;
  tone: string;
  targetAudience: string;
  goal: string;
  extraContext: string;
}

export interface PostResult {
  title: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string;
  bestTimeToPost: string;
  contentTips: string[];
}

export interface CarouselSlide {
  slideNumber: number;
  heading: string;
  bulletPoints: string[];
  visualNote: string;
}

export interface CarouselResult {
  title: string;
  coverSlide: { headline: string; subtext: string };
  slides: CarouselSlide[];
  closingSlide: { message: string; cta: string };
  caption: string;
  hashtags: string;
  designTips: string[];
}

export interface VideoScriptSegment {
  timestamp: string;
  action: string;
  voiceover: string;
}

export interface VideoResult {
  title: string;
  duration: string;
  hook: string;
  script: VideoScriptSegment[];
  bRollSuggestions: string[];
  textOverlays: string[];
  music: string;
  caption: string;
  hashtags: string;
  productionTips: string[];
}

export interface ThreadTweet {
  number: number;
  content: string;
  charCount: number;
}

export interface ThreadResult {
  title: string;
  hook: string;
  tweets: ThreadTweet[];
  closingTweet: string;
  threadSummary: string;
  engagementTips: string[];
  hashtags: string;
}
