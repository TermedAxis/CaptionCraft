import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function useCredits() {
  const { profile, refreshProfile } = useAuth();

  const credits = profile?.credits ?? 0;

  const hasEnoughCredits = (cost: number): boolean => {
    return credits >= cost;
  };

  const deductCredits = async (cost: number): Promise<boolean> => {
    if (!profile) return false;
    if (credits < cost) return false;

    const { error } = await supabase
      .from('profiles')
      .update({ credits: credits - cost })
      .eq('id', profile.id);

    if (error) {
      console.error('Failed to deduct credits:', error);
      return false;
    }

    await refreshProfile();
    return true;
  };

  return { credits, hasEnoughCredits, deductCredits };
}
