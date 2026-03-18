import { CheckCircle, ArrowRight, ScrollText, Zap, Youtube } from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';
import { FAQSchema, SoftwareAppSchema } from '../../seo/SchemaMarkup';
import { SEO_PAGES } from '../../seo/seo-config';
import { RelatedTools } from '../../seo/RelatedTools';
import { SeoNav } from './SeoNav';
import { CtaBanner } from './CtaBanner';

const FAQS = [
  { q: 'What is a YouTube script generator?', a: 'A YouTube script generator uses AI to produce structured video scripts — complete with a hook, chapter breakdown, retention lines, and CTA — based on your video topic. Media Wizard\'s generator is hook-first, meaning it leads with the 30-second hook that determines whether viewers stay or leave.' },
  { q: 'Is the YouTube script generator free?', a: 'Yes. Media Wizard offers 50 free credits per month. Script generation uses 2-5 credits depending on length. No credit card required to start.' },
  { q: 'What makes a good YouTube script?', a: 'A high-retention YouTube script leads with a strong hook (0-30 seconds), establishes credibility briefly, delivers value in structured chapters with re-engagement points every 2-3 minutes, includes a mid-video CTA, and closes with a clear next-action. Media Wizard generates scripts following this exact structure.' },
  { q: 'How long does it take to generate a script?', a: 'Under 10 seconds for a full structured script, including hook, chapters, and CTA. Most creators film their first AI-generated script within 20 minutes of generation (editing for personal voice).' },
  { q: 'Can I use these scripts for YouTube Shorts?', a: 'Yes. You can specify "YouTube Shorts" as your format and the AI generates a short-form 60-second script with a hook optimized for the Shorts feed.' },
  { q: 'Do I need to edit the scripts?', a: 'We recommend spending 10-15 minutes personalizing the script with your specific examples, voice, and unique insights. The AI provides structure and content — you add the authenticity that builds audience connection.' },
];

const SCRIPT_FEATURES = [
  { title: 'Hook-first structure', body: 'Every script leads with a 30-second hook proven to retain viewers. This is the #1 factor in YouTube watch time.' },
  { title: 'Chapter breakdown', body: 'Scripts are organized into logical sections so you never lose your train of thought on camera.' },
  { title: 'Re-engagement lines', body: 'The AI inserts retention-building phrases at 2-3 minute intervals — keeping viewers watching through to the end.' },
  { title: 'Built-in CTAs', body: 'Subscription and comment CTAs are placed at the optimal position (60-70% through the video) where they convert best.' },
  { title: 'Length control', body: 'Specify 5, 10, 15, or 20+ minute videos. The AI calibrates content depth and pacing accordingly.' },
  { title: 'Any topic, any niche', body: 'From tech reviews to cooking tutorials to personal finance — the script generator adapts to your niche and audience.' },
];

interface Props {
  onGetStarted: () => void;
  navigate: (path: string) => void;
}

export function YoutubeScriptPage({ onGetStarted, navigate }: Props) {
  const seo = SEO_PAGES.youtubeScriptGenerator;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead seo={seo} />
      <FAQSchema faqs={FAQS} />
      <SoftwareAppSchema
        name="Media Wizard YouTube Script Generator"
        description={seo.description}
        url={seo.canonical}
      />

      <SeoNav onGetStarted={onGetStarted} navigate={navigate} showBack />

      {/* HERO */}
      <section className="pt-20 pb-20 px-6 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-red-100">
            <Youtube className="w-3.5 h-3.5" />
            Free YouTube Script Generator
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
            AI YouTube Script Generator —<br />
            <span className="text-red-500">Hook-First Scripts That Grow Watch Time</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-8">
            Generate fully structured YouTube video scripts with hooks, chapter breakdowns, and built-in CTAs. Stop winging it on camera — start with a script that's designed to hold attention.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-red-700 transition mb-4"
          >
            <ScrollText className="w-4 h-4" />
            Generate Your Script Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-sm text-gray-400">50 free credits · No card required · Under 10 seconds</p>
        </div>
      </section>

      {/* SCRIPT EXAMPLE */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
            What a Generated Script Looks Like
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400 ml-2 font-sans">Script Generator · "How to Build an Audience on YouTube from Zero"</span>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed font-sans">
              <div>
                <span className="text-xs font-bold text-red-500 uppercase tracking-wide block mb-1">Hook (0-30 seconds)</span>
                <p className="text-sm">Most people start a YouTube channel and quit in 90 days. Not because the content was bad — because they had no system for growth. In this video, I'm showing you exactly how I grew from zero to 10K subscribers in 6 months using a strategy most creators skip entirely. Stay until the end because the third point is the one nobody talks about.</p>
              </div>
              <div>
                <span className="text-xs font-bold text-blue-500 uppercase tracking-wide block mb-1">Chapter 1: Why Most Channels Fail (1-3 min)</span>
                <p className="text-sm text-gray-500">Cover: algorithm misunderstanding, inconsistency, wrong niche approach...</p>
              </div>
              <div>
                <span className="text-xs font-bold text-blue-500 uppercase tracking-wide block mb-1">Chapter 2: The 3-Video Foundation System (3-8 min)</span>
                <p className="text-sm text-gray-500">Cover: pillar content, search content, trending content ratio...</p>
              </div>
              <div>
                <span className="text-xs font-bold text-green-500 uppercase tracking-wide block mb-1">CTA (at 60% mark)</span>
                <p className="text-sm">If this is already making sense, hit subscribe — I put out one video like this every week and I don't want you to miss the next one.</p>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">Generated in under 10 seconds. Personalize in 15 minutes. Film in one take.</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
            Built for YouTube Watch Time Optimization
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCRIPT_FEATURES.map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-6">
                <CheckCircle className="w-5 h-5 text-green-500 mb-3" />
                <p className="font-semibold text-gray-900 mb-2 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOPIC IDEAS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Explore Video Ideas by Topic</h2>
          <p className="text-gray-500 mb-8 text-sm">30+ YouTube video ideas with hooks for every major niche.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['students', 'beginners', 'finance', 'fitness', 'cooking', 'travel', 'gaming', 'health', 'tech', 'entrepreneurship'].map((topic) => (
              <button
                key={topic}
                onClick={() => navigate(`/youtube-video-ideas-for-${topic}`)}
                className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition capitalize"
              >
                YouTube Ideas for {topic.charAt(0).toUpperCase() + topic.slice(1)}
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
        headline="Generate Your First YouTube Script in 10 Seconds"
        sub="Hook-first, watch-time-optimized, chapter-structured scripts for any video topic. Start free with 50 credits per month."
        label="Generate Script Free"
        onGetStarted={onGetStarted}
      />

      <RelatedTools exclude="/ai-youtube-script-generator" onGetStarted={onGetStarted} navigate={navigate} />
    </div>
  );
}
