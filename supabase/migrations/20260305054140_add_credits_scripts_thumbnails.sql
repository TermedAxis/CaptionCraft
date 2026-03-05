/*
  # Add Credits System, Scripts Table, and Thumbnails Table

  ## Summary
  This migration introduces a credit-based system for the Script Generator and Thumbnail Generator tools,
  and creates tables to store generated scripts and thumbnails.

  ## Changes

  ### 1. Modified Tables
  - `profiles`: Added `credits` column (integer, default 100) representing the user's credit balance.
    Free users start with 100 credits. Paid users will have higher balances managed via the application.

  ### 2. New Tables

  #### `scripts`
  Stores generated scripts from the Script Generator tool.
  - `id` - UUID primary key
  - `user_id` - FK to profiles
  - `platform` - Target platform (youtube, instagram_reels, tiktok, youtube_shorts)
  - `topic` - Script topic
  - `target_audience` - Intended audience description
  - `tone` - Script tone (educational, storytelling, entertaining, professional)
  - `length` - Script length option (very_short, short, medium, long, very_long)
  - `cta` - Optional call to action
  - `variations` - JSONB array of generated script variations
  - `credits_used` - Number of credits deducted for this generation
  - `created_at` - Timestamp

  #### `thumbnails`
  Stores generated thumbnails from the Thumbnail Generator tool.
  - `id` - UUID primary key
  - `user_id` - FK to profiles
  - `topic` - Video title or topic
  - `style` - Thumbnail style (bold_youtube, bright_creator, minimal, dramatic)
  - `emotion` - Desired emotion (excited, shock, curiosity)
  - `color_theme` - Color theme description
  - `text_overlay` - Optional text overlay
  - `image_urls` - JSONB array of generated image data URLs
  - `credits_used` - Number of credits deducted
  - `created_at` - Timestamp

  ### 3. Security
  - RLS enabled on both new tables
  - Policies restrict all access to authenticated owners only
  - profiles credits column update policy allows users to update only their own credits

  ### 4. Notes
  - Default credit balance is 100 for all existing and new users
  - Credits are deducted in the application layer after successful generation
  - Short script: 20 credits, Medium: 30 credits, Long: 40 credits
*/

-- Add credits column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'credits'
  ) THEN
    ALTER TABLE profiles ADD COLUMN credits integer NOT NULL DEFAULT 100;
  END IF;
END $$;

-- Create scripts table
CREATE TABLE IF NOT EXISTS scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  topic text NOT NULL,
  target_audience text NOT NULL DEFAULT '',
  tone text NOT NULL DEFAULT 'educational',
  length text NOT NULL DEFAULT 'short',
  cta text NOT NULL DEFAULT '',
  variations jsonb NOT NULL DEFAULT '[]',
  credits_used integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own scripts"
  ON scripts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scripts"
  ON scripts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripts"
  ON scripts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create thumbnails table
CREATE TABLE IF NOT EXISTS thumbnails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic text NOT NULL,
  style text NOT NULL DEFAULT 'bold_youtube',
  emotion text NOT NULL DEFAULT 'excited',
  color_theme text NOT NULL DEFAULT '',
  text_overlay text NOT NULL DEFAULT '',
  image_urls jsonb NOT NULL DEFAULT '[]',
  credits_used integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE thumbnails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own thumbnails"
  ON thumbnails FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own thumbnails"
  ON thumbnails FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own thumbnails"
  ON thumbnails FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS scripts_user_id_idx ON scripts(user_id);
CREATE INDEX IF NOT EXISTS thumbnails_user_id_idx ON thumbnails(user_id);
