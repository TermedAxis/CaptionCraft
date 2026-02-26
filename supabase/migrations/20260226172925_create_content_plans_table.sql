/*
  # Create content_plans table

  1. New Tables
    - `content_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `content_type` (text) - 'post' | 'carousel' | 'video'
      - `platform` (text) - target social platform
      - `topic` (text) - content topic/theme
      - `tone` (text) - writing tone
      - `result` (jsonb) - AI-generated content stored as JSON
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `content_plans` table
    - Users can only read, insert, and delete their own content plans
*/

CREATE TABLE IF NOT EXISTS content_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('post', 'carousel', 'video')),
  platform text NOT NULL,
  topic text NOT NULL,
  tone text NOT NULL,
  result jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_plans_user_id_idx ON content_plans(user_id);
CREATE INDEX IF NOT EXISTS content_plans_created_at_idx ON content_plans(created_at DESC);

ALTER TABLE content_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own content plans"
  ON content_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content plans"
  ON content_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own content plans"
  ON content_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
