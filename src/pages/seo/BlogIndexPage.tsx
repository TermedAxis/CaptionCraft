import { ArrowRight, Clock } from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';
import { SEO_PAGES } from '../../seo/seo-config';
import { BLOG_POSTS } from '../../seo/blog-posts';
import { SeoNav } from './SeoNav';
import { RelatedTools } from '../../seo/RelatedTools';

const CATEGORY_COLORS: Record<string, string> = {
  Instagram: 'bg-pink-50 text-pink-700 border-pink-100',
  YouTube: 'bg-red-50 text-red-700 border-red-100',
  TikTok: 'bg-gray-100 text-gray-700 border-gray-200',
  'AI Tools': 'bg-blue-50 text-blue-700 border-blue-100',
  Strategy: 'bg-green-50 text-green-700 border-green-100',
  'Creator Life': 'bg-amber-50 text-amber-700 border-amber-100',
  LinkedIn: 'bg-sky-50 text-sky-700 border-sky-100',
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] || 'bg-gray-50 text-gray-600 border-gray-200';
}

interface Props {
  onGetStarted: () => void;
  navigate: (path: string) => void;
}

export function BlogIndexPage({ onGetStarted, navigate }: Props) {
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead seo={SEO_PAGES.blog} />

      <SeoNav onGetStarted={onGetStarted} navigate={navigate} showBack />

      {/* HEADER */}
      <section className="pt-16 pb-12 px-6 border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Media Wizard Blog</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            AI Content Creation Tips<br />for Creators
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl">
            Guides, strategies, and playbooks for Instagram, YouTube, and TikTok creators who want to grow faster with AI.
          </p>
        </div>
      </section>

      {/* FEATURED POST */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Featured Article</p>
          <button
            onClick={() => navigate(`/blog/${featured.slug}`)}
            className="w-full text-left bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:border-blue-200 hover:shadow-sm transition group"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-semibold border px-3 py-1 rounded-full ${getCategoryColor(featured.category)}`}>
                {featured.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                {featured.readingTime}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-600 transition leading-tight">
              {featured.title}
            </h2>
            <p className="text-gray-500 leading-relaxed mb-5">{featured.description}</p>
            <span className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm">
              Read Article
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section className="py-6 pb-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">All Articles</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {rest.map((post) => (
              <button
                key={post.slug}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="text-left bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-sm transition group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold border px-2.5 py-0.5 rounded-full ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {post.readingTime}
                  </span>
                </div>
                <h2 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{post.description}</p>
                <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-semibold mt-3">
                  Read <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">Put These Strategies Into Practice</h2>
          <p className="text-gray-400 mb-8">Media Wizard gives you AI tools for captions, scripts, thumbnails, and content planning — all in one place. Free to start.</p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition"
          >
            Start Creating for Free
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <RelatedTools onGetStarted={onGetStarted} navigate={navigate} />
    </div>
  );
}
