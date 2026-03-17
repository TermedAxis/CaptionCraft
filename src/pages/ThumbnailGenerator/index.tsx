import { useState, useEffect } from 'react';
import { Image as ImageIcon, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useCredits } from '../../hooks/useCredits';
import { supabase } from '../../lib/supabase';
import { ModelId } from '../../lib/supabase';
import { ThumbnailForm } from './ThumbnailForm';
import { ThumbnailResult } from './ThumbnailResult';
import { ThumbnailFormValues } from './types';
import { getCreditCost, FREE_LIMITS } from '../../lib/credits';

interface ThumbnailGeneratorProps {
  onRequestAuth: (message?: string) => void;
  onUpgrade: () => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function ThumbnailGenerator({ onRequestAuth, onUpgrade }: ThumbnailGeneratorProps) {
  const { user, profile } = useAuth();
  const { plan, credits, checkFreeLimit, consumeGeneration } = useCredits();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [lastFormValues, setLastFormValues] = useState<ThumbnailFormValues | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelId>('base-image');
  const [freeUsed, setFreeUsed] = useState(0);
  const [freeChecked, setFreeChecked] = useState(false);

  useEffect(() => {
    if (user && plan === 'free') {
      checkFreeLimit('thumbnail').then(({ used }) => {
        setFreeUsed(used);
        setFreeChecked(true);
      });
    } else {
      setFreeChecked(true);
    }
  }, [user, plan]);

  const freeLimit = FREE_LIMITS.thumbnail;
  const freeLimitReached = plan === 'free' && freeChecked && freeUsed >= freeLimit;
  const creditCost = plan !== 'free' ? getCreditCost('thumbnail', selectedModel) : 0;

  const callGenerate = async (values: ThumbnailFormValues): Promise<string[]> => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-thumbnail`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: values.topic,
        style: values.style,
        emotion: values.emotion,
        colorTheme: values.colorTheme,
        textOverlay: values.textOverlay,
        extraContext: values.extraContext || undefined,
        inspirationUrls: values.inspirationUrls,
        inspirationImages: values.inspirationImages,
        model: selectedModel,
      }),
    });
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || 'Failed to generate thumbnails');
    return data.imageUrls;
  };

  const handleGenerate = async (values: ThumbnailFormValues) => {
    if (!user) {
      onRequestAuth('Sign in to generate thumbnails');
      return;
    }

    if (plan === 'free') {
      const { allowed, used } = await checkFreeLimit('thumbnail');
      setFreeUsed(used);
      if (!allowed) {
        onUpgrade();
        return;
      }
    } else if (credits < creditCost) {
      setError(`Not enough credits. You need ${creditCost} but have ${credits}.`);
      return;
    }

    setLoading(true);
    setError(null);
    setLastFormValues(values);

    try {
      const urls = await callGenerate(values);
      setImageUrls(urls);

      await consumeGeneration('thumbnail', selectedModel);
      if (plan === 'free') setFreeUsed((prev) => prev + 1);

      if (profile) {
        await supabase.from('thumbnails').insert({
          user_id: profile.id,
          topic: values.topic,
          style: values.style,
          emotion: values.emotion,
          color_theme: values.colorTheme,
          text_overlay: values.textOverlay,
          image_urls: urls,
          credits_used: creditCost,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!lastFormValues) return;
    if (plan !== 'free' && credits < creditCost) {
      setError(`Not enough credits. You need ${creditCost} but have ${credits}.`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const urls = await callGenerate(lastFormValues);
      setImageUrls(urls);
      await consumeGeneration('thumbnail', selectedModel);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-bat-surface2 rounded-xl border border-bat-border">
            <ImageIcon className="w-6 h-6 text-bat-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Thumbnail Generator</h1>
            <p className="text-sm text-bat-muted">Generate YouTube thumbnails that get clicks</p>
          </div>
        </div>
        {user && plan === 'free' && freeChecked && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
            freeLimitReached
              ? 'bg-red-500/10 border border-red-500/20 text-red-400'
              : 'bg-bat-surface2 border border-bat-border text-bat-muted'
          }`}>
            <AlertCircle className="w-4 h-4" />
            <span>Free: {freeUsed}/{freeLimit} thumbnail used</span>
            {freeLimitReached && (
              <button onClick={onUpgrade} className="underline font-semibold text-red-400">Upgrade</button>
            )}
          </div>
        )}
        {user && plan !== 'free' && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-bat-surface2 border border-bat-border rounded-lg">
            <Zap className="w-4 h-4 text-bat-muted" />
            <span className="text-sm font-semibold text-bat-muted">{credits.toLocaleString()} credits</span>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="bg-bat-surface rounded-2xl border border-bat-border p-6 h-fit"
        >
          <ThumbnailForm
            onSubmit={handleGenerate}
            loading={loading}
            credits={credits}
            plan={plan}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onUpgrade={onUpgrade}
            freeLimitReached={freeLimitReached}
          />
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center justify-center py-20 text-bat-muted"
              >
                <div className="relative mb-4">
                  <div className="w-12 h-12 border-4 border-white/20 rounded-full" />
                  <div className="w-12 h-12 border-4 border-t-white border-white/20 rounded-full animate-spin absolute inset-0" />
                </div>
                <p className="text-sm font-medium text-bat-muted">Generating thumbnails...</p>
                <p className="text-xs text-bat-subtle mt-1">Creating 3 options for you</p>
              </motion.div>
            )}

            {!loading && imageUrls.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="bg-bat-surface rounded-2xl border border-bat-border p-6"
              >
                <ThumbnailResult imageUrls={imageUrls} onRegenerate={handleRegenerate} loading={loading} />
              </motion.div>
            )}

            {!loading && imageUrls.length === 0 && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="p-4 bg-bat-surface border border-bat-border rounded-2xl mb-4">
                  <ImageIcon className="w-8 h-8 text-bat-subtle" />
                </div>
                <p className="text-sm font-medium text-bat-muted">Your thumbnails will appear here</p>
                <p className="text-xs text-bat-subtle mt-1">3 options will be generated at once</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
