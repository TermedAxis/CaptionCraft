import { CheckCircle, ArrowRight, Sparkles, Zap, Instagram } from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';
import { FAQSchema, SoftwareAppSchema } from '../../seo/SchemaMarkup';
import { SEO_PAGES } from '../../seo/seo-config';
import { RelatedTools } from '../../seo/RelatedTools';
import { SeoNav } from './SeoNav';
import { CtaBanner } from './CtaBanner';

const FAQS = [
  { q: 'What makes a good Instagram caption?', a: 'A high-performing Instagram caption has a strong first line (since Instagram truncates at 3 lines), includes a clear call-to-action, uses relevant niche hashtags, and speaks directly to the target audience\'s interests or pain points. Media Wizard\'s AI generates captions that meet all of these criteria.' },
  { q: 'How long should an Instagram caption be?', a: 'Instagram engagement research shows peaks at either 138-150 characters (short, punchy) or 1,000+ characters (storytelling). The dead zone is 200-900 characters. Media Wizard offers both short-form and long-form caption options.' },
  { q: 'How many hashtags should I use on Instagram?', a: 'Instagram\'s own data recommends 3-5 targeted hashtags over 30 generic ones. Media Wizard generates 5-10 niche-specific hashtags for every caption — no keyword stuffing, just relevant tags that match your content.' },
  { q: 'Is the Instagram caption generator free?', a: 'Yes. Media Wizard gives you 50 free credits per month — no credit card required. Each Instagram caption generation uses 1 credit. Upgrade to Hobby ($10/mo) or Pro ($20/mo) for more credits.' },
  { q: 'Can I use this for Instagram Reels captions?', a: 'Absolutely. You can select "Instagram Reels" as your content type and the AI will generate hook-first captions with appropriate formatting and hashtags for Reels content specifically.' },
  { q: 'What niches does the generator cover?', a: 'All of them. From fitness, fashion, and food to real estate, finance, and education — the AI generates high-performing Instagram captions for any niche or topic you input.' },
];

const EXAMPLES = [
  { topic: 'Morning workout routine', caption: 'Your 5 AM is your edge. While the world sleeps, you compound. Here\'s what my non-negotiable morning routine looks like — and why it changed everything. Thread below.\n\n#MorningRoutine #Productivity #FitnessMotivation', label: 'Fitness • Motivational' },
  { topic: 'New listing in real estate', caption: 'Not just selling a house — selling a lifestyle. And this one? It\'s exceptional. Swipe to see every room.\n\n#JustListed #DreamHome #RealEstate #HomeBuying', label: 'Real Estate • Professional' },
  { topic: 'Healthy pasta recipe', caption: 'Life is short. Eat the good pasta. 🍝 Made this in 20 minutes, looks like it took hours. Recipe in bio.\n\n#FoodPhotography #PastaLovers #HealthyRecipes #EasyDinner', label: 'Food • Casual' },
];

interface Props {
  onGetStarted: () => void;
  navigate: (path: string) => void;
}

export function InstagramCaptionPage({ onGetStarted, navigate }: Props) {
  const seo = SEO_PAGES.instagramCaptionGenerator;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead seo={seo} />
      <FAQSchema faqs={FAQS} />
      <SoftwareAppSchema
        name="Media Wizard Instagram Caption Generator"
        description={seo.description}
        url={seo.canonical}
      />

      <SeoNav onGetStarted={onGetStarted} navigate={navigate} showBack />

      {/* HERO */}
      <section className="pt-20 pb-20 px-6 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-pink-100">
            <Instagram className="w-3.5 h-3.5" />
            Free Instagram Caption Generator
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
            AI Instagram Caption Generator<br />
            <span className="text-pink-500">Create Viral Posts in Seconds</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-8">
            Generate perfect Instagram captions with hashtags, emojis, and engagement-optimized copy for any niche. The best free AI Instagram caption generator — no sign-up required to try.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-700 transition mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Generate Instagram Captions Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-sm text-gray-400">50 free credits · No card required</p>
        </div>
      </section>

      {/* EXAMPLE CAPTIONS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              See What the AI Generates
            </h2>
            <p className="text-gray-500 text-lg">Real examples — platform-optimized, ready to post.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {EXAMPLES.map((ex) => (
              <div key={ex.topic} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold bg-pink-50 text-pink-600 border border-pink-100 px-3 py-1 rounded-full">{ex.label}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-400 mb-1 font-medium">Topic</p>
                  <p className="text-sm text-gray-700 font-medium">{ex.topic}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium">Generated Caption</p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{ex.caption}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 bg-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-pink-600 transition"
            >
              Generate Your Caption Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* WHAT MAKES CAPTIONS WORK */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              What Makes an Instagram Caption Go Viral?
            </h2>
            <p className="text-gray-500 text-lg">Our AI applies all of these principles automatically.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: 'A hook that earns the "more" click', body: 'Instagram truncates captions after 3 lines. Your opening sentence must be strong enough to stop the scroll and earn a click to read more.' },
              { title: 'Platform-appropriate length', body: 'Instagram engagement peaks at under 150 characters (punchy) or over 1,000 characters (storytelling). The AI chooses the right length for your content type.' },
              { title: 'A clear call to action', body: 'Posts with a CTA (comment, save, share, tag someone) get 89% more engagement than those without. Every caption ends with the right ask.' },
              { title: 'Niche-specific hashtags', body: '#Fitness has 400M+ posts. #StrengthTrainingForWomen has 2M. We generate niche hashtags that can actually get you discovered.' },
              { title: 'Your tone, not robot-speak', body: 'Choose motivational, humorous, educational, or professional. The AI adapts its voice to match yours, not sound like a content machine.' },
              { title: 'Emoji strategy', body: 'Strategic emoji use increases engagement by up to 48%. The AI places emojis where they enhance, not distract.' },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5">
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

      {/* NICHE PAGES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Browse Captions by Niche</h2>
          <p className="text-gray-500 mb-8 text-sm">30+ pre-generated Instagram captions for every major niche.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['fitness', 'real-estate', 'food', 'travel', 'fashion', 'beauty', 'wellness', 'photography', 'business', 'pets'].map((niche) => (
              <button
                key={niche}
                onClick={() => navigate(`/instagram-captions-for-${niche}`)}
                className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition capitalize"
              >
                {niche.replace(/-/g, ' ')} Captions
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
        headline="Generate Viral Instagram Captions Now"
        sub="Stop spending 30 minutes writing captions. Get 5 AI-generated options in under 2 seconds — free forever with no credit card."
        label="Try It Free"
        onGetStarted={onGetStarted}
      />

      <RelatedTools exclude="/ai-instagram-caption-generator" onGetStarted={onGetStarted} navigate={navigate} />
    </div>
  );
}
