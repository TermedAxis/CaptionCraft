import { useState, useEffect } from 'react';
import { supabase, Caption } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Copy, Check, Trash2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedCaptionsProps {
  onRequestAuth: (message?: string) => void;
}

export function SavedCaptions({ onRequestAuth: _onRequestAuth }: SavedCaptionsProps) {
  const { user, profile } = useAuth();
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadCaptions();
  }, [profile, selectedPlatform]);

  const loadCaptions = async () => {
    if (!profile) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let query = supabase
      .from('captions')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (selectedPlatform !== 'all') {
      query = query.eq('platform', selectedPlatform);
    }

    const { data, error } = await query;

    if (data && !error) {
      setCaptions(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this caption?')) return;

    const { error } = await supabase.from('captions').delete().eq('id', id);

    if (!error) {
      setCaptions(captions.filter((c) => c.id !== id));
    }
  };

  const handleCopy = async (id: string, text: string, hashtags: string | null) => {
    const fullText = hashtags ? `${text}\n\n${hashtags}` : text;
    await navigator.clipboard.writeText(fullText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Saved Captions</h1>
          <p className="text-bat-muted">Access all your generated captions</p>
        </div>
        <div className="bg-bat-surface border-2 border-dashed border-bat-border rounded-xl p-16 text-center">
          <p className="text-bat-muted font-medium mb-2">Sign in to view your saved captions</p>
          <p className="text-sm text-bat-subtle">Your saved content will appear here after signing in</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Saved Captions</h1>
        <p className="text-bat-muted">Access all your generated captions</p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Filter className="w-5 h-5 text-bat-muted" />
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="px-4 py-2 bg-bat-bg border border-bat-border rounded-xl text-white focus:outline-none focus:border-bat-border2"
        >
          <option value="all">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
          <option value="linkedin">LinkedIn</option>
          <option value="twitter">Twitter</option>
          <option value="youtube">YouTube Shorts</option>
        </select>
        <span className="text-sm text-bat-muted">
          {captions.length} {captions.length === 1 ? 'caption' : 'captions'}
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 rounded-full border-4 border-white/20 border-t-white animate-spin" />
        </div>
      ) : captions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-bat-surface border-2 border-dashed border-bat-border rounded-xl p-12 text-center"
        >
          <p className="text-bat-muted mb-4">No saved captions yet</p>
          <p className="text-sm text-bat-subtle">Generate and save captions to see them here</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {captions.map((caption, i) => (
              <motion.div
                key={caption.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="bg-bat-surface rounded-xl border border-bat-border p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-bat-surface2 text-white text-xs font-semibold rounded-full capitalize border border-bat-border">
                      {caption.platform}
                    </span>
                    <span className="px-3 py-1 bg-bat-surface2 text-bat-muted text-xs font-medium rounded-full capitalize border border-bat-border">
                      {caption.tone}
                    </span>
                    <span className="text-xs text-bat-subtle">{formatDate(caption.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(caption.id, caption.caption_text, caption.hashtags)}
                      className="p-2 text-bat-muted hover:text-white hover:bg-bat-surface2 rounded-lg transition"
                      title="Copy to clipboard"
                    >
                      {copiedId === caption.id ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(caption.id)}
                      className="p-2 text-bat-muted hover:text-red-400 hover:bg-bat-surface2 rounded-lg transition"
                      title="Delete caption"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-bat-subtle mb-1">Topic:</p>
                  <p className="text-white">{caption.topic}</p>
                </div>

                <div className="bg-bat-surface2 border border-bat-border rounded-xl p-4 mb-3">
                  <p className="text-white whitespace-pre-wrap">{caption.caption_text}</p>
                </div>

                {caption.hashtags && (
                  <div className="pt-3 border-t border-bat-border">
                    <p className="text-bat-muted text-sm">{caption.hashtags}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
