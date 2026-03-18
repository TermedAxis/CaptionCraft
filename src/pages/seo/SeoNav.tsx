import { Sparkles, ArrowLeft } from 'lucide-react';

interface SeoNavProps {
  onGetStarted: () => void;
  navigate: (path: string) => void;
  showBack?: boolean;
}

export function SeoNav({ onGetStarted, navigate, showBack = false }: SeoNavProps) {
  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-6xl">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">Media Wizard</span>
          </button>
        </div>
        <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
          <button onClick={() => navigate('/blog')} className="hover:text-gray-900 transition">Blog</button>
          <button onClick={() => navigate('/ai-caption-generator')} className="hover:text-gray-900 transition">Caption Generator</button>
          <button onClick={() => navigate('/ai-youtube-script-generator')} className="hover:text-gray-900 transition">Script Generator</button>
        </div>
        <button
          onClick={onGetStarted}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition"
        >
          Start Free
        </button>
      </div>
    </nav>
  );
}
