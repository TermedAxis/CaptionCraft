import { useState } from 'react';
import { Download, RefreshCw, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThumbnailResultProps {
  imageUrls: string[];
  onRegenerate: () => void;
  loading: boolean;
}

export function ThumbnailResult({ imageUrls, onRegenerate, loading }: ThumbnailResultProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `thumbnail-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          Generated Thumbnails ({imageUrls.length})
        </h3>
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-bat-muted bg-bat-surface2 border border-bat-border hover:border-bat-border2 disabled:opacity-50 rounded-lg transition"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Regenerate
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {imageUrls.map((url, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.07 }}
            onClick={() => setSelected(selected === index ? null : index)}
            className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition ${
              selected === index
                ? 'border-white shadow-none'
                : 'border-transparent hover:border-bat-border'
            }`}
          >
            <img
              src={url}
              alt={`Thumbnail option ${index + 1}`}
              className="w-full aspect-video object-cover"
            />

            <AnimatePresence>
              {selected === index && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-white text-black text-xs font-semibold rounded-lg"
                >
                  <Check className="w-3 h-3" />
                  Selected
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between opacity-0 hover:opacity-100 transition">
              <span className="text-white text-xs font-medium">Option {index + 1}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(url, index); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-bat-accent transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleDownload(imageUrls[selected], selected)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-bat-accent text-black font-semibold text-sm rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            Download Option {selected + 1}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
