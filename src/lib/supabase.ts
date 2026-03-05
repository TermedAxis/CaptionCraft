import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  subscription_tier: 'free' | 'paid';
  credits: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  subscription_ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Script = {
  id: string;
  user_id: string;
  platform: string;
  topic: string;
  target_audience: string;
  tone: string;
  length: string;
  cta: string;
  variations: object[];
  credits_used: number;
  created_at: string;
};

export type Thumbnail = {
  id: string;
  user_id: string;
  topic: string;
  style: string;
  emotion: string;
  color_theme: string;
  text_overlay: string;
  image_urls: string[];
  credits_used: number;
  created_at: string;
};

export type Caption = {
  id: string;
  user_id: string;
  platform: string;
  content_type: string;
  topic: string;
  tone: string;
  caption_text: string;
  hashtags: string | null;
  created_at: string;
};

export type UsageTracking = {
  id: string;
  user_id: string;
  date: string;
  caption_count: number;
  created_at: string;
  updated_at: string;
};
