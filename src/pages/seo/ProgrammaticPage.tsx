import { ArrowRight, Sparkles, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { SEOHead } from '../../seo/SEOHead';
import { BreadcrumbSchema } from '../../seo/SchemaMarkup';
import { getProgrammaticSEO, SITE_URL } from '../../seo/seo-config';
import { ProgrammaticEntry } from '../../seo/programmatic-data';
import { RelatedTools } from '../../seo/RelatedTools';
import { SeoNav } from './SeoNav';
import { CtaBanner } from './CtaBanner';

interface ProgrammaticPageProps {
  type: 'instagram' | 'youtube' | 'tiktok';
  entry: ProgrammaticEntry;
  onGetStarted: () => void;
  navigate: (path: string) => void;
}

function CopyableExample({ text, index }: { text: string; index: number }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 group hover:border-blue-200 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-xs font-bold text-gray-300 mt-0.5 w-5 flex-shrink-0">#{index}</span>
          <p className="text-sm text-gray-800 leading-relaxed">{text}</p>
        </div>
        <button
          onClick={copy}
          className="flex-shrink-0 text-gray-400 hover:text-blue-600 transition p-1"
          title="Copy to clipboard"
        >
          {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

const TYPE_CONFIG = {
  instagram: {
    label: 'Instagram Captions',
    pathPrefix: '/instagram-captions-for-',
    parentPath: '/ai-instagram-caption-generator',
    parentLabel: 'Instagram Caption Generator',
    accentColor: 'text-pink-600',
    bgAccent: 'bg-pink-50',
    borderAccent: 'border-pink-100',
    badge: 'Instagram Captions',
    ctaHeadline: 'Generate More Captions Instantly with AI',
    ctaSub: 'These 30 examples are just a start. Generate unlimited platform-optimized captions for any topic.',
    ctaLabel: 'Generate Instagram Captions Free',
    relatedNiches: ['fitness', 'real-estate', 'food', 'travel', 'fashion'],
    relatedLabel: 'Browse More Niches',
  },
  youtube: {
    label: 'YouTube Video Ideas',
    pathPrefix: '/youtube-video-ideas-for-',
    parentPath: '/ai-youtube-script-generator',
    parentLabel: 'YouTube Script Generator',
    accentColor: 'text-red-600',
    bgAccent: 'bg-red-50',
    borderAccent: 'border-red-100',
    badge: 'YouTube Ideas',
    ctaHeadline: 'Turn These Ideas Into Full Scripts Instantly',
    ctaSub: 'Pick any idea above and generate a full hook-first YouTube script in under 10 seconds.',
    ctaLabel: 'Generate YouTube Scripts Free',
    relatedNiches: ['students', 'beginners', 'finance', 'fitness', 'cooking'],
    relatedLabel: 'Browse More Topics',
  },
  tiktok: {
    label: 'TikTok Hooks',
    pathPrefix: '/tiktok-hooks-for-',
    parentPath: '/ai-tiktok-caption-generator',
    parentLabel: 'TikTok Caption Generator',
    accentColor: 'text-gray-900',
    bgAccent: 'bg-gray-100',
    borderAccent: 'border-gray-200',
    badge: 'TikTok Hooks',
    ctaHeadline: 'Generate More TikTok Hooks for Any Topic',
    ctaSub: 'These 30 hooks are pre-generated. Generate unlimited hooks for your specific video topics in seconds.',
    ctaLabel: 'Generate TikTok Hooks Free',
    relatedNiches: ['beauty', 'gym', 'finance', 'gaming', 'food'],
    relatedLabel: 'Browse More Industries',
  },
};

export function ProgrammaticPage({ type, entry, onGetStarted, navigate }: ProgrammaticPageProps) {
  const config = TYPE_CONFIG[type];
  const seo = getProgrammaticSEO(type, entry.slug, entry.label);

  const breadcrumbs = [
    { name: 'Home', url: `${SITE_URL}/` },
    { name: config.parentLabel, url: `${SITE_URL}${config.parentPath}` },
    { name: `${entry.label} ${config.label}`, url: seo.canonical },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead seo={seo} />
      <BreadcrumbSchema items={breadcrumbs} />

      <SeoNav onGetStarted={onGetStarted} navigate={navigate} showBack />

      {/* HERO */}
      <section className="pt-16 pb-14 px-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
            <button onClick={() => navigate('/')} className="hover:text-gray-600 transition">Home</button>
            <span>/</span>
            <button onClick={() => navigate(config.parentPath)} className="hover:text-gray-600 transition">{config.parentLabel}</button>
            <span>/</span>
            <span className="text-gray-600">{entry.label} {config.label}</span>
          </nav>

          <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border ${config.bgAccent} ${config.borderAccent} ${config.accentColor}`}>
            {config.badge}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            {entry.label} {config.label}:<br />30+ AI-Generated Examples
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mb-6">{entry.intro}</p>

          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 transition"
          >
            <Sparkles className="w-4 h-4" />
            Generate More with AI
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* EXAMPLES */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-gray-900">
              {entry.examples.length} Ready-to-Use {config.badge}
            </h2>
            <span className="text-xs text-gray-400">Click the copy icon to copy any example</span>
          </div>
          <div className="space-y-3">
            {entry.examples.map((ex, i) => (
              <CopyableExample key={i} text={ex} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* INLINE CTA */}
      <section className="py-12 px-6 bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold mb-3">{config.ctaHeadline}</h2>
          <p className="text-blue-100 mb-6">{config.ctaSub}</p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition text-sm"
          >
            {config.ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* RELATED NICHES */}
      <section className="py-12 px-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">{config.relatedLabel}</h2>
          <div className="flex flex-wrap gap-2">
            {config.relatedNiches.filter(n => n !== entry.slug).map((niche) => (
              <button
                key={niche}
                onClick={() => navigate(`${config.pathPrefix}${niche}`)}
                className="text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition capitalize"
              >
                {niche.replace(/-/g, ' ')}
              </button>
            ))}
            <button
              onClick={() => navigate(config.parentPath)}
              className="text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
            >
              {config.parentLabel} →
            </button>
          </div>
        </div>
      </section>

      <CtaBanner
        headline={`Generate Custom ${entry.label} ${config.label} with AI`}
        sub={`These examples are just a preview. Enter any topic and get ${type === 'youtube' ? 'video ideas with script hooks' : 'ready-to-post captions'} in under 2 seconds.`}
        label="Start Generating for Free"
        onGetStarted={onGetStarted}
      />

      <RelatedTools onGetStarted={onGetStarted} navigate={navigate} />
    </div>
  );
}
