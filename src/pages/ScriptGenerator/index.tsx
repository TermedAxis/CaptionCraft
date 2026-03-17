import { useState, useEffect } from 'react';
import { ScrollText, Zap, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useCredits } from '../../hooks/useCredits';
import { supabase } from '../../lib/supabase';
import { ModelId } from '../../lib/supabase';
import { ScriptForm } from './ScriptForm';
import { ScriptResult } from './ScriptResult';
import { ScriptFormValues, ScriptVariation, ScriptLength } from './types';
import { getCreditCost, FREE_LIMITS } from '../../lib/credits';

interface ScriptGeneratorProps {
  onRequestAuth: (message?: string) => void;
  onUpgrade: () => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function ScriptGenerator({ onRequestAuth, onUpgrade }: ScriptGeneratorProps) {
  const { user, profile } = useAuth();
  const { plan, credits, checkFreeLimit, consumeGeneration } = useCredits();

  const [loading, setLoading] = useState(false);
  const [cuttingDown, setCuttingDown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variations, setVariations] = useState<ScriptVariation[]>([]);
  const [lastFormValues, setLastFormValues] = useState<ScriptFormValues | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelId>('base');
  const [freeUsed, setFreeUsed] = useState(0);
  const [freeChecked, setFreeChecked] = useState(false);

  useEffect(() => {
    if (user && plan === 'free') {
      checkFreeLimit('script').then(({ used }) => {
        setFreeUsed(used);
        setFreeChecked(true);
      });
    } else {
      setFreeChecked(true);
    }
  }, [user, plan]);

  const freeLimit = FREE_LIMITS.script;
  const freeLimitReached = plan === 'free' && freeChecked && freeUsed >= freeLimit;

  const handleGenerate = async (values: ScriptFormValues) => {
    if (!user) {
      onRequestAuth('Sign in to generate scripts');
      return;
    }

    if (plan === 'free') {
      const { allowed, used } = await checkFreeLimit('script');
      setFreeUsed(used);
      if (!allowed) {
        onUpgrade();
        return;
      }
    } else {
      const cost = getCreditCost('script', selectedModel) * values.variations;
      if (credits < cost) {
        setError(`Not enough credits. You need ${cost} but have ${credits}.`);
        return;
      }
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
          extraContext: values.extraContext || undefined,
          model: selectedModel,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Failed to generate script');

      const generatedVariations: ScriptVariation[] = data.variations;
      setVariations(generatedVariations);

      await consumeGeneration('script', selectedModel);
      if (plan === 'free') setFreeUsed((prev) => prev + 1);

      if (profile) {
        const cost = plan === 'free' ? 0 : getCreditCost('script', selectedModel) * values.variations;
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
      if (!response.ok || data.error) throw new Error(data.error || 'Failed to cut down script');
      const cutVariation: ScriptVariation = data.variations[0];
      setVariations((prev) => prev.map((v) => (v === script ? cutVariation : v)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cut down script');
    } finally {
      setCuttingDown(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-bat-surface2 border border-bat-border rounded-xl">
            <ScrollText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Script Generator</h1>
            <p className="text-sm text-bat-muted">Generate video scripts for any platform</p>
          </div>
        </div>
        {user && plan === 'free' && freeChecked && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
            freeLimitReached
              ? 'bg-red-500/10 border border-red-500/20 text-red-400'
              : 'bg-bat-surface2 border border-bat-border text-bat-muted'
          }`}>
            <AlertCircle className="w-4 h-4" />
            <span>Free: {freeUsed}/{freeLimit} scripts used</span>
            {freeLimitReached && (
              <button onClick={onUpgrade} className="underline font-semibold text-bat-muted">Upgrade</button>
            )}
          </div>
        )}
        {user && plan !== 'free' && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-bat-surface2 border border-bat-border rounded-lg">
            <Zap className="w-4 h-4 text-bat-muted" />
            <span className="text-sm font-semibold text-bat-muted">{credits.toLocaleString()} credits</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
        <div className="bg-bat-surface border border-bat-border rounded-2xl p-6 h-fit">
          <ScriptForm
            onSubmit={handleGenerate}
            loading={loading}
            credits={credits}
            plan={plan}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onUpgrade={onUpgrade}
            freeLimitReached={freeLimitReached}
          />
        </div>

        <div className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </motion.div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-bat-muted">
              <div className="relative mb-4">
                <div className="w-12 h-12 border-4 border-white/20 rounded-full" />
                <div className="w-12 h-12 border-4 border-t-white border-white/20 rounded-full animate-spin absolute inset-0" />
              </div>
              <p className="text-sm font-medium text-bat-muted">Writing your script...</p>
              <p className="text-xs text-bat-subtle mt-1">This may take a moment</p>
            </div>
          )}

          {!loading && variations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ScriptResult variations={variations} onCutDown={handleCutDown} cuttingDown={cuttingDown} />
            </motion.div>
          )}

          {!loading && variations.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 bg-bat-surface border border-bat-border rounded-2xl mb-4">
                <ScrollText className="w-8 h-8 text-bat-subtle" />
              </div>
              <p className="text-sm font-medium text-bat-muted">Your script will appear here</p>
              <p className="text-xs text-bat-subtle mt-1">Fill in the form and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
