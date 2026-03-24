import { useState, useEffect, KeyboardEvent } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { ModelSelector } from '../components/ModelSelector';
import { Sparkles, Copy, Check, AlertCircle, Loader2, Hash, X, Zap, Wand2 } from 'lucide-react';
import { ModelId } from '../lib/supabase';
import { getCreditCost, FREE_LIMITS } from '../lib/credits';

type CaptionVariation = {
  version: string;
  caption: string;
  hashtags: string;
};

interface GeneratorProps {
  onRequestAuth: (message?: string) => void;
  onUpgrade: () => void;
}

const PLATFORMS = ['Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'YouTube Shorts'];
const CONTENT_TYPES = ['Post', 'Reel', 'Carousel', 'Short'];
const TONES = ['Professional', 'Casual', 'Funny', 'Bold', 'Luxury', 'Educational'];
const EMOJI_LEVELS = [
  { value: 'none', label: 'None' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
];

export function Generator({ onRequestAuth, onUpgrade }: GeneratorProps) {
  const { user, profile } = useAuth();
  const { plan, credits, checkFreeLimit, consumeGeneration } = useCredits();

  const [platform, setPlatform] = useState('instagram');
  const [contentType, setContentType] = useState('post');
  const [topic, setTopic] = useState('');
  const [hook, setHook] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('casual');
  const [cta, setCta] = useState('');
  const [emojiLevel, setEmojiLevel] = useState('medium');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [customHashtags, setCustomHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelId>('base');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [variations, setVariations] = useState<CaptionVariation[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [freeUsed, setFreeUsed] = useState(0);
  const [freeChecked, setFreeChecked] = useState(false);

  useEffect(() => {
    if (user && plan === 'free') {
      checkFreeLimit('caption').then(({ used }) => {
        setFreeUsed(used);
        setFreeChecked(true);
      });
    } else {
      setFreeChecked(true);
    }
  }, [user, plan]);

  const creditCost = plan !== 'free' ? getCreditCost('caption', selectedModel) : 0;
  const freeLimit = FREE_LIMITS.caption;
  const freeLimitReached = plan === 'free' && freeChecked && freeUsed >= freeLimit;
  const canAfford = plan === 'free' ? !freeLimitReached : credits >= creditCost;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      onRequestAuth('Sign in to generate captions');
      return;
    }

    if (plan === 'free') {
      const { allowed, used } = await checkFreeLimit('caption');
      setFreeUsed(used);
      if (!allowed) {
        onUpgrade();
        return;
      }
    } else if (credits < creditCost) {
      setError(`Not enough credits. You need ${creditCost} but have ${credits}.`);
      return;
    }

    setError('');
    setVariations([]);
    setLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-caption`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          contentType,
          topic,
          hook: hook || undefined,
          targetAudience: targetAudience || undefined,
          tone,
          cta: cta || undefined,
          emojiLevel,
          includeHashtags,
          customHashtags: customHashtags.length > 0 ? customHashtags : undefined,
          model: selectedModel,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to generate captions');

      setVariations(result.variations);
      await consumeGeneration('caption', selectedModel);
      if (plan === 'free') setFreeUsed((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate captions');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (variation: CaptionVariation) => {
    if (!user || !profile) {
      onRequestAuth('Sign in to save captions');
      return;
    }
    try {
      await supabase.from('captions').insert({
        user_id: profile.id,
        platform,
        content_type: contentType,
        topic,
        tone,
        caption_text: variation.caption,
        hashtags: variation.hashtags,
      });
      alert('Caption saved successfully!');
    } catch {
      alert('Failed to save caption');
    }
  };

  const addHashtag = (value: string) => {
    const cleaned = value.trim().replace(/^#+/, '');
    if (cleaned && !customHashtags.includes(cleaned)) {
      setCustomHashtags([...customHashtags, cleaned]);
    }
    setHashtagInput('');
  };

  const handleHashtagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addHashtag(hashtagInput);
    }
  };

  const removeHashtag = (tag: string) => {
    setCustomHashtags(customHashtags.filter((t) => t !== tag));
  };

  const handleCopy = async (index: number, text: string, hashtags: string) => {
    const fullText = hashtags ? `${text}\n\n${hashtags}` : text;
    await navigator.clipboard.writeText(fullText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-950 rounded-xl">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Caption Creator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create engaging social media captions in seconds</p>
          </div>
        </div>
        {user && plan === 'free' && freeChecked && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
            freeLimitReached ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
          }`}>
            <AlertCircle className="w-4 h-4" />
            <span>Free: {freeUsed}/{freeLimit} captions used</span>
            {freeLimitReached && (
              <button onClick={onUpgrade} className="underline font-semibold ml-1">Upgrade</button>
            )}
          </div>
        )}
        {user && plan !== 'free' && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{credits.toLocaleString()} credits</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[480px_1fr] gap-8 items-start">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 h-fit">
          {error && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm mb-5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2.5">Platform</label>
              <div className="grid grid-cols-2 gap-2.5">
                {PLATFORMS.map((p) => {
                  const val = p.toLowerCase().replace(' ', '-').replace(' shorts', '');
                  const actualVal = p === 'YouTube Shorts' ? 'youtube' : p.toLowerCase();
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(actualVal)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition truncate ${
                        platform === actualVal
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2.5">Content Type</label>
              <div className="grid grid-cols-2 gap-2.5">
                {CONTENT_TYPES.map((ct) => {
                  const val = ct.toLowerCase();
                  return (
                    <button
                      key={ct}
                      type="button"
                      onClick={() => setContentType(val)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition ${
                        contentType === val
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950'
                      }`}
                    >
                      {ct}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic / Context <span className="text-red-500">*</span>
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                rows={3}
                placeholder="e.g., Morning routine for productivity, New product launch, Behind the scenes..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hook <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </label>
              <input
                type="text"
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                placeholder="First line to grab attention..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Audience <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Entrepreneurs, Fitness enthusiasts, Moms..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2.5">Tone</label>
              <div className="grid grid-cols-3 gap-2.5">
                {TONES.map((t) => {
                  const val = t.toLowerCase();
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(val)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                        tone === val
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2.5">Emoji Level</label>
              <div className="grid grid-cols-4 gap-2.5">
                {EMOJI_LEVELS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEmojiLevel(value)}
                    className={`py-2.5 rounded-lg text-sm font-medium border transition ${
                      emojiLevel === value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Call-to-Action <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </label>
              <select
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">None</option>
                <option value="Follow for more">Follow for more</option>
                <option value="Comment your thoughts">Comment your thoughts</option>
                <option value="Link in bio">Link in bio</option>
                <option value="Save this post">Save this post</option>
                <option value="Share with a friend">Share with a friend</option>
              </select>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hashtags</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeHashtags(!includeHashtags)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${includeHashtags ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${includeHashtags ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {includeHashtags && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Add hashtags you want included</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">#</span>
                      <input
                        type="text"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={handleHashtagKeyDown}
                        onBlur={() => hashtagInput && addHashtag(hashtagInput)}
                        placeholder="fitness, travel, food..."
                        className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => addHashtag(hashtagInput)}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      Add
                    </button>
                  </div>
                  {customHashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {customHashtags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                          #{tag}
                          <button type="button" onClick={() => removeHashtag(tag)} className="hover:text-blue-900 dark:hover:text-blue-100 transition">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-4">
              <ModelSelector
                feature="caption"
                plan={plan}
                selected={selectedModel}
                onChange={setSelectedModel}
                onUpgradeRequired={onUpgrade}
              />

              {plan !== 'free' && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Cost: <span className="font-semibold text-gray-900 dark:text-white ml-1">{creditCost} credits</span>
                  </div>
                  <span className="text-gray-400">Balance: {credits}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !topic || !canAfford}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : freeLimitReached ? (
                <>
                  <Zap className="w-5 h-5" />
                  Upgrade to Generate
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Captions
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {variations.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your generated captions will appear here</p>
              <p className="text-xs text-gray-400 mt-1">Fill in the form and click Generate</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="relative mb-4">
                <div className="w-12 h-12 border-4 border-blue-100 dark:border-blue-900 rounded-full" />
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Writing your captions...</p>
              <p className="text-xs text-gray-400 mt-1">This may take a moment</p>
            </div>
          )}

          {variations.map((variation, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full">
                  Version {variation.version}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(index, variation.caption, variation.hashtags)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? (
                      <><Check className="w-4 h-4 text-green-600 dark:text-green-400" /> Copied</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy</>
                    )}
                  </button>
                  <button
                    onClick={() => handleSave(variation)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
              <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap mb-4 text-sm leading-relaxed">{variation.caption}</p>
              {variation.hashtags && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-blue-600 dark:text-blue-400 text-sm">{variation.hashtags}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
