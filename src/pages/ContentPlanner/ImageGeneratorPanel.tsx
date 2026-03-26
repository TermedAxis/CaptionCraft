import { useState } from "react";
import { Image as ImageIcon, Loader2, RefreshCw, Download, X, Sparkles } from "lucide-react";

interface ImageGeneratorPanelProps {
  defaultPrompt: string;
  imageKey: string;
  imageUrl?: string;
  loading?: boolean;
  error?: string;
  onGenerate: (key: string, prompt: string, width?: number, height?: number) => void;
  onClear: (key: string) => void;
  width?: number;
  height?: number;
  label?: string;
}

export function ImageGeneratorPanel({
  defaultPrompt,
  imageKey,
  imageUrl,
  loading,
  error,
  onGenerate,
  onClear,
  width = 1024,
  height = 1024,
  label = "Generate Image",
}: ImageGeneratorPanelProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `generated-image-${imageKey}.jpg`;
    a.click();
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</span>
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">AI Generated</span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => onGenerate(imageKey, prompt, width, height)}
            disabled={loading || !prompt.trim()}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-3 py-2 rounded-lg">{error}</p>
        )}

        {loading && !imageUrl && (
          <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Generating your image...</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">This may take 10-20 seconds</p>
          </div>
        )}

        {imageUrl && (
          <div className="relative group rounded-xl overflow-hidden">
            <img
              src={imageUrl}
              alt="AI generated"
              className="w-full rounded-xl object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => onGenerate(imageKey, prompt, width, height)}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-800 text-xs font-medium rounded-lg hover:bg-gray-100 transition shadow-lg"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-800 text-xs font-medium rounded-lg hover:bg-gray-100 transition shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
              <button
                onClick={() => onClear(imageKey)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition shadow-lg"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
