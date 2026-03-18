import { useState } from 'react';
import {
  Sparkles, Zap, Clock, TrendingUp, CheckCircle, ChevronDown,
  ArrowRight, Star, FileText, Image, ScrollText, LayoutGrid,
  Twitter, Instagram, Youtube, Linkedin, Play
} from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Mia Torres',
    handle: '@mia.creates',
    role: 'Lifestyle Creator · 280K followers',
    quote: 'I used to spend 2 hours just writing captions. Media Wizard cuts that to 5 minutes. My engagement went up 40% in the first month.',
    avatar: 'MT',
  },
  {
    name: 'Daniel Kim',
    handle: '@danielkmedia',
    role: 'YouTuber · 120K subscribers',
    quote: 'The script generator is insane. I paste my topic, get a full structured script, and my watch time has never been better.',
    avatar: 'DK',
  },
  {
    name: 'Priya Shah',
    handle: '@priyamarketing',
    role: 'Social Media Manager · Agency Owner',
    quote: "Managing 8 clients was impossible without AI. Now I generate a week's worth of content for each brand in under an hour.",
    avatar: 'PS',
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Caption Generator',
    badge: 'Most Popular',
    description: 'Generate scroll-stopping captions for Instagram, TikTok, LinkedIn, and Twitter — tuned to your tone, niche, and platform.',
    useCase: 'Perfect for influencers and brands who post daily but hate staring at a blank screen.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: LayoutGrid,
    title: 'Content & Post Generator',
    badge: null,
    description: 'Plan full content calendars. Generate threads, carousels, and standalone posts that are optimized to drive reach and engagement.',
    useCase: 'Ideal for social media managers running multiple accounts or brands.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: ScrollText,
    title: 'YouTube Script Generator',
    badge: null,
    description: 'Get structured, hook-first scripts for any video topic. Built-in CTAs, chapter breakdowns, and retention-focused storytelling.',
    useCase: "YouTubers who want to stop winging it and actually grow their channel's watch time.",
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Image,
    title: 'AI Thumbnail Generator',
    badge: 'New',
    description: 'Describe your video and get professional thumbnail concepts generated instantly — ready to hand off to your designer or use as-is.',
    useCase: 'For creators who know thumbnails drive clicks but lack a dedicated design team.',
    color: 'bg-rose-50 text-rose-600',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Enter your idea or topic',
    description: 'Type in a few words about what you want to create. No lengthy prompts needed — Media Wizard figures out the rest.',
  },
  {
    number: '02',
    title: 'Generate content instantly',
    description: 'Our AI produces platform-optimized content in seconds. Captions, scripts, posts, thumbnails — all in one place.',
  },
  {
    number: '03',
    title: 'Copy, refine, and post',
    description: 'Tweak anything with one click. Save your favorites and publish directly to your workflow.',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'For creators just getting started.',
    credits: '50 credits / month',
    features: ['Caption Generator', 'Basic models', 'Instagram, TikTok, Twitter', '5 saved captions'],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Hobby',
    price: '$10',
    period: '/mo',
    description: 'For consistent creators who post regularly.',
    credits: '500 credits / month',
    features: ['All generators (captions, posts, scripts)', 'Advanced AI models', 'All platforms', 'Unlimited saves', 'Priority support'],
    cta: 'Start Hobby Plan',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$20',
    period: '/mo',
    description: 'For agencies and power users at scale.',
    credits: '2,000 credits / month',
    features: ['Everything in Hobby', 'Thumbnail Generator', 'GPT-4o & premium models', 'Bulk content generation', 'Early feature access'],
    cta: 'Go Pro',
    highlight: false,
  },
];

const FAQS = [
  {
    q: 'What is an AI content generator?',
    a: "An AI content generator uses large language models to produce written content — captions, scripts, posts — based on your input. Media Wizard is purpose-built for social media creators, so every output is optimized for engagement, not just grammatically correct.",
  },
  {
    q: 'How does Media Wizard help me go viral?',
    a: 'Virality is pattern-based. Our AI is trained on high-performing content structures, hooks, and formats across platforms. You still bring the ideas; we give them the shape that performs.',
  },
  {
    q: 'Is Media Wizard free to use?',
    a: 'Yes. The Free plan gives you 50 credits per month with access to the Caption Generator — no credit card required. Upgrade anytime for more credits and tools.',
  },
  {
    q: 'Which platforms does Media Wizard support?',
    a: 'Instagram, TikTok, Twitter/X, LinkedIn, YouTube, and YouTube Shorts. Each platform has tailored outputs — TikTok captions look nothing like LinkedIn posts.',
  },
  {
    q: 'Can I use it to generate YouTube scripts?',
    a: 'Absolutely. The YouTube Script Generator produces hook-first, chapter-structured scripts optimized for watch time and audience retention.',
  },
  {
    q: 'What is a credit?',
    a: 'One credit = one AI generation. Generating a caption uses 1 credit. Scripts or thumbnails may use 2–5 credits depending on length and model selected.',
  },
  {
    q: 'How is this different from ChatGPT?',
    a: "ChatGPT is a general-purpose tool. Media Wizard is built specifically for content creators — with platform-specific templates, saved content libraries, and tools like thumbnail and script generators all in one dashboard.",
  },
  {
    q: 'Do I need any AI or technical experience?',
    a: 'None whatsoever. If you can type a topic into a search bar, you can use Media Wizard. Most users generate their first caption in under 60 seconds.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left gap-4"
      >
        <span className="font-semibold text-gray-900 text-base">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-gray-600 leading-relaxed text-sm">{a}</p>
      )}
    </div>
  );
}

const PLATFORMS = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'TikTok', icon: Play, color: 'text-gray-900' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { name: 'Twitter / X', icon: Twitter, color: 'text-sky-500' },
  { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
];

export function Landing({ onGetStarted, navigate }: { onGetStarted: () => void; navigate: (path: string) => void }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-6xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Media Wizard</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition">Pricing</a>
            <button onClick={() => navigate('/blog')} className="hover:text-gray-900 transition">Blog</button>
            <button onClick={() => navigate('/ai-caption-generator')} className="hover:text-gray-900 transition">AI Tools</button>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-20 pb-24 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-blue-100">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Content Creation for Creators
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-6">
            Generate Viral Content<br />
            <span className="text-blue-600">10x Faster</span> with AI
          </h1>

          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
            Media Wizard is the AI content generator built for creators, influencers, and social media managers. Captions, scripts, posts, and thumbnails — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-700 transition shadow-sm"
            >
              Start Creating for Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-50 transition"
            >
              See How It Works
            </button>
          </div>

          <p className="text-sm text-gray-400">No credit card required &nbsp;·&nbsp; 50 free credits to start &nbsp;·&nbsp; Cancel anytime</p>

          {/* Mock product preview */}
          <div className="mt-16 bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left max-w-3xl mx-auto shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400 ml-2 font-mono">media-wizard.app · Caption Generator</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-500">
                Topic: <span className="text-gray-900 font-medium">Morning routine tips for productivity</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['Instagram', 'Motivational', 'Medium length'].map(tag => (
                  <span key={tag} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full font-medium">{tag}</span>
                ))}
              </div>
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-4 text-sm text-gray-800 leading-relaxed">
                <span className="text-blue-600 font-semibold">Your 5 AM is your edge.</span> While the world sleeps, you compound. Here's what my non-negotiable morning routine looks like — and why it changed everything. Thread below.
                <div className="mt-2 text-gray-400 text-xs">#MorningRoutine #Productivity #CreatorLife</div>
              </div>
              <div className="flex gap-2">
                <span className="text-xs text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Generated in 1.2s
                </span>
                <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">1 credit used</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF STATS */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-10">Trusted by creators worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-14">
            {[
              { stat: '50,000+', label: 'Captions generated' },
              { stat: '8,000+', label: 'Active creators' },
              { stat: '5 platforms', label: 'Fully supported' },
              { stat: '< 2 seconds', label: 'Average generation time' },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-gray-900 mb-1">{stat}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Content creation is <span className="line-through text-gray-300">simple</span> exhausting.
          </h2>
          <p className="text-lg text-gray-500 mb-16 leading-relaxed">
            You know you need to post. You open the app. You stare. You close the app.
            Sound familiar?
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: Clock,
                title: "Hours lost writing",
                body: "The average creator spends 4+ hours per week just writing captions and scripts. That's time you could spend actually creating.",
              },
              {
                icon: TrendingUp,
                title: "Engagement that flatlines",
                body: "Generic captions get ignored. Platform algorithms punish low engagement. You need copy that hooks — not filler.",
              },
              {
                icon: FileText,
                title: "Content calendar chaos",
                body: "Staying consistent across 3+ platforms without a system is a full-time job. Most creators burn out in 90 days.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="border border-gray-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">The Solution</p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            One AI tool. Every piece of content you need.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Media Wizard replaces your blank-page paralysis with AI that understands platforms, audiences, and what actually performs. Stop guessing. Start growing.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-100 transition"
          >
            Try It Free — No Card Needed
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Everything you need to create content that performs
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="border border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.color}`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  {f.badge && (
                    <span className="text-xs font-semibold bg-gray-900 text-white px-3 py-1 rounded-full">{f.badge}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{f.description}</p>
                <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-500"><span className="font-semibold text-gray-700">Best for:</span> {f.useCase}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">Works for every major platform</p>
          <div className="flex flex-wrap justify-center gap-8">
            {PLATFORMS.map(({ name, icon: Icon, color }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center shadow-sm">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-xs font-medium text-gray-600">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              From idea to post in 60 seconds
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center">
                <div className="text-5xl font-extrabold text-gray-100 mb-4 select-none">{step.number}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition"
            >
              Try It Yourself — It's Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Start free. Scale when you're ready.
            </h2>
            <p className="text-gray-500 mt-4 text-lg">No hidden fees. No subscriptions that trap you. Just results.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border ${
                  plan.highlight
                    ? 'bg-gray-900 text-white border-gray-900 shadow-xl'
                    : 'bg-white border-gray-200'
                }`}
              >
                {plan.highlight && (
                  <span className="inline-block text-xs font-semibold bg-blue-500 text-white px-3 py-1 rounded-full mb-4">Most Popular</span>
                )}
                <p className={`text-sm font-semibold mb-2 ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.period && <span className={`text-sm ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{plan.period}</span>}
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
                <div className={`text-xs font-semibold px-3 py-2 rounded-lg mb-6 ${plan.highlight ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-700'}`}>
                  {plan.credits}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-blue-400' : 'text-green-500'}`} />
                      <span className={plan.highlight ? 'text-gray-300' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 rounded-xl font-semibold transition text-sm ${
                    plan.highlight
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight tracking-tight">
            Your next viral post starts here.
          </h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            Join thousands of creators who stopped staring at blank screens and started posting content that actually grows their audience.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-xl text-base font-bold hover:bg-blue-50 transition shadow-md"
          >
            Start Creating for Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-blue-200 text-sm mt-5">No credit card required &nbsp;·&nbsp; 50 free credits &nbsp;·&nbsp; Instant access</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Common questions, honest answers</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900">Media Wizard</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                The AI content generator built for creators. Captions, posts, scripts, and thumbnails — all in one platform.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-3">Product</p>
                <ul className="space-y-2 text-gray-500">
                  <li><a href="#features" className="hover:text-gray-900 transition">Features</a></li>
                  <li><a href="#pricing" className="hover:text-gray-900 transition">Pricing</a></li>
                  <li><a href="#how-it-works" className="hover:text-gray-900 transition">How It Works</a></li>
                  <li><button onClick={() => navigate('/blog')} className="hover:text-gray-900 transition text-left">Blog</button></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-3">AI Tools</p>
                <ul className="space-y-2 text-gray-500">
                  <li><button onClick={() => navigate('/ai-caption-generator')} className="hover:text-gray-900 transition text-left">Caption Generator</button></li>
                  <li><button onClick={() => navigate('/ai-instagram-caption-generator')} className="hover:text-gray-900 transition text-left">Instagram Captions</button></li>
                  <li><button onClick={() => navigate('/ai-youtube-script-generator')} className="hover:text-gray-900 transition text-left">YouTube Scripts</button></li>
                  <li><button onClick={() => navigate('/ai-tiktok-caption-generator')} className="hover:text-gray-900 transition text-left">TikTok Captions</button></li>
                  <li><button onClick={() => navigate('/ai-thumbnail-generator')} className="hover:text-gray-900 transition text-left">Thumbnail Generator</button></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-3">Captions by Niche</p>
                <ul className="space-y-2 text-gray-500">
                  <li><button onClick={() => navigate('/instagram-captions-for-fitness')} className="hover:text-gray-900 transition text-left">Fitness Captions</button></li>
                  <li><button onClick={() => navigate('/instagram-captions-for-food')} className="hover:text-gray-900 transition text-left">Food Captions</button></li>
                  <li><button onClick={() => navigate('/instagram-captions-for-travel')} className="hover:text-gray-900 transition text-left">Travel Captions</button></li>
                  <li><button onClick={() => navigate('/instagram-captions-for-fashion')} className="hover:text-gray-900 transition text-left">Fashion Captions</button></li>
                  <li><button onClick={() => navigate('/instagram-captions-for-business')} className="hover:text-gray-900 transition text-left">Business Captions</button></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-3">Legal</p>
                <ul className="space-y-2 text-gray-500">
                  <li><span className="cursor-default">Privacy Policy</span></li>
                  <li><span className="cursor-default">Terms of Service</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Media Wizard. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-700 transition"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="text-gray-400 hover:text-gray-700 transition"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="text-gray-400 hover:text-gray-700 transition"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
