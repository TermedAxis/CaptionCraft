import { useState, useEffect } from 'react';
import { supabase, Caption } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Copy, Check, Trash2, Filter } from 'lucide-react';

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
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Media</h1>
          <p className="text-gray-600">Access all your generated content including captions, scripts, thumbnails, and more</p>
        </div>
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
          <p className="text-gray-600 font-medium mb-2">Sign in to view your saved media</p>
          <p className="text-sm text-gray-400">Your saved content will appear here after signing in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Media</h1>
        <p className="text-gray-600">Access all your generated content including captions, scripts, thumbnails, and more</p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Filter className="w-5 h-5 text-gray-400" />
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Media</option>
          <option value="posts">Posts</option>
          <option value="threads">Threads</option>
          <option value="carousels">Carousels</option>
          <option value="captions">Captions</option>
          <option value="scripts">Scripts</option>
          <option value="thumbnails">Thumbnails</option>
        </select>
        <span className="text-sm text-gray-600">
          {captions.length} {captions.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : captions.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-600 mb-4">No saved media yet</p>
          <p className="text-sm text-gray-500">Generate and save content to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {captions.map((caption) => (
            <div key={caption.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full capitalize">
                    {caption.platform}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
                    {caption.tone}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(caption.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(caption.id, caption.caption_text, caption.hashtags)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    {copiedId === caption.id ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(caption.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete caption"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-500 mb-1">Topic:</p>
                <p className="text-gray-700">{caption.topic}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                <p className="text-gray-900 whitespace-pre-wrap">{caption.caption_text}</p>
              </div>

              {caption.hashtags && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-blue-600 text-sm">{caption.hashtags}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
