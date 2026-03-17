/*
  # Economics System Migration

  ## Summary
  Implements a full credit-based subscription economy.

  ## Changes to Existing Tables

  ### profiles
  - Add `plan_type` (free | hobby | pro) replaces subscription_tier logic
  - Add `credits_remaining` (integer) — monthly rolling credits
  - Add `billing_cycle_end` (timestamptz) — when current cycle resets
  - Add `subscription_id` (text) — external billing reference

  ## New Tables

  ### usage_log
  Tracks every generation attempt for billing/analytics.
  - user_id, feature_type, model_used, credits_used, created_at

  ### free_usage
  Tracks per-feature lifetime usage for free-tier users.
  - user_id, feature_type, usage_count

  ## Security
  - RLS enabled on all new tables
  - Users can only read/write their own rows
*/

-- 1. Extend profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'plan_type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plan_type text NOT NULL DEFAULT 'free'
      CHECK (plan_type IN ('free', 'hobby', 'pro'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'credits_remaining'
  ) THEN
    ALTER TABLE profiles ADD COLUMN credits_remaining integer NOT NULL DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'billing_cycle_end'
  ) THEN
    ALTER TABLE profiles ADD COLUMN billing_cycle_end timestamptz DEFAULT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_id text DEFAULT NULL;
  END IF;
END $$;

-- 2. Create usage_log table
CREATE TABLE IF NOT EXISTS usage_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  feature_type text NOT NULL CHECK (feature_type IN ('caption', 'post', 'script', 'thumbnail')),
  model_used text NOT NULL,
  credits_used integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage log"
  ON usage_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage log"
  ON usage_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS usage_log_user_id_idx ON usage_log(user_id);
CREATE INDEX IF NOT EXISTS usage_log_created_at_idx ON usage_log(created_at);

-- 3. Create free_usage table
CREATE TABLE IF NOT EXISTS free_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  feature_type text NOT NULL CHECK (feature_type IN ('caption', 'post', 'script', 'thumbnail')),
  usage_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_type)
);

ALTER TABLE free_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own free usage"
  ON free_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own free usage"
  ON free_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own free usage"
  ON free_usage FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS free_usage_user_id_idx ON free_usage(user_id);
