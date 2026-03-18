import { CheckCircle, ArrowRight, Image, Zap } from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';
import { FAQSchema, SoftwareAppSchema } from '../../seo/SchemaMarkup';
import { SEO_PAGES } from '../../seo/seo-config';
import { RelatedTools } from '../../seo/RelatedTools';
import { SeoNav } from './SeoNav';
import { CtaBanner } from './CtaBanner';

const FAQS = [
  { q: 'What is an AI thumbnail generator?', a: 'An AI thumbnail generator creates professional thumbnail concepts for YouTube videos based on your video description. Media Wizard generates concept briefs including layout, text overlay suggestions, color palette, and visual style — ready to execute in Canva, Photoshop, or hand off to a designer.' },
  { q: 'How does thumbnail CTR affect my YouTube channel?', a: 'Click-through rate (CTR) is one of YouTube\'s most important ranking signals. A 2% CTR is average. 5%+ puts you in the top tier. The thumbnail is the primary lever for improving CTR — improving from 2% to 5% can double your views on the same content.' },
  { q: 'Is the AI thumbnail generator free?', a: 'Yes. Media Wizard includes thumbnail generation in the free plan (50 credits/month, no credit card required). Thumbnail generation uses 2 credits per concept set.' },
  { q: 'What does the thumbnail generator actually produce?', a: 'The generator produces: a visual concept description with specific layout guidance, text overlay recommendations (font weight, placement, character limits), color palette suggestions with contrast rationale, and facial expression/subject guidance if applicable.' },
  { q: 'Do I need design skills to use these concepts?', a: 'No. The concepts are detailed enough to execute in Canva (free) without prior design experience. More experienced creators use them as briefs for a designer or as starting points in Photoshop.' },
  { q: 'Can the generator create thumbnails for all YouTube niches?', a: 'Yes. The AI adapts its concept recommendations based on your niche and video topic — fitness thumbnails look different from finance thumbnails, and the generator accounts for these style conventions.' },
];

const THUMBNAIL_ELEMENTS = [
  { title: 'Layout concept', body: 'Specific guidance on subject placement, background choice, and overall visual composition.' },
  { title: 'Text overlay', body: '3-5 word maximum, font weight recommendation, and placement guidance for maximum readability at 120px thumbnail size.' },
  { title: 'Color palette', body: 'Background and foreground colors chosen for contrast against YouTube\'s grey/white interface to maximize visibility.' },
  { title: 'Emotional expression', body: 'Guidance on the facial expression that drives the highest click-through rate for your specific video topic.' },
  { title: 'Brand consistency', body: 'Suggestions for maintaining a consistent visual style across your channel for recognizability and trust.' },
  { title: 'Split-test variant', body: 'A second concept variation for A/B testing, since small thumbnail changes can significantly impact CTR.' },
];

interface Props {
  onGetStarted: () => void;
  navigate: (path: string) => void;
}

export function ThumbnailGeneratorPage({ onGetStarted, navigate }: Props) {
  const seo = SEO_PAGES.thumbnailGenerator;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead seo={seo} />
      <FAQSchema faqs={FAQS} />
      <SoftwareAppSchema
        name="Media Wizard AI Thumbnail Generator"
        description={seo.description}
        url={seo.canonical}
      />

      <SeoNav onGetStarted={onGetStarted} navigate={navigate} showBack />

      {/* HERO */}
      <section className="pt-20 pb-20 px-6 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-orange-100">
            <Image className="w-3.5 h-3.5" />
            Free AI Thumbnail Generator
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
            AI Thumbnail Generator —<br />
            <span className="text-orange-500">Create Click-Worthy YouTube Thumbnails</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-8">
            Describe your video and get professional thumbnail concepts with layout, text, color palette, and expression guidance. Boost your CTR without a dedicated design team.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-orange-600 transition mb-4"
          >
            <Image className="w-4 h-4" />
            Generate Thumbnail Concepts Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-sm text-gray-400">50 free credits · No card required</p>
        </div>
      </section>

      {/* CTR STATS */}
      <section className="py-12 px-6 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { stat: '2%', label: 'Average YouTube CTR' },
              { stat: '5%+', label: 'Top creator CTR' },
              { stat: '2.5x', label: 'More views at 5% vs 2% CTR' },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold mb-1">{stat}</p>
                <p className="text-orange-100 text-sm">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-orange-200 text-sm mt-6">Your thumbnail is the highest-leverage variable in YouTube growth. Improve it with AI.</p>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Every Concept Includes 6 Elements
            </h2>
            <p className="text-gray-500 text-lg">Not just vague ideas — specific, actionable thumbnail briefs.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {THUMBNAIL_ELEMENTS.map((el) => (
              <div key={el.title} className="border border-gray-200 rounded-xl p-6 hover:border-orange-200 transition">
                <CheckCircle className="w-5 h-5 text-orange-500 mb-3" />
                <p className="font-semibold text-gray-900 mb-2 text-sm">{el.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{el.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THUMBNAIL SCIENCE */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
            The Science Behind High-CTR Thumbnails
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Faces outperform objects', body: 'Humans process faces in 13 milliseconds — faster than conscious thought. Thumbnails with expressive faces consistently outperform object-only thumbnails by 38% in click-through rate.' },
              { title: 'High contrast wins at small sizes', body: 'YouTube thumbnails appear at 120px wide on mobile. High contrast between subject and background is essential for visibility. Muted, dark thumbnails disappear in the feed.' },
              { title: 'Text must work at 120px', body: 'Maximum 5 words. Bold, high-contrast, readable font. If you can\'t read it on your phone at thumbnail size, your viewers can\'t either.' },
              { title: 'Curiosity gaps drive clicks', body: 'A thumbnail that implies a payoff without revealing it fully creates an open loop the brain must close. The click is how the brain closes it.' },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-6">
                <p className="font-semibold text-gray-900 mb-2">{f.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">FAQ</h2>
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
        headline="Generate Click-Worthy Thumbnail Concepts Now"
        sub="Describe your video and get professional thumbnail briefs with layout, text, and color guidance. Boost your CTR starting today."
        label="Try Thumbnail Generator Free"
        onGetStarted={onGetStarted}
      />

      <RelatedTools exclude="/ai-thumbnail-generator" onGetStarted={onGetStarted} navigate={navigate} />
    </div>
  );
}
