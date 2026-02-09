/*
  # CaptionCraft Database Schema

  ## Overview
  Complete database schema for CaptionCraft - AI-powered social media caption generator

  ## New Tables
  
  ### 1. `profiles`
  User profile and subscription information
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `subscription_tier` (text) - 'free' or 'paid'
  - `stripe_customer_id` (text) - Stripe customer reference
  - `stripe_subscription_id` (text) - Stripe subscription reference
  - `subscription_status` (text) - 'active', 'canceled', 'past_due', null
  - `subscription_ends_at` (timestamptz) - When subscription ends
  - `created_at` (timestamptz) - Account creation time
  - `updated_at` (timestamptz) - Last update time

  ### 2. `captions`
  Saved caption generations
  - `id` (uuid, primary key) - Unique caption ID
  - `user_id` (uuid, foreign key) - Links to profiles
  - `platform` (text) - Social media platform
  - `content_type` (text) - Type of content
  - `topic` (text) - Caption topic/context
  - `tone` (text) - Selected tone
  - `caption_text` (text) - Generated caption
  - `hashtags` (text) - Generated hashtags
  - `created_at` (timestamptz) - Generation time

  ### 3. `usage_tracking`
  Daily usage tracking for free tier limits
  - `id` (uuid, primary key) - Unique tracking ID
  - `user_id` (uuid, foreign key) - Links to profiles
  - `date` (date) - Usage date
  - `caption_count` (integer) - Number of captions generated
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated access required for all operations
  
  ## Indexes
  - Index on user_id for fast queries
  - Index on date for usage tracking
  - Index on created_at for sorting
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  subscription_tier text NOT NULL DEFAULT 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  subscription_ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create captions table
CREATE TABLE IF NOT EXISTS captions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  content_type text NOT NULL,
  topic text NOT NULL,
  tone text NOT NULL,
  caption_text text NOT NULL,
  hashtags text,
  created_at timestamptz DEFAULT now()
);

-- Create usage_tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  caption_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_captions_user_id ON captions(user_id);
CREATE INDEX IF NOT EXISTS idx_captions_created_at ON captions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_captions_platform ON captions(platform);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_date ON usage_tracking(user_id, date);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE captions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Captions policies
CREATE POLICY "Users can view own captions"
  ON captions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own captions"
  ON captions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own captions"
  ON captions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON usage_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON usage_tracking FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for usage_tracking table
CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON usage_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();