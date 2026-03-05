import { useState, useRef } from 'react';
import { Plus, Trash2, Youtube, Upload, X, Loader2, Zap, Image } from 'lucide-react';
import {
  ThumbnailStyle,
  ThumbnailEmotion,
  ThumbnailFormValues,
  STYLE_OPTIONS,
  EMOTION_OPTIONS,
  THUMBNAIL_CREDIT_COST,
} from './types';

interface ThumbnailFormProps {
  onSubmit: (values: ThumbnailFormValues) => void;
  loading: boolean;
  credits: number;
}

const YOUTUBE_URL_REGEX = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[\w-]+/;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface UploadedImage {
  name: string;
  dataUrl: string;
  size: number;
}

type InspirationTab = 'urls' | 'images';

export function ThumbnailForm({ onSubmit, loading, credits }: ThumbnailFormProps) {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<ThumbnailStyle>('bold_youtube');
  const [emotion, setEmotion] = useState<ThumbnailEmotion>('excited');
  const [colorTheme, setColorTheme] = useState('');
  const [textOverlay, setTextOverlay] = useState('');
  const [inspirationTab, setInspirationTab] = useState<InspirationTab>('urls');
  const [inspirationUrls, setInspirationUrls] = useState<string[]>(['']);
  const [urlErrors, setUrlErrors] = useState<Record<number, string>>({});
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAfford = credits >= THUMBNAIL_CREDIT_COST;

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
      inspirationUrls: validUrls,
      inspirationImages: images,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Video Title or Topic <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          placeholder="e.g. I quit my 9-5 to travel the world"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Style</label>
        <div className="grid grid-cols-2 gap-2">
          {STYLE_OPTIONS.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStyle(value)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition text-left ${
                style === value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span className="block">{label}</span>
              <span className={`block text-xs mt-0.5 ${style === value ? 'text-blue-100' : 'text-gray-400'}`}>
                {desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Emotion</label>
        <div className="flex gap-2">
          {EMOTION_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setEmotion(value)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition ${
                emotion === value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Color Theme <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={colorTheme}
            onChange={(e) => setColorTheme(e.target.value)}
            placeholder="e.g. deep red and black, neon green"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Text Overlay <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={textOverlay}
            onChange={(e) => setTextOverlay(e.target.value)}
            placeholder='e.g. "AI TOOK MY JOB?"'
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Inspiration <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex gap-1 mb-3 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setInspirationTab('urls')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition ${
              inspirationTab === 'urls' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            YouTube Links
          </button>
          <button
            type="button"
            onClick={() => setInspirationTab('images')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition ${
              inspirationTab === 'images' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            Upload Images
          </button>
        </div>

        {inspirationTab === 'urls' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Up to 5 YouTube URLs</span>
              {inspirationUrls.length < 5 && (
                <button
                  type="button"
                  onClick={addUrl}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
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
                    className={`flex-1 px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      urlErrors[index] ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {inspirationUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrl(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {urlErrors[index] && <p className="text-xs text-red-500 mt-1">{urlErrors[index]}</p>}
              </div>
            ))}
          </div>
        )}

        {inspirationTab === 'images' && (
          <div className="space-y-3">
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
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition"
              >
                <Upload className="w-4 h-4" />
                Upload thumbnails (JPG, PNG, WEBP — max 5MB each)
              </button>
            )}
            {fileError && <p className="text-xs text-red-500">{fileError}</p>}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-video">
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
            <p className="text-xs text-gray-400">
              {uploadedImages.length}/5 images uploaded
            </p>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-gray-600">
              Cost: <span className="font-semibold text-gray-900">{THUMBNAIL_CREDIT_COST} credits</span>
            </span>
            <span className="text-sm text-gray-400">(Balance: {credits})</span>
          </div>
          {!canAfford && (
            <span className="text-xs text-red-500 font-medium">Insufficient credits</span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !canAfford}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Thumbnails...
            </>
          ) : (
            <>
              <Image className="w-4 h-4" />
              Generate 3 Thumbnails
            </>
          )}
        </button>
      </div>
    </form>
  );
}
