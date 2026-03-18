import { CheckCircle, ArrowRight, Sparkles, Play } from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';
import { FAQSchema, SoftwareAppSchema } from '../../seo/SchemaMarkup';
import { SEO_PAGES } from '../../seo/seo-config';
import { RelatedTools } from '../../seo/RelatedTools';
import { SeoNav } from './SeoNav';
import { CtaBanner } from './CtaBanner';

const FAQS = [
  { q: 'What is a TikTok caption generator?', a: 'A TikTok caption generator creates hook-first captions and opening lines designed specifically for TikTok\'s format and algorithm. TikTok captions appear as text on screen and must work as standalone hooks — they\'re fundamentally different from Instagram captions.' },
  { q: 'How long should TikTok captions be?', a: 'TikTok captions should be under 150 characters — they appear on screen and get cut off beyond that. The most effective TikTok captions function as a hook that complements the opening visual, creating curiosity that keeps viewers watching.' },
  { q: 'Do TikTok hashtags still matter?', a: 'Hashtags on TikTok are primarily for content categorization, not discovery. Use 2-3 specific community hashtags (like #FitnessTikTok rather than #Fitness) and avoid filling your caption with 20+ hashtags. Media Wizard generates appropriate hashtags automatically.' },
  { q: 'Is the TikTok caption generator free?', a: 'Yes. Media Wizard gives you 50 free credits per month — no credit card required. Each TikTok caption generation uses 1 credit.' },
  { q: 'Can AI generate TikTok hooks that actually go viral?', a: 'Virality is pattern-based, not random. The AI is trained on high-performing TikTok content and applies proven hook structures — curiosity gaps, controversy openers, POV formats, and outcome-first hooks — that consistently drive higher completion rates and FYP distribution.' },
  { q: 'What types of TikTok hooks does the generator create?', a: 'Media Wizard generates curiosity hooks ("Nobody tells you this about..."), story hooks ("Last year I was..."), POV hooks, controversy hooks, warning hooks ("Stop doing X until..."), and result hooks ("After 30 days of Y, here\'s what happened"). You choose the format that fits your video.' },
];

const HOOK_TYPES = [
  { label: 'Curiosity Hook', example: '"Nobody told me this about fitness until it was almost too late..."', color: 'bg-blue-50 border-blue-100 text-blue-700' },
  { label: 'POV Hook', example: '"POV: you just found the $8 dupe for that $80 skincare product"', color: 'bg-pink-50 border-pink-100 text-pink-700' },
  { label: 'Warning Hook', example: '"Stop buying this product until you watch this. Seriously."', color: 'bg-amber-50 border-amber-100 text-amber-700' },
  { label: 'Result Hook', example: '"I did this for 30 days. The results were not what I expected."', color: 'bg-green-50 border-green-100 text-green-700' },
  { label: 'Controversy Hook', example: '"Unpopular opinion: [popular advice] is actually wrong. Here\'s my case."', color: 'bg-red-50 border-red-100 text-red-700' },
  { label: 'Story Hook', example: '"Last year I made a decision everyone called a mistake. Here\'s what happened."', color: 'bg-gray-50 border-gray-100 text-gray-700' },
];

interface Props {
  onGetStarted: () => void;
  navigate: (path: string) => void;
}

export function TiktokCaptionPage({ onGetStarted, navigate }: Props) {
  const seo = SEO_PAGES.tiktokCaptionGenerator;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead seo={seo} />
      <FAQSchema faqs={FAQS} />
      <SoftwareAppSchema
        name="Media Wizard TikTok Caption Generator"
        description={seo.description}
        url={seo.canonical}
      />

      <SeoNav onGetStarted={onGetStarted} navigate={navigate} showBack />

      {/* HERO */}
      <section className="pt-20 pb-20 px-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/20">
            <Play className="w-3.5 h-3.5" />
            Free TikTok Caption Generator
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-5">
            AI TikTok Caption Generator —<br />
            <span className="text-blue-400">Viral Hooks for the FYP</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
            Generate scroll-stopping TikTok hooks and captions that stop the algorithm in its tracks. Trend-aware, platform-optimized, and built for the For You Page.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-100 transition mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Generate TikTok Hooks Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-gray-400 text-sm">50 free credits · No card required</p>
        </div>
      </section>

      {/* HOOK TYPES */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              6 Proven TikTok Hook Formats
            </h2>
            <p className="text-gray-500 text-lg">The AI generates all of these — you choose the format that fits your video.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOOK_TYPES.map((h) => (
              <div key={h.label} className={`border rounded-xl p-5 ${h.color}`}>
                <p className="font-bold text-xs uppercase tracking-wide mb-2">{h.label}</p>
                <p className="text-sm leading-relaxed font-medium">{h.example}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button onClick={onGetStarted} className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition">
              Generate My TikTok Hook
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* HOW TIKTOK ALGORITHM WORKS */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
            Why Captions Matter So Much on TikTok
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'The first 2 seconds determine reach', body: 'TikTok shows your video to a test group and measures completion rate immediately. If the hook doesn\'t hold attention in the first 2 seconds, the video never reaches more people.' },
              { title: 'Captions appear as on-screen text', body: 'Your TikTok caption is often read before the video is watched. It must work as a standalone hook for sound-off viewers — 40% of TikTok videos are watched without sound.' },
              { title: 'The "open loop" principle', body: 'The best hooks create an information gap that the brain must close. "Nobody tells you this about [topic]..." triggers a psychological need to keep watching.' },
              { title: 'Re-watch rate drives FYP', body: 'Videos that people re-watch signal high value to TikTok\'s algorithm. A strong hook that perfectly sets up a satisfying payoff drives re-watches organically.' },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-6">
                <CheckCircle className="w-5 h-5 text-blue-500 mb-3" />
                <p className="font-semibold text-gray-900 mb-2 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRY PAGES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Browse Hooks by Industry</h2>
          <p className="text-gray-500 mb-8 text-sm">30+ pre-generated TikTok hooks for every major industry.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['beauty', 'gym', 'finance', 'gaming', 'food', 'fashion', 'wellness', 'education', 'real-estate', 'healthcare'].map((industry) => (
              <button
                key={industry}
                onClick={() => navigate(`/tiktok-hooks-for-${industry}`)}
                className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition capitalize"
              >
                {industry.replace(/-/g, ' ')} Hooks
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">FAQ</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="font-semibold text-gray-900 mb-2 text-sm">{faq.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        headline="Stop the Scroll With AI-Generated TikTok Hooks"
        sub="Generate viral opening lines and captions for any TikTok video. Free to start, no credit card required."
        label="Generate TikTok Hooks Free"
        onGetStarted={onGetStarted}
      />

      <RelatedTools exclude="/ai-tiktok-caption-generator" onGetStarted={onGetStarted} navigate={navigate} />
    </div>
  );
}
