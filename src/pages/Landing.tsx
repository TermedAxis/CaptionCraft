import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Zap, Clock, TrendingUp, CheckCircle, ChevronDown,
  ArrowRight, Star, FileText, Image, ScrollText, LayoutGrid,
  Twitter, Instagram, Youtube, Linkedin, Play, Copy, Check,
  Hash, MessageSquare, Film, BookOpen
} from 'lucide-react';
import { LogoMark } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

/* ─── Animated counter ──────────────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

/* ─── Typing animation ──────────────────────────────────────────── */
function TypeWriter({ texts }: { texts: string[] }) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setCharIndex(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 1600);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex(c => c - 1);
        } else {
          setDeleting(false);
          setTextIndex(i => (i + 1) % texts.length);
        }
      }
    }, deleting ? 40 : 65);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts]);

  return (
    <span className="text-blue-600 dark:text-blue-400">
      {texts[textIndex].slice(0, charIndex)}
      <span className="inline-block w-0.5 h-10 bg-blue-600 dark:bg-blue-400 ml-1 animate-pulse align-middle" />
    </span>
  );
}

/* ─── Data ───────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Mia Torres',
    handle: '@mia.creates',
    role: 'Lifestyle Creator · 280K followers',
    quote: 'I used to spend 2 hours just writing captions. Media Wizard cuts that to 5 minutes. My engagement went up 40% in the first month.',
    avatar: 'MT',
    stars: 5,
  },
  {
    name: 'Daniel Kim',
    handle: '@danielkmedia',
    role: 'YouTuber · 120K subscribers',
    quote: 'The script generator is insane. I paste my topic, get a full structured script, and my watch time has never been better.',
    avatar: 'DK',
    stars: 5,
  },
  {
    name: 'Priya Shah',
    handle: '@priyamarketing',
    role: 'Social Media Manager · Agency Owner',
    quote: "Managing 8 clients was impossible without AI. Now I generate a week's worth of content for each brand in under an hour.",
    avatar: 'PS',
    stars: 5,
  },
];

const FAQS = [
  { q: 'What is an AI content generator?', a: "An AI content generator uses large language models to produce written content — captions, scripts, posts — based on your input. Media Wizard is purpose-built for social media creators, so every output is optimized for engagement, not just grammatically correct." },
  { q: 'How does Media Wizard help me go viral?', a: 'Virality is pattern-based. Our AI is trained on high-performing content structures, hooks, and formats across platforms. You still bring the ideas; we give them the shape that performs.' },
  { q: 'Is Media Wizard free to use?', a: 'Yes. The Free plan gives you 50 credits per month with access to the Caption Generator — no credit card required. Upgrade anytime for more credits and tools.' },
  { q: 'Which platforms does Media Wizard support?', a: 'Instagram, TikTok, Twitter/X, LinkedIn, YouTube, and YouTube Shorts. Each platform has tailored outputs — TikTok captions look nothing like LinkedIn posts.' },
  { q: 'What is a credit?', a: 'One credit = one AI generation. Generating a caption uses 1 credit. Scripts or thumbnails may use 2–5 credits depending on length and model selected.' },
  { q: 'How is this different from ChatGPT?', a: "ChatGPT is a general-purpose tool. Media Wizard is built specifically for content creators — with platform-specific templates, saved content libraries, and tools like thumbnail and script generators all in one dashboard." },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'For creators just getting started.',
    credits: '50 credits / month',
    features: ['Caption Generator', 'Basic AI model', 'Instagram, TikTok, Twitter', '5 saved captions'],
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

/* ─── Feature demos ──────────────────────────────────────────────── */
function CaptionDemo() {
  const [copied, setCopied] = useState(false);
  const caption = `Your 5 AM is your edge. While the world sleeps, you compound.\n\nHere's my non-negotiable morning routine that changed everything — and why it's the real reason my productivity tripled this year.\n\nSave this. You'll need it.`;
  const tags = '#MorningRoutine #Productivity #CreatorLife #Success';

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-orange-400 rounded-lg flex items-center justify-center">
            <Instagram className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Instagram Caption</span>
        </div>
        <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> 1 credit used
        </span>
      </div>
      <div className="p-5">
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-blue-500 dark:text-blue-400" /> Topic: Morning routine tips
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">{caption}</p>
        <p className="text-sm text-blue-500 dark:text-blue-400 mt-3">{tags}</p>
        <button
          onClick={handleCopy}
          className="mt-4 flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy caption'}
        </button>
      </div>
    </div>
  );
}

function ScriptDemo() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-red-100 dark:bg-red-950 rounded-lg flex items-center justify-center">
            <Youtube className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">YouTube Script - Short (60s)</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2.5 py-1 rounded-full">~140 words</span>
      </div>
      <div className="p-5 space-y-3">
        <div>
          <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Hook (0-5s)</span>
          <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 leading-relaxed">"Most people think going viral is luck. It's not — it's a formula. And today I'm giving it to you for free."</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Main Content</span>
          <ul className="mt-1 space-y-1">
            {['Post at peak hours (7-9am, 5-7pm)', 'Always open with a pattern interrupt', 'End every video with a direct CTA'].map(pt => (
              <li key={pt} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-blue-400 mt-0.5">{'>'}</span> {pt}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">CTA</span>
          <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">"Subscribe for part 2 — I'm breaking down the exact hook formula that got me 2M views."</p>
        </div>
      </div>
    </div>
  );
}

function ContentPlannerDemo() {
  const slides = [
    { num: '01', title: 'The Problem', body: 'Most creators waste hours on content that gets zero traction.' },
    { num: '02', title: 'The Fix', body: 'Post with intent. Use data to know exactly when and what to post.' },
    { num: '03', title: 'Your Action Plan', body: '3 posts/week, each with a clear hook, value, and CTA.' },
    { num: '04', title: 'The Result', body: '10x engagement in 30 days — no guesswork.' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2.5">
        <div className="w-7 h-7 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center">
          <LayoutGrid className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
        </div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Carousel - 4 Slides</span>
        <span className="ml-auto text-xs text-gray-400">LinkedIn</span>
      </div>
      <div className="p-5">
        <div className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-green-500 dark:text-green-400" /> Topic: How to grow your audience in 30 days
        </div>
        <div className="grid grid-cols-2 gap-2">
          {slides.map(slide => (
            <div key={slide.num} className="border border-gray-100 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-700">
              <span className="text-xs font-bold text-gray-300 dark:text-gray-500">{slide.num}</span>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-1">{slide.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{slide.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThumbnailDemo() {
  const concepts = [
    { bg: 'from-blue-600 to-blue-800', title: '10 Habits That Changed My Life', label: 'Bold Yellow Text' },
    { bg: 'from-gray-900 to-gray-700', title: 'I Tried Waking Up at 5AM for 30 Days', label: 'Cinematic Dark' },
    { bg: 'from-orange-500 to-red-600', title: 'The Productivity Secret Nobody Talks About', label: 'High Energy' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2.5">
        <div className="w-7 h-7 bg-rose-100 dark:bg-rose-950 rounded-lg flex items-center justify-center">
          <Image className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
        </div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Thumbnail Concepts - 3 Options</span>
      </div>
      <div className="p-5 grid grid-cols-3 gap-2.5">
        {concepts.map((c, i) => (
          <div key={i} className={`rounded-xl bg-gradient-to-br ${c.bg} aspect-video flex flex-col items-center justify-center p-2 text-center relative overflow-hidden group cursor-pointer`}>
            <p className="text-white text-[9px] font-bold leading-tight">{c.title}</p>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[9px] font-semibold bg-white/20 px-2 py-1 rounded-full">{c.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-5 text-left gap-4">
        <span className="font-semibold text-gray-900 dark:text-white text-base">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-5 text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{a}</p>}
    </div>
  );
}

const PLATFORMS_LIST = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-50' },
  { name: 'TikTok', icon: Play, color: 'text-gray-900', bg: 'bg-gray-100' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-500', bg: 'bg-red-50' },
  { name: 'Twitter / X', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-50' },
  { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-50' },
];

const FEATURE_TABS = [
  { id: 'caption', label: 'Caption Creator', icon: MessageSquare, iconBg: 'bg-pink-100', iconColor: 'text-pink-600', demo: CaptionDemo },
  { id: 'script', label: 'Script Generator', icon: Film, iconBg: 'bg-red-100', iconColor: 'text-red-600', demo: ScriptDemo },
  { id: 'content', label: 'Content Planner', icon: BookOpen, iconBg: 'bg-green-100', iconColor: 'text-green-600', demo: ContentPlannerDemo },
  { id: 'thumbnail', label: 'Thumbnail Generator', icon: Image, iconBg: 'bg-rose-100', iconColor: 'text-rose-600', demo: ThumbnailDemo },
];

/* ─── Main ───────────────────────────────────────────────────────── */
export function Landing({ onGetStarted, navigate }: { onGetStarted: () => void; navigate: (path: string) => void }) {
  const [activeFeatureTab, setActiveFeatureTab] = useState('caption');

  const ActiveDemo = FEATURE_TABS.find(f => f.id === activeFeatureTab)?.demo ?? CaptionDemo;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors">

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LogoMark size={22} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Media Wizard</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-gray-900 dark:hover:text-white transition">Pricing</a>
            <button onClick={() => navigate('/blog')} className="hover:text-gray-900 dark:hover:text-white transition">Blog</button>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={onGetStarted} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-100 transition">
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden bg-white dark:bg-gray-950">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />
        {/* Gradient blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-50 dark:bg-blue-950 rounded-full opacity-60 dark:opacity-30 blur-3xl -z-0" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-blue-100 dark:border-blue-800">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Content Creation — Built for Creators
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.06] tracking-tight mb-6">
            Stop staring at a<br className="hidden md:block" />
            blank screen.<br />
            <TypeWriter texts={['Write faster.', 'Grow your audience.', 'Post with confidence.', 'Go viral.', 'Create smarter.']} />
          </h1>

          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            AI captions, scripts, carousels, and thumbnails — all tuned for the platform and tone that fits your brand.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <button onClick={onGetStarted} className="inline-flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-700 dark:hover:bg-gray-100 transition shadow-sm">
              Start Creating for Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <a href="#features" className="inline-flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              See the Features
            </a>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">No credit card required · 50 free credits · Cancel anytime</p>

          {/* Browser chrome mock */}
          <div className="mt-16 relative">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl shadow-gray-200/80 dark:shadow-black/30 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-1 text-xs text-gray-400 font-mono mx-4">app.mediawizard.com/caption-creator</div>
              </div>

              {/* Fake dashboard layout */}
              <div className="flex min-h-[400px]">
                {/* Sidebar */}
                <div className="w-14 bg-gray-50 dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col items-center py-4 gap-3">
                  {[LayoutGrid, MessageSquare, ScrollText, Image].map((Icon, i) => (
                    <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 1 ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
                {/* Form column */}
                <div className="flex-1 p-6 border-r border-gray-100 dark:border-gray-700 max-w-xs space-y-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Platform</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Instagram', 'TikTok', 'LinkedIn', 'Twitter'].map((p, i) => (
                      <div key={p} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${i === 0 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>{p}</div>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Topic</p>
                  <div className="border border-blue-300 dark:border-blue-600 rounded-lg px-3 py-2 text-xs text-gray-800 dark:text-gray-200 bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-100 dark:ring-blue-900">
                    Morning routine tips for productivity
                  </div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Tone</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Casual', 'Bold', 'Educational'].map((t, i) => (
                      <div key={t} className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center ${i === 0 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>{t}</div>
                    ))}
                  </div>
                  <div className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Generate Caption
                  </div>
                </div>
                {/* Result column */}
                <div className="flex-1 p-6 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full">Version A</span>
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 1.1s</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">Your 5 AM is your edge.</span> While the world sleeps, you compound. Here's my non-negotiable morning routine — and why it changed everything.
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">#MorningRoutine #Productivity #CreatorLife</p>
                  </div>
                  <div className="flex items-center gap-2 mb-1 mt-3">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full">Version B</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 opacity-70">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Want to 10x your focus before 8 AM? This changed everything for me. The routine nobody talks about, broken down step by step.
                    </p>
                    <p className="text-xs text-blue-400 mt-2">#Focus #MorningHacks #Productivity</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating badges */}
            <div className="absolute -left-4 top-1/3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 shadow-lg hidden lg:flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Generated in 1.2s</p>
                <p className="text-xs text-gray-400">1 credit used</p>
              </div>
            </div>
            <div className="absolute -right-4 bottom-1/4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 shadow-lg hidden lg:flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">+40% Engagement</p>
                <p className="text-xs text-gray-400">avg. creator result</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-10">Trusted by creators worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-14">
            {[
              { target: 50000, suffix: '+', label: 'Captions generated' },
              { target: 8000, suffix: '+', label: 'Active creators' },
              { target: 5, suffix: ' platforms', label: 'Fully supported' },
              { target: 2, suffix: 's avg', label: 'Generation time' },
            ].map(({ target, suffix, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                  <Counter target={target} suffix={suffix} />
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Content creation is <span className="line-through text-gray-300 dark:text-gray-600">simple</span> exhausting.
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-16 leading-relaxed">You know you need to post. You open the app. You stare. You close the app. Sound familiar?</p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { icon: Clock, title: 'Hours lost writing', body: "The average creator spends 4+ hours per week just writing captions and scripts. That's time you could spend actually creating.", bg: 'bg-red-50 dark:bg-red-950', color: 'text-red-500' },
              { icon: TrendingUp, title: 'Engagement that flatlines', body: 'Generic captions get ignored. Platform algorithms punish low engagement. You need copy that hooks — not filler.', bg: 'bg-orange-50 dark:bg-orange-950', color: 'text-orange-500' },
              { icon: FileText, title: 'Content calendar chaos', body: 'Staying consistent across 3+ platforms without a system is a full-time job. Most creators burn out in 90 days.', bg: 'bg-amber-50 dark:bg-amber-950', color: 'text-amber-600 dark:text-amber-500' },
            ].map(({ icon: Icon, title, body, bg, color }) => (
              <div key={title} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-gray-300 dark:hover:border-gray-600 transition bg-white dark:bg-gray-900">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION BANNER */}
      <section className="py-20 px-6 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-blue-600 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-blue-400 rounded-full opacity-10 blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">The Solution</p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">One AI tool. Every piece of content you need.</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Media Wizard replaces your blank-page paralysis with AI that understands platforms, audiences, and what actually performs.
          </p>
          <button onClick={onGetStarted} className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-100 transition">
            Try It Free — No Card Needed <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FEATURES WITH LIVE DEMOS */}
      <section id="features" className="py-24 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              Four tools. Infinite content.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">Everything a modern creator needs — without switching between ten different apps.</p>
          </div>

          {/* Tab selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {FEATURE_TABS.map(({ id, label, icon: Icon, iconBg, iconColor }) => (
              <button
                key={id}
                onClick={() => setActiveFeatureTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border ${
                  activeFeatureTab === id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`w-5 h-5 ${iconBg} rounded-md flex items-center justify-center ${activeFeatureTab === id ? 'opacity-90' : ''}`}>
                  <Icon className={`w-3 h-3 ${activeFeatureTab === id ? 'text-white dark:text-gray-900' : iconColor}`} />
                </div>
                {label}
              </button>
            ))}
          </div>

          {/* Demo panel */}
          <div className="max-w-2xl mx-auto">
            <div key={activeFeatureTab} style={{ animation: 'fadeUp 0.3s ease' }}>
              <ActiveDemo />
            </div>
          </div>

          {/* All features grid below */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
            {[
              { icon: MessageSquare, bg: 'bg-pink-50 dark:bg-pink-950', color: 'text-pink-600 dark:text-pink-400', title: 'Caption Creator', badge: 'Most Popular', desc: 'Scroll-stopping captions for any platform, tone, and niche.', platforms: ['Instagram', 'TikTok', 'Twitter', 'LinkedIn'] },
              { icon: ScrollText, bg: 'bg-orange-50 dark:bg-orange-950', color: 'text-orange-600 dark:text-orange-400', title: 'Script Generator', badge: null, desc: 'Hook-first structured scripts for YouTube, Reels, and Shorts.', platforms: ['YouTube', 'Reels', 'TikTok', 'Shorts'] },
              { icon: LayoutGrid, bg: 'bg-green-50 dark:bg-green-950', color: 'text-green-600 dark:text-green-400', title: 'Content Planner', badge: null, desc: 'Full carousels, threads, and social posts generated in one click.', platforms: ['Instagram', 'LinkedIn', 'Twitter'] },
              { icon: Image, bg: 'bg-rose-50 dark:bg-rose-950', color: 'text-rose-600 dark:text-rose-400', title: 'Thumbnail Generator', badge: 'New', desc: 'Professional thumbnail concepts that drive clicks instantly.', platforms: ['YouTube', 'Shorts'] },
            ].map((f) => (
              <div key={f.title} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all group bg-white dark:bg-gray-900">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  {f.badge && <span className="text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2.5 py-1 rounded-full">{f.badge}</span>}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{f.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {f.platforms.map(p => (
                    <span key={p} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-10">Optimized output for every major platform</p>
          <div className="flex flex-wrap justify-center gap-6">
            {PLATFORMS_LIST.map(({ name, icon: Icon, color, bg }) => (
              <div key={name} className="flex flex-col items-center gap-2.5 group cursor-default">
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center shadow-sm border border-white dark:border-gray-700 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">From idea to post in 60 seconds</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%)] right-[calc(16.67%)] h-px bg-gray-200 dark:bg-gray-700 z-0" />
            {[
              { number: '01', icon: Zap, title: 'Enter your idea', body: "Type a few words about what you want to create. No lengthy prompts needed — Media Wizard figures out the rest.", bg: 'bg-blue-50 dark:bg-blue-950', color: 'text-blue-600 dark:text-blue-400' },
              { number: '02', icon: Sparkles, title: 'AI generates instantly', body: 'Platform-optimized content in seconds. Captions, scripts, posts, thumbnails — all in one place.', bg: 'bg-green-50 dark:bg-green-950', color: 'text-green-600 dark:text-green-400' },
              { number: '03', icon: CheckCircle, title: 'Copy, tweak & post', body: 'Adjust anything with one click. Save your favorites and publish to your workflow.', bg: 'bg-orange-50 dark:bg-orange-950', color: 'text-orange-600 dark:text-orange-400' },
            ].map((step) => (
              <div key={step.number} className="text-center relative z-10">
                <div className={`w-16 h-16 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 border-4 border-white dark:border-gray-900 shadow-sm`}>
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>
                <div className="text-xs font-bold text-gray-300 dark:text-gray-600 mb-2">{step.number}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <button onClick={onGetStarted} className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 dark:hover:bg-gray-100 transition">
              Try It Yourself — It's Free <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Start free. Scale when you're ready.</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">No hidden fees. No subscriptions that trap you. Just results.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 border relative ${plan.highlight ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-2xl shadow-gray-900/20 dark:shadow-white/10 scale-105' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-blue-500 text-white px-4 py-1.5 rounded-full">Most Popular</span>
                )}
                <p className={`text-sm font-semibold mb-2 ${plan.highlight ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.period && <span className={`text-sm ${plan.highlight ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>{plan.period}</span>}
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>{plan.description}</p>
                <div className={`text-xs font-semibold px-3 py-2 rounded-lg mb-6 ${plan.highlight ? 'bg-white/10 dark:bg-gray-900/10 text-white dark:text-gray-900' : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'}`}>
                  {plan.credits}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-blue-400 dark:text-blue-600' : 'text-green-500'}`} />
                      <span className={plan.highlight ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={onGetStarted} className={`w-full py-3 rounded-xl font-semibold transition text-sm ${plan.highlight ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-64 bg-white rounded-full opacity-5 blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight tracking-tight">Your next viral post starts here.</h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">Join thousands of creators who stopped staring at blank screens and started posting content that actually grows their audience.</p>
          <button onClick={onGetStarted} className="inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-xl text-base font-bold hover:bg-blue-50 transition shadow-lg">
            Start Creating for Free <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-blue-200 text-sm mt-5">No credit card required · 50 free credits · Instant access</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Common questions, honest answers</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {FAQS.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <LogoMark size={18} />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">Media Wizard</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                The AI content generator built for creators. Captions, posts, scripts, and thumbnails — all in one platform.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-3">Product</p>
                <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                  <li><a href="#features" className="hover:text-gray-900 dark:hover:text-white transition">Features</a></li>
                  <li><a href="#pricing" className="hover:text-gray-900 dark:hover:text-white transition">Pricing</a></li>
                  <li><a href="#how-it-works" className="hover:text-gray-900 dark:hover:text-white transition">How It Works</a></li>
                  <li><button onClick={() => navigate('/blog')} className="hover:text-gray-900 dark:hover:text-white transition text-left">Blog</button></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-3">AI Tools</p>
                <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                  <li><button onClick={() => navigate('/ai-caption-generator')} className="hover:text-gray-900 dark:hover:text-white transition text-left">Caption Generator</button></li>
                  <li><button onClick={() => navigate('/ai-instagram-caption-generator')} className="hover:text-gray-900 dark:hover:text-white transition text-left">Instagram Captions</button></li>
                  <li><button onClick={() => navigate('/ai-youtube-script-generator')} className="hover:text-gray-900 dark:hover:text-white transition text-left">YouTube Scripts</button></li>
                  <li><button onClick={() => navigate('/ai-tiktok-caption-generator')} className="hover:text-gray-900 dark:hover:text-white transition text-left">TikTok Captions</button></li>
                  <li><button onClick={() => navigate('/ai-thumbnail-generator')} className="hover:text-gray-900 dark:hover:text-white transition text-left">Thumbnail Generator</button></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-3">Niches</p>
                <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                  <li><button onClick={() => navigate('/instagram-captions-for-fitness')} className="hover:text-gray-900 dark:hover:text-white transition text-left">Fitness Captions</button></li>
                  <li><button onClick={() => navigate('/instagram-captions-for-food')} className="hover:text-gray-900 dark:hover:text-white transition text-left">Food Captions</button></li>
                  <li><button onClick={() => navigate('/instagram-captions-for-travel')} className="hover:text-gray-900 dark:hover:text-white transition text-left">Travel Captions</button></li>
                  <li><button onClick={() => navigate('/instagram-captions-for-fashion')} className="hover:text-gray-900 dark:hover:text-white transition text-left">Fashion Captions</button></li>
                  <li><button onClick={() => navigate('/instagram-captions-for-business')} className="hover:text-gray-900 dark:hover:text-white transition text-left">Business Captions</button></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-3">Legal</p>
                <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                  <li><span className="cursor-default">Privacy Policy</span></li>
                  <li><span className="cursor-default">Terms of Service</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Media Wizard. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);  }
        }
      `}</style>
    </div>
  );
}
