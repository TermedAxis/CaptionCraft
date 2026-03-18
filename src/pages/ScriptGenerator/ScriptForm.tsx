import { useState } from 'react';
import { Plus, Trash2, Youtube, Loader2, Zap } from 'lucide-react';
import {
  Platform,
  ScriptLength,
  ScriptTone,
  ScriptFormValues,
  LENGTH_LABELS,
} from './types';
import { ModelSelector } from '../../components/ModelSelector';
import { PlanType, ModelId } from '../../lib/supabase';
import { getCreditCost } from '../../lib/credits';

interface ScriptFormProps {
  onSubmit: (values: ScriptFormValues) => void;
  loading: boolean;
  credits: number;
  plan: PlanType;
  selectedModel: ModelId;
  onModelChange: (model: ModelId) => void;
  onUpgrade: () => void;
  freeLimitReached: boolean;
}

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram_reels', label: 'Instagram Reels' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube_shorts', label: 'YouTube Shorts' },
];

const TONES: { value: ScriptTone; label: string; desc: string }[] = [
  { value: 'educational', label: 'Educational', desc: 'Teach & inform' },
  { value: 'storytelling', label: 'Storytelling', desc: 'Narrative & personal' },
  { value: 'entertaining', label: 'Entertaining', desc: 'Fun & engaging' },
  { value: 'professional', label: 'Professional', desc: 'Polished & authoritative' },
];

const YOUTUBE_URL_REGEX = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[\w-]+/;

export function ScriptForm({ onSubmit, loading, credits, plan, selectedModel, onModelChange, onUpgrade, freeLimitReached }: ScriptFormProps) {
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [length, setLength] = useState<ScriptLength>('short');
  const [tone, setTone] = useState<ScriptTone>('educational');
  const [cta, setCta] = useState('');
  const [extraContext, setExtraContext] = useState('');
  const [variations, setVariations] = useState(1);
  const [inspirationUrls, setInspirationUrls] = useState<string[]>(['']);
  const [urlErrors, setUrlErrors] = useState<Record<number, string>>({});

  const creditCost = plan !== 'free' ? getCreditCost('script', selectedModel) * variations : 0;
  const canAfford = plan === 'free' ? !freeLimitReached : credits >= creditCost;

  const validateUrl = (url: string, index: number) => {
    if (!url) {
      setUrlErrors((prev) => { const next = { ...prev }; delete next[index]; return next; });
      return;
    }
    if (!YOUTUBE_URL_REGEX.test(url)) {
      setUrlErrors((prev) => ({ ...prev, [index]: 'Please enter a valid YouTube URL' }));
    } else {
      setUrlErrors((prev) => { const next = { ...prev }; delete next[index]; return next; });
    }
  };

  const addUrl = () => {
    if (inspirationUrls.length < 5) setInspirationUrls([...inspirationUrls, '']);
  };

  const removeUrl = (index: number) => {
    setInspirationUrls(inspirationUrls.filter((_, i) => i !== index));
    setUrlErrors((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const ki = parseInt(k);
        if (ki !== index) next[ki > index ? ki - 1 : ki] = v;
      });
      return next;
    });
  };

  const updateUrl = (index: number, value: string) => {
    const updated = [...inspirationUrls];
    updated[index] = value;
    setInspirationUrls(updated);
    validateUrl(value, index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(urlErrors).length > 0) return;
    const validUrls = inspirationUrls.filter((url) => url.trim() && YOUTUBE_URL_REGEX.test(url));
    onSubmit({ platform, topic, targetAudience, length, tone, cta, variations, inspirationUrls: validUrls, extraContext });
  };

  const lengthEntries = Object.entries(LENGTH_LABELS) as [ScriptLength, string][];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORMS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPlatform(value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition truncate ${
                platform === value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Topic <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          placeholder="e.g. 10 productivity hacks for remote workers"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Target Audience <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          required
          placeholder="e.g. Entrepreneurs aged 25–35"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Script Length</label>
        <div className="grid grid-cols-2 gap-2">
          {lengthEntries.map(([value, label]) => {
            const [name, range] = label.includes('(') ? label.split(' (') : [label, null];
            return (
              <button
                key={value}
                type="button"
                onClick={() => setLength(value)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition text-left ${
                  length === value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <span className="block font-semibold leading-tight">{name}</span>
                {range && (
                  <span className={`block text-xs mt-0.5 leading-tight ${length === value ? 'text-blue-100' : 'text-gray-400'}`}>
                    {range.replace(')', '')}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
        <div className="grid grid-cols-2 gap-2">
          {TONES.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTone(value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition text-left ${
                tone === value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span className="block leading-tight">{label}</span>
              <span className={`block text-xs mt-0.5 leading-tight ${tone === value ? 'text-blue-100' : 'text-gray-400'}`}>
                {desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Call to Action <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <input
          type="text"
          value={cta}
          onChange={(e) => setCta(e.target.value)}
          placeholder="e.g. Subscribe for more tips"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Extra Context <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <textarea
          rows={2}
          value={extraContext}
          onChange={(e) => setExtraContext(e.target.value)}
          placeholder="e.g. Include a personal story, reference recent news, avoid mentioning competitors..."
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Variations</label>
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setVariations(n)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition ${
                variations === n
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <Youtube className="w-4 h-4 text-red-500" />
            Inspiration Videos
            <span className="text-gray-400 font-normal text-xs">(optional)</span>
          </label>
          {inspirationUrls.length < 5 && (
            <button
              type="button"
              onClick={addUrl}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add URL
            </button>
          )}
        </div>
        <div className="space-y-2">
          {inspirationUrls.map((url, index) => (
            <div key={index}>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className={`flex-1 px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    urlErrors[index] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {inspirationUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrl(index)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {urlErrors[index] && (
                <p className="text-xs text-red-500 mt-1">{urlErrors[index]}</p>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          AI uses these transcripts as style inspiration
        </p>
      </div>

      <ModelSelector
        feature="script"
        plan={plan}
        selected={selectedModel}
        onChange={onModelChange}
        onUpgradeRequired={onUpgrade}
      />

      <div className="pt-3 border-t border-gray-100">
        {plan !== 'free' && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-gray-600">
                Cost: <span className="font-semibold text-gray-900">{creditCost} credits</span>
              </span>
              <span className="text-sm text-gray-400">(Balance: {credits})</span>
            </div>
            {!canAfford && (
              <span className="text-xs text-red-500 font-medium">Insufficient credits</span>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !canAfford}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Script...
            </>
          ) : freeLimitReached ? (
            <>
              <Zap className="w-4 h-4" />
              Upgrade to Generate
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Generate Script
            </>
          )}
        </button>
      </div>
    </form>
  );
}
