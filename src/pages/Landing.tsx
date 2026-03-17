import { motion } from 'framer-motion';
import { Zap, TrendingUp, Clock, Layers, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: Zap, title: 'AI-Powered', desc: 'Generate platform-optimized content instantly' },
  { icon: TrendingUp, title: 'High Converting', desc: 'Content designed to boost engagement' },
  { icon: Clock, title: 'Save Time', desc: 'Create weeks of content in minutes' },
  { icon: Layers, title: 'Multi-Format', desc: 'Captions, scripts, threads, thumbnails' },
];

const PLATFORMS = ['Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'YouTube'];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function Landing({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-bat-bg">
      <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xs">SB</span>
          </div>
          <span className="text-base font-semibold text-white">Social Bat</span>
        </div>
        <button
          onClick={onGetStarted}
          className="px-5 py-2 text-sm font-semibold text-black bg-white hover:bg-bat-accent rounded-xl transition-all duration-200 active:scale-95"
        >
          Get Started
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bat-surface border border-bat-border rounded-full text-xs text-bat-muted mb-8">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            AI content tools for modern creators
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Create viral content
            <br />
            <span className="text-bat-muted">in seconds</span>
          </h1>
          <p className="text-lg text-bat-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered tools for captions, scripts, carousels, and thumbnails. Built for Instagram, TikTok, LinkedIn, Twitter, and YouTube.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-bat-accent transition-all duration-200 active:scale-95"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-bat-surface border border-bat-border text-white font-medium rounded-xl hover:border-bat-border2 hover:bg-bat-surface2 transition-all duration-200"
            >
              See demo
            </button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="bg-bat-surface border border-bat-border rounded-2xl p-5"
            >
              <div className="w-9 h-9 bg-bat-bg border border-bat-border rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1.5 text-sm">{title}</h3>
              <p className="text-bat-muted text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-bat-surface border border-bat-border rounded-2xl p-8"
        >
          <p className="text-xs font-medium text-bat-muted uppercase tracking-widest text-center mb-6">Supported Platforms</p>
          <div className="grid grid-cols-5 gap-4">
            {PLATFORMS.map((platform) => (
              <div key={platform} className="text-center">
                <div className="w-10 h-10 bg-bat-bg border border-bat-border rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold text-white">{platform[0]}</span>
                </div>
                <p className="text-xs text-bat-muted">{platform}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
