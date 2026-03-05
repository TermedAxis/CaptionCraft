export type ThumbnailStyle = 'bold_youtube' | 'bright_creator' | 'minimal' | 'dramatic';
export type ThumbnailEmotion = 'excited' | 'shock' | 'curiosity';

export const THUMBNAIL_CREDIT_COST = 30;

export const STYLE_OPTIONS: { value: ThumbnailStyle; label: string; desc: string }[] = [
  { value: 'bold_youtube', label: 'Bold YouTube', desc: 'High contrast, dramatic' },
  { value: 'bright_creator', label: 'Bright Creator', desc: 'Warm, energetic' },
  { value: 'minimal', label: 'Minimal', desc: 'Clean, elegant' },
  { value: 'dramatic', label: 'Dramatic', desc: 'Cinematic, dark' },
];

export const EMOTION_OPTIONS: { value: ThumbnailEmotion; label: string }[] = [
  { value: 'excited', label: 'Excited' },
  { value: 'shock', label: 'Shock' },
  { value: 'curiosity', label: 'Curiosity' },
];

export interface ThumbnailFormValues {
  topic: string;
  style: ThumbnailStyle;
  emotion: ThumbnailEmotion;
  colorTheme: string;
  textOverlay: string;
  inspirationUrls: string[];
  inspirationImages: string[];
}
