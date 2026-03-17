import { useAuth } from '../contexts/AuthContext';
import { FeatureType, ModelId } from '../lib/supabase';
import {
  deductCredits as deductCreditsHelper,
  logUsage,
  getFreeUsageCount,
  incrementFreeUsage,
  getCreditCost,
  FREE_LIMITS,
} from '../lib/credits';

export function useCredits() {
  const { profile, refreshProfile } = useAuth();

  const plan = profile?.plan_type ?? 'free';
  const credits = profile?.credits_remaining ?? 0;

  const checkFreeLimit = async (feature: FeatureType): Promise<{ allowed: boolean; used: number; limit: number }> => {
    if (!profile) return { allowed: false, used: 0, limit: FREE_LIMITS[feature] };
    const used = await getFreeUsageCount(profile.id, feature);
    const limit = FREE_LIMITS[feature];
    return { allowed: used < limit, used, limit };
  };

  const hasEnoughCredits = (cost: number): boolean => credits >= cost;

  const consumeGeneration = async (feature: FeatureType, model: ModelId): Promise<boolean> => {
    if (!profile) return false;

    if (plan === 'free') {
      await incrementFreeUsage(profile.id, feature);
      await logUsage(profile.id, feature, model, 0);
      await refreshProfile();
      return true;
    }

    const cost = getCreditCost(feature, model);
    if (credits < cost) return false;

    const success = await deductCreditsHelper(profile.id, credits, cost);
    if (!success) return false;

    await logUsage(profile.id, feature, model, cost);
    await refreshProfile();
    return true;
  };

  const deductCredits = async (cost: number): Promise<boolean> => {
    if (!profile) return false;
    if (credits < cost) return false;
    const success = await deductCreditsHelper(profile.id, credits, cost);
    if (success) await refreshProfile();
    return success;
  };

  return {
    plan,
    credits,
    hasEnoughCredits,
    consumeGeneration,
    checkFreeLimit,
    deductCredits,
    FREE_LIMITS,
  };
}
