import { useState, useRef } from 'react';
import { Plus, Trash2, Youtube, Upload, X, Loader2, Zap, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ThumbnailStyle,
  ThumbnailEmotion,
  ThumbnailFormValues,
  STYLE_OPTIONS,
  EMOTION_OPTIONS,
} from './types';
import { ModelSelector } from '../../components/ModelSelector';
import { PlanType, ModelId } from '../../lib/supabase';
import { getCreditCost } from '../../lib/credits';

interface ThumbnailFormProps {
  onSubmit: (values: ThumbnailFormValues) => void;
  loading: boolean;
  credits: number;
  plan: PlanType;
  selectedModel: ModelId;
  onModelChange: (model: ModelId) => void;
  onUpgrade: () => void;
  freeLimitReached: boolean;
}

const YOUTUBE_URL_REGEX = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[\w-]+/;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface UploadedImage {
  name: string;
  dataUrl: string;
  size: number;
}

type InspirationTab = 'urls' | 'images';

export function ThumbnailForm({ onSubmit, loading, credits, plan, selectedModel, onModelChange, onUpgrade, freeLimitReached }: ThumbnailFormProps) {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<ThumbnailStyle>('bold_youtube');
  const [emotion, setEmotion] = useState<ThumbnailEmotion>('excited');
  const [colorTheme, setColorTheme] = useState('');
  const [textOverlay, setTextOverlay] = useState('');
  const [extraContext, setExtraContext] = useState('');
  const [inspirationTab, setInspirationTab] = useState<InspirationTab>('urls');
  const [inspirationUrls, setInspirationUrls] = useState<string[]>(['']);
  const [urlErrors, setUrlErrors] = useState<Record<number, string>>({});
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const creditCost = plan !== 'free' ? getCreditCost('thumbnail', selectedModel) : 0;
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFileError(null);

    const remaining = 5 - uploadedImages.length;
    const toProcess = files.slice(0, remaining);

    toProcess.forEach((file) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setFileError('Only JPG, PNG, and WEBP images are supported');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`"${file.name}" exceeds 5MB limit`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setUploadedImages((prev) => {
          if (prev.length >= 5) return prev;
          return [...prev, { name: file.name, dataUrl, size: file.size }];
        });
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(urlErrors).length > 0) return;

    const validUrls = inspirationTab === 'urls'
      ? inspirationUrls.filter((url) => url.trim() && YOUTUBE_URL_REGEX.test(url))
      : [];

    const images = inspirationTab === 'images'
      ? uploadedImages.map((img) => img.dataUrl)
      : [];

    onSubmit({
      topic,
      style,
      emotion,
      colorTheme,
      textOverlay,
      extraContext,
      inspirationUrls: validUrls,
      inspirationImages: images,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <label className="block text-sm font-medium text-bat-accent mb-1.5">
          Video Title or Topic <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          placeholder="e.g. I quit my 9-5 to travel the world"
          className="w-full px-3 py-2.5 bg-bat-bg border border-bat-border rounded-xl text-sm text-white placeholder:text-bat-subtle focus:outline-none focus:border-bat-border2"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.04 }}
      >
        <label className="block text-sm font-medium text-bat-accent mb-2">Thumbnail Style</label>
        <div className="grid grid-cols-2 gap-2">
          {STYLE_OPTIONS.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStyle(value)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition text-left ${
                style === value
                  ? 'bg-white text-black border-white'
                  : 'bg-bat-bg text-bat-muted border-bat-border hover:border-bat-border2'
              }`}
            >
              <span className="block">{label}</span>
              <span className={`block text-xs mt-0.5 ${style === value ? 'text-black/60' : 'text-bat-subtle'}`}>
                {desc}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.08 }}
      >
        <label className="block text-sm font-medium text-bat-accent mb-2">Emotion</label>
        <div className="flex gap-2">
          {EMOTION_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setEmotion(value)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition ${
                emotion === value
                  ? 'bg-white text-black border-white'
                  : 'bg-bat-bg text-bat-muted border-bat-border hover:border-bat-border2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.12 }}
        className="grid grid-cols-1 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-bat-accent mb-1.5">
            Color Theme <span className="text-bat-subtle font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={colorTheme}
            onChange={(e) => setColorTheme(e.target.value)}
            placeholder="e.g. deep red and black, neon green"
            className="w-full px-3 py-2.5 bg-bat-bg border border-bat-border rounded-xl text-sm text-white placeholder:text-bat-subtle focus:outline-none focus:border-bat-border2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-bat-accent mb-1.5">
            Text Overlay <span className="text-bat-subtle font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={textOverlay}
            onChange={(e) => setTextOverlay(e.target.value)}
            placeholder='e.g. "AI TOOK MY JOB?"'
            className="w-full px-3 py-2.5 bg-bat-bg border border-bat-border rounded-xl text-sm text-white placeholder:text-bat-subtle focus:outline-none focus:border-bat-border2"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.16 }}
      >
        <label className="block text-sm font-medium text-bat-accent mb-1.5">
          Extra Context <span className="text-bat-subtle font-normal">(optional)</span>
        </label>
        <textarea
          rows={2}
          value={extraContext}
          onChange={(e) => setExtraContext(e.target.value)}
          placeholder="e.g. Show a shocked face, use dark background, include a money bag icon..."
          className="w-full px-3 py-2.5 bg-bat-bg border border-bat-border rounded-xl text-sm text-white placeholder:text-bat-subtle focus:outline-none focus:border-bat-border2 resize-none"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.2 }}
      >
        <label className="block text-sm font-medium text-bat-accent mb-2">
          Inspiration <span className="text-bat-subtle font-normal">(optional)</span>
        </label>
        <div className="flex gap-1 mb-3 p-1 bg-bat-surface2 rounded-lg">
          <button
            type="button"
            onClick={() => setInspirationTab('urls')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition ${
              inspirationTab === 'urls' ? 'bg-bat-bg text-white shadow-none' : 'text-bat-subtle hover:text-bat-muted'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            YouTube Links
          </button>
          <button
            type="button"
            onClick={() => setInspirationTab('images')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition ${
              inspirationTab === 'images' ? 'bg-bat-bg text-white shadow-none' : 'text-bat-subtle hover:text-bat-muted'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            Upload Images
          </button>
        </div>

        <AnimatePresence mode="wait">
          {inspirationTab === 'urls' && (
            <motion.div
              key="urls"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-bat-subtle">Up to 5 YouTube URLs</span>
                {inspirationUrls.length < 5 && (
                  <button
                    type="button"
                    onClick={addUrl}
                    className="flex items-center gap-1 text-xs text-bat-muted hover:text-white font-medium transition"
                  >
                    <Plus className="w-3 h-3" />Add
                  </button>
                )}
              </div>
              {inspirationUrls.map((url, index) => (
                <div key={index}>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className={`flex-1 px-3 py-2 rounded-xl text-xs text-white placeholder:text-bat-subtle focus:outline-none focus:border-bat-border2 ${
                        urlErrors[index]
                          ? 'border border-red-500/20 bg-red-500/10'
                          : 'border border-bat-border bg-bat-bg'
                      }`}
                    />
                    {inspirationUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUrl(index)}
                        className="p-2 text-bat-muted hover:text-red-400 hover:bg-bat-surface2 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {urlErrors[index] && <p className="text-xs text-red-400 mt-1">{urlErrors[index]}</p>}
                </div>
              ))}
            </motion.div>
          )}

          {inspirationTab === 'images' && (
            <motion.div
              key="images"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadedImages.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-bat-border rounded-lg text-sm text-bat-muted hover:border-bat-border2 hover:text-white transition"
                >
                  <Upload className="w-4 h-4" />
                  Upload thumbnails (JPG, PNG, WEBP — max 5MB each)
                </button>
              )}
              {fileError && <p className="text-xs text-red-400">{fileError}</p>}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden bg-bat-surface2 aspect-video">
                      <img
                        src={img.dataUrl}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-bat-subtle">
                {uploadedImages.length}/5 images uploaded
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ModelSelector
        feature="thumbnail"
        plan={plan}
        selected={selectedModel}
        onChange={onModelChange}
        onUpgradeRequired={onUpgrade}
      />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.24 }}
        className="pt-2 border-t border-bat-border"
      >
        {plan !== 'free' && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-bat-muted" />
              <span className="text-sm text-bat-muted">
                Cost: <span className="font-semibold text-white">{creditCost} credits</span>
              </span>
              <span className="text-sm text-bat-subtle">(Balance: {credits})</span>
            </div>
            {!canAfford && (
              <span className="text-xs text-red-400 font-medium">Insufficient credits</span>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !canAfford}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-white hover:bg-bat-accent disabled:bg-bat-surface2 disabled:text-bat-subtle text-black font-semibold rounded-xl transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Thumbnails...
            </>
          ) : freeLimitReached ? (
            <>
              <Zap className="w-4 h-4" />
              Upgrade to Generate
            </>
          ) : (
            <>
              <Image className="w-4 h-4" />
              Generate 3 Thumbnails
            </>
          )}
        </button>
      </motion.div>
    </form>
  );
}
