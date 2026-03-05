import { useState } from 'react';
import { ScrollText, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCredits } from '../../hooks/useCredits';
import { supabase } from '../../lib/supabase';
import { ScriptForm } from './ScriptForm';
import { ScriptResult } from './ScriptResult';
import { ScriptFormValues, ScriptVariation, ScriptLength, CREDIT_COSTS } from './types';

interface ScriptGeneratorProps {
  onRequestAuth: (message?: string) => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function ScriptGenerator({ onRequestAuth }: ScriptGeneratorProps) {
  const { user, profile } = useAuth();
  const { credits, hasEnoughCredits, deductCredits } = useCredits();
  const [loading, setLoading] = useState(false);
  const [cuttingDown, setCuttingDown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variations, setVariations] = useState<ScriptVariation[]>([]);
  const [lastFormValues, setLastFormValues] = useState<ScriptFormValues | null>(null);

  const handleGenerate = async (values: ScriptFormValues) => {
    if (!user) {
      onRequestAuth('Sign in to generate scripts');
      return;
    }

    const cost = CREDIT_COSTS[values.length] * values.variations;
    if (!hasEnoughCredits(cost)) {
      setError(`Not enough credits. You need ${cost} credits but have ${credits}.`);
      return;
    }

    setLoading(true);
    setError(null);
    setLastFormValues(values);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-script`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: values.platform,
          topic: values.topic,
          targetAudience: values.targetAudience,
          tone: values.tone,
          length: values.length,
          cta: values.cta,
          variations: values.variations,
          inspirationUrls: values.inspirationUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate script');
      }

      const generatedVariations: ScriptVariation[] = data.variations;
      setVariations(generatedVariations);

      const deducted = await deductCredits(cost);
      if (!deducted) {
        console.warn('Credit deduction failed silently');
      }

      if (profile) {
        await supabase.from('scripts').insert({
          user_id: profile.id,
          platform: values.platform,
          topic: values.topic,
          target_audience: values.targetAudience,
          tone: values.tone,
          length: values.length,
          cta: values.cta,
          variations: generatedVariations,
          credits_used: cost,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCutDown = async (script: ScriptVariation, targetLength: ScriptLength) => {
    if (!user) return;

    setCuttingDown(true);
    setError(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-script`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cutDown: true,
          existingScript: JSON.stringify(script),
          length: targetLength,
          platform: lastFormValues?.platform || 'youtube',
          topic: lastFormValues?.topic || '',
          targetAudience: lastFormValues?.targetAudience || '',
          tone: lastFormValues?.tone || 'educational',
          variations: 1,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to cut down script');
      }

      const cutVariation: ScriptVariation = data.variations[0];
      setVariations((prev) =>
        prev.map((v) => (v === script ? cutVariation : v))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cut down script');
    } finally {
      setCuttingDown(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl">
            <ScrollText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Script Generator</h1>
            <p className="text-sm text-gray-500">Generate video scripts for any platform</p>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">{credits} credits</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit">
          <ScriptForm
            onSubmit={handleGenerate}
            loading={loading}
            credits={credits}
          />
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="relative mb-4">
                <div className="w-12 h-12 border-4 border-blue-100 rounded-full" />
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
              </div>
              <p className="text-sm font-medium text-gray-600">Writing your script...</p>
              <p className="text-xs text-gray-400 mt-1">This may take a moment</p>
            </div>
          )}

          {!loading && variations.length > 0 && (
            <ScriptResult
              variations={variations}
              onCutDown={handleCutDown}
              cuttingDown={cuttingDown}
            />
          )}

          {!loading && variations.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                <ScrollText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600">Your script will appear here</p>
              <p className="text-xs text-gray-400 mt-1">Fill in the form and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
