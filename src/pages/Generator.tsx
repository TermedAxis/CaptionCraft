import { useState, useEffect, KeyboardEvent } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { ModelSelector } from '../components/ModelSelector';
import { Sparkles, Copy, Check, AlertCircle, Loader2, Hash, X, Zap } from 'lucide-react';
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Caption Creator</h1>
        <p className="text-gray-600">Create engaging social media captions in seconds</p>
        {plan === 'free' && freeChecked && (
          <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
            freeLimitReached ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
          }`}>
            <AlertCircle className="w-4 h-4" />
            <span>
              Free: {freeUsed}/{freeLimit} captions used
              {freeLimitReached && (
                <button onClick={onUpgrade} className="underline font-semibold ml-1">
                  Upgrade to continue
                </button>
              )}
            </span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="youtube">YouTube Shorts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="post">Post</option>
                  <option value="reel">Reel</option>
                  <option value="carousel">Carousel</option>
                  <option value="short">Short</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic / Context *</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                rows={3}
                placeholder="e.g., Morning routine for productivity, New product launch, Behind the scenes..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hook (Optional)</label>
              <input
                type="text"
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                placeholder="First line to grab attention..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience (Optional)</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Entrepreneurs, Fitness enthusiasts, Moms..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="funny">Funny</option>
                  <option value="bold">Bold</option>
                  <option value="luxury">Luxury</option>
                  <option value="educational">Educational</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emoji Level</label>
                <select
                  value={emojiLevel}
                  onChange={(e) => setEmojiLevel(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">None</option>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action (Optional)</label>
              <select
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">None</option>
                <option value="Follow for more">Follow for more</option>
                <option value="Comment your thoughts">Comment your thoughts</option>
                <option value="Link in bio">Link in bio</option>
                <option value="Save this post">Save this post</option>
                <option value="Share with a friend">Share with a friend</option>
              </select>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Hashtags</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeHashtags(!includeHashtags)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${includeHashtags ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${includeHashtags ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {includeHashtags && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Add hashtags you want included</p>
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
                        className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => addHashtag(hashtagInput)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition"
                    >
                      Add
                    </button>
                  </div>
                  {customHashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {customHashtags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          #{tag}
                          <button type="button" onClick={() => removeHashtag(tag)} className="hover:text-blue-900 transition">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {plan !== 'free' && (
              <ModelSelector
                feature="caption"
                plan={plan}
                selected={selectedModel}
                onChange={setSelectedModel}
                onUpgradeRequired={onUpgrade}
              />
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {plan !== 'free' && (
              <div className="flex items-center justify-between text-sm pt-1">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Cost: <span className="font-semibold text-gray-900 ml-1">{creditCost} credits</span>
                </div>
                <span className="text-gray-400">Balance: {credits}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !topic || !canAfford}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  <Sparkles className="w-5 h-5" />
                  Generate Captions
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {variations.length === 0 && !loading && (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Your generated captions will appear here</p>
            </div>
          )}
          {variations.map((variation, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Version {variation.version}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(index, variation.caption, variation.hashtags)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleSave(variation)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
              <p className="text-gray-900 whitespace-pre-wrap mb-4">{variation.caption}</p>
              {variation.hashtags && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-blue-600 text-sm">{variation.hashtags}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
