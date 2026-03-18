import { supabase, PlanType, FeatureType, ModelId } from './supabase';

export const FREE_LIMITS: Record<FeatureType, number> = {
  caption: 5,
  thumbnail: 1,
  post: 3,
  script: 3,
};

export const PLAN_MONTHLY_CREDITS: Record<Exclude<PlanType, 'free'>, number> = {
  hobby: 1500,
  pro: 4000,
};

export const CREDIT_COSTS: Record<FeatureType, Record<string, number>> = {
  caption: {
    base: 5,
    mid: 10,
    premium: 20,
  },
  post: {
    base: 10,
    mid: 20,
    premium: 40,
  },
  script: {
    base: 25,
    mid: 50,
    premium: 100,
  },
  thumbnail: {
    'base-image': 30,
    'hobby-image': 60,
    'pro-image': 100,
  },
};

export const ALLOWED_MODELS: Record<PlanType, ModelId[]> = {
  free: ['base', 'base-image'],
  hobby: ['base', 'mid', 'base-image', 'hobby-image'],
  pro: ['base', 'mid', 'premium', 'base-image', 'hobby-image', 'pro-image'],
};

export const MODEL_LABELS: Record<ModelId, string> = {
  base: 'Fast',
  mid: 'Smart',
  premium: 'Premium',
  'base-image': 'Fast',
  'hobby-image': 'Enhanced',
  'pro-image': 'Premium',
};

export const MODEL_DESCRIPTIONS: Record<ModelId, string> = {
  base: 'GPT-4o-mini — quick results',
  mid: 'Claude Haiku — better quality',
  premium: 'Claude Sonnet — best quality',
  'base-image': 'Stable Diffusion',
  'hobby-image': 'SD Enhanced',
  'pro-image': 'Premium image model',
};

export const MODEL_PLAN_REQUIRED: Record<ModelId, PlanType> = {
  base: 'free',
  mid: 'hobby',
  premium: 'pro',
  'base-image': 'free',
  'hobby-image': 'hobby',
  'pro-image': 'pro',
};

export function getCreditCost(feature: FeatureType, model: ModelId): number {
  return CREDIT_COSTS[feature]?.[model] ?? 0;
}

export function canAccessModel(plan: PlanType, model: ModelId): boolean {
  return ALLOWED_MODELS[plan].includes(model);
}

export function getDefaultModel(feature: FeatureType, plan: PlanType): ModelId {
  if (feature === 'thumbnail') {
    if (plan === 'pro') return 'pro-image';
    if (plan === 'hobby') return 'base-image';
    return 'base-image';
  }
  if (plan === 'pro') return 'base';
  if (plan === 'hobby') return 'base';
  return 'base';
}

export async function getFreeUsageCount(userId: string, feature: FeatureType): Promise<number> {
  const { data } = await supabase
    .from('free_usage')
    .select('usage_count')
    .eq('user_id', userId)
    .eq('feature_type', feature)
    .maybeSingle();
  return data?.usage_count ?? 0;
}

export async function incrementFreeUsage(userId: string, feature: FeatureType): Promise<void> {
  const { data: existing } = await supabase
    .from('free_usage')
    .select('id, usage_count')
    .eq('user_id', userId)
    .eq('feature_type', feature)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('free_usage')
      .update({ usage_count: existing.usage_count + 1, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  } else {
    await supabase.from('free_usage').insert({
      user_id: userId,
      feature_type: feature,
      usage_count: 1,
    });
  }
}

export async function deductCredits(userId: string, currentCredits: number, cost: number): Promise<boolean> {
  if (currentCredits < cost) return false;
  const { error } = await supabase
    .from('profiles')
    .update({ credits_remaining: currentCredits - cost })
    .eq('id', userId);
  return !error;
}

export async function logUsage(
  userId: string,
  feature: FeatureType,
  model: ModelId,
  creditsUsed: number,
): Promise<void> {
  await supabase.from('usage_log').insert({
    user_id: userId,
    feature_type: feature,
    model_used: model,
    credits_used: creditsUsed,
  });
}

export const TOP_UP_PACKAGES: Record<Exclude<PlanType, 'free'>, { credits: number; price: number }[]> = {
  hobby: [
    { credits: 500, price: 5 },
    { credits: 1200, price: 10 },
  ],
  pro: [
    { credits: 1000, price: 5 },
    { credits: 3000, price: 12 },
  ],
};
