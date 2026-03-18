import { CheckCircle, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';
import { FAQSchema, SoftwareAppSchema } from '../../seo/SchemaMarkup';
import { SEO_PAGES } from '../../seo/seo-config';
import { RelatedTools } from '../../seo/RelatedTools';
import { SeoNav } from './SeoNav';
import { CtaBanner } from './CtaBanner';

const FAQS = [
  { q: 'What is an AI caption generator?', a: 'An AI caption generator uses large language models to produce platform-optimized social media captions based on your topic, tone, and platform preference. Unlike general-purpose AI, purpose-built caption generators like Media Wizard are trained specifically on high-performing social content.' },
  { q: 'Is this AI caption generator free?', a: 'Yes. Media Wizard offers 50 free credits per month with no credit card required. Each caption generation uses 1 credit. Upgrade to Hobby ($10/mo) or Pro ($20/mo) for more credits and advanced features.' },
  { q: 'Which platforms does the caption generator support?', a: 'Media Wizard generates captions for Instagram, TikTok, Twitter/X, LinkedIn, YouTube, and YouTube Shorts. Each platform has different formatting, tone, and length requirements — the AI accounts for all of them.' },
  { q: 'How is this different from using ChatGPT for captions?', a: 'ChatGPT is a general-purpose tool. Media Wizard\'s caption generator is trained specifically on high-performing social media content, which means outputs are already formatted for your platform, appropriately length-optimized, and structured for engagement — without requiring complex prompting.' },
  { q: 'Can I generate captions in bulk?', a: 'Yes. Pro plan users can generate multiple caption variations per topic and use the Content Planner to batch-create content for an entire week at once.' },
  { q: 'Does the AI add hashtags automatically?', a: 'Yes. The caption generator includes relevant hashtag suggestions for each output, curated to match your niche and platform. You can edit or remove hashtags before copying.' },
];

const FEATURES = [
  { title: 'Platform-specific outputs', body: 'Instagram captions look nothing like TikTok hooks. The AI adapts format, length, and tone automatically.' },
  { title: 'Multiple tone options', body: 'Choose motivational, humorous, professional, educational, or casual — the AI applies your selected voice consistently.' },
  { title: 'Hashtag generation', body: 'Every caption includes platform-relevant hashtags curated to your niche, not generic bulk hashtags.' },
  { title: 'Save your favorites', body: 'One-click save to your caption library. Access and copy any saved caption anytime from your dashboard.' },
  { title: 'Multiple variations', body: 'Generate 5 caption options per topic. Choose the best fit or mix elements from different outputs.' },
  { title: 'Under 2 seconds', body: 'From topic to ready-to-post caption in under 2 seconds. Your time is better spent creating, not writing.' },
];

interface Props {
  onGetStarted: () => void;
  navigate: (path: string) => void;
}

export function AiCaptionGeneratorPage({ onGetStarted, navigate }: Props) {
  const seo = SEO_PAGES.aiCaptionGenerator;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead seo={seo} />
      <FAQSchema faqs={FAQS} />
      <SoftwareAppSchema
        name="Media Wizard AI Caption Generator"
        description={seo.description}
        url={seo.canonical}
      />

      <SeoNav onGetStarted={onGetStarted} navigate={navigate} showBack />

      {/* HERO */}
      <section className="pt-20 pb-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-blue-100">
            <Zap className="w-3.5 h-3.5" />
            Free AI Caption Generator
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
            AI Caption Generator —<br />
            <span className="text-blue-600">Create Viral Captions Online</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-8">
            Generate scroll-stopping social media captions for Instagram, TikTok, YouTube, LinkedIn, and Twitter in under 2 seconds. The best free AI caption generator built specifically for creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-700 transition"
            >
              Generate Captions for Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-50 transition"
            >
              See Examples
            </button>
          </div>
          <p className="text-sm text-gray-400">No credit card required &nbsp;·&nbsp; 50 free credits to start</p>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              The AI Caption Generator Built for Every Platform
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Not generic AI output. Platform-specific captions trained on high-performing creator content — formatted correctly from the first generation.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1 text-sm">{f.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              From Topic to Caption in 3 Steps
            </h2>
            <p className="text-gray-500 text-lg">No prompt engineering. No guessing. Just results.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Choose your platform and tone', body: 'Select Instagram, TikTok, YouTube, LinkedIn, or Twitter. Choose your tone — motivational, humorous, professional, or casual.' },
              { n: '02', title: 'Enter your topic', body: 'Type a few words about your content. The more specific, the better the output. No lengthy prompts required.' },
              { n: '03', title: 'Get 5 ready-to-post captions', body: 'The AI generates 5 caption variations in under 2 seconds. Copy, save, or regenerate in one click.' },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="text-5xl font-extrabold text-gray-100 mb-3 select-none">{step.n}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              <Sparkles className="w-4 h-4" />
              Generate Your First Caption Free
            </button>
          </div>
        </div>
      </section>

      {/* PLATFORM LINKS */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Platform-Specific Caption Generators</h2>
          <p className="text-gray-500 mb-8">Each platform has a dedicated generator tuned to its format and algorithm.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Instagram Caption Generator', href: '/ai-instagram-caption-generator' },
              { label: 'TikTok Caption Generator', href: '/ai-tiktok-caption-generator' },
              { label: 'YouTube Script Generator', href: '/ai-youtube-script-generator' },
              { label: 'AI Thumbnail Generator', href: '/ai-thumbnail-generator' },
            ].map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className="text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full hover:bg-blue-100 transition"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-xl p-5">
                <p className="font-semibold text-gray-900 mb-2 text-sm">{faq.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        headline="Start Generating Viral Captions for Free"
        sub="Join 8,000+ creators who stopped staring at blank caption boxes and started posting content that grows their audience."
        label="Try It Free — No Card Needed"
        onGetStarted={onGetStarted}
      />

      <RelatedTools exclude="/ai-caption-generator" onGetStarted={onGetStarted} navigate={navigate} />
    </div>
  );
}
