import { useState } from 'react';
import { ImageIcon, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCredits } from '../../hooks/useCredits';
import { supabase } from '../../lib/supabase';
import { ThumbnailForm } from './ThumbnailForm';
import { ThumbnailResult } from './ThumbnailResult';
import { ThumbnailFormValues, THUMBNAIL_CREDIT_COST } from './types';

interface ThumbnailGeneratorProps {
  onRequestAuth: (message?: string) => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function ThumbnailGenerator({ onRequestAuth }: ThumbnailGeneratorProps) {
  const { user, profile } = useAuth();
  const { credits, hasEnoughCredits, deductCredits } = useCredits();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [lastFormValues, setLastFormValues] = useState<ThumbnailFormValues | null>(null);

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
        inspirationUrls: values.inspirationUrls,
        inspirationImages: values.inspirationImages,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error || 'Failed to generate thumbnails');
    }

    return data.imageUrls;
  };

  const handleGenerate = async (values: ThumbnailFormValues) => {
    if (!user) {
      onRequestAuth('Sign in to generate thumbnails');
      return;
    }

    if (!hasEnoughCredits(THUMBNAIL_CREDIT_COST)) {
      setError(`Not enough credits. You need ${THUMBNAIL_CREDIT_COST} credits but have ${credits}.`);
      return;
    }

    setLoading(true);
    setError(null);
    setLastFormValues(values);

    try {
      const urls = await callGenerate(values);
      setImageUrls(urls);

      await deductCredits(THUMBNAIL_CREDIT_COST);

      if (profile) {
        await supabase.from('thumbnails').insert({
          user_id: profile.id,
          topic: values.topic,
          style: values.style,
          emotion: values.emotion,
          color_theme: values.colorTheme,
          text_overlay: values.textOverlay,
          image_urls: urls,
          credits_used: THUMBNAIL_CREDIT_COST,
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
    if (!hasEnoughCredits(THUMBNAIL_CREDIT_COST)) {
      setError(`Not enough credits. You need ${THUMBNAIL_CREDIT_COST} credits but have ${credits}.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const urls = await callGenerate(lastFormValues);
      setImageUrls(urls);
      await deductCredits(THUMBNAIL_CREDIT_COST);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl">
            <ImageIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thumbnail Generator</h1>
            <p className="text-sm text-gray-500">Generate YouTube thumbnails that get clicks</p>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">{credits} credits</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 h-fit">
          <ThumbnailForm
            onSubmit={handleGenerate}
            loading={loading}
            credits={credits}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
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
              <p className="text-sm font-medium text-gray-600">Generating thumbnails...</p>
              <p className="text-xs text-gray-400 mt-1">Creating 3 options for you</p>
            </div>
          )}

          {!loading && imageUrls.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <ThumbnailResult
                imageUrls={imageUrls}
                onRegenerate={handleRegenerate}
                loading={loading}
              />
            </div>
          )}

          {!loading && imageUrls.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600">Your thumbnails will appear here</p>
              <p className="text-xs text-gray-400 mt-1">3 options will be generated at once</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
