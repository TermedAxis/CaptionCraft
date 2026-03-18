import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react';
import { SEOHead } from '../../seo/SEOHead';
import { ArticleSchema, BreadcrumbSchema } from '../../seo/SchemaMarkup';
import { getBlogSEO, SITE_URL } from '../../seo/seo-config';
import { BLOG_POSTS, BlogPost, BlogSection } from '../../seo/blog-posts';
import { RelatedTools } from '../../seo/RelatedTools';
import { SeoNav } from './SeoNav';

function renderSection(section: BlogSection, i: number, onGetStarted: () => void, navigate: (p: string) => void) {
  switch (section.type) {
    case 'heading2':
      return <h2 key={i} className="text-2xl font-extrabold text-gray-900 mt-10 mb-4 leading-tight">{section.text}</h2>;
    case 'heading3':
      return <h3 key={i} className="text-lg font-bold text-gray-900 mt-7 mb-3">{section.text}</h3>;
    case 'paragraph':
      return <p key={i} className="text-gray-600 leading-relaxed mb-5">{section.text}</p>;
    case 'list':
      return (
        <ul key={i} className="space-y-2 mb-6 pl-1">
          {section.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
              <span className="text-blue-500 mt-1.5 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'numbered':
      return (
        <ol key={i} className="space-y-3 mb-6">
          {section.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{j + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case 'cta':
      return (
        <div key={i} className="my-10 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
          <p className="text-gray-700 leading-relaxed mb-5 text-sm">{section.ctaText}</p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition"
          >
            {section.ctaLabel || 'Try It Free'}
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-gray-400 mt-3">No credit card required · 50 free credits</p>
        </div>
      );
    default:
      return null;
  }
}

interface Props {
  slug: string;
  onGetStarted: () => void;
  navigate: (path: string) => void;
}

export function BlogPostPage({ slug, onGetStarted, navigate }: Props) {
  const post: BlogPost | undefined = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-2xl font-bold text-gray-900">Article not found</p>
        <button onClick={() => navigate('/blog')} className="text-blue-600 font-medium hover:underline">
          Back to Blog
        </button>
      </div>
    );
  }

  const seo = getBlogSEO(post.slug, post.title, post.description);
  const breadcrumbs = [
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Blog', url: `${SITE_URL}/blog` },
    { name: post.title, url: seo.canonical },
  ];

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead seo={seo} />
      <ArticleSchema
        title={post.title}
        description={post.description}
        url={seo.canonical}
        datePublished={post.date}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <SeoNav onGetStarted={onGetStarted} navigate={navigate} showBack />

      {/* ARTICLE HEADER */}
      <header className="pt-12 pb-10 px-6 border-b border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">{post.title}</h1>
          <p className="text-gray-500 text-lg leading-relaxed">{post.description}</p>
        </div>
      </header>

      {/* ARTICLE BODY */}
      <article className="py-10 px-6">
        <div className="max-w-3xl mx-auto">
          {/* TOOL LINKS */}
          {post.relatedTools.length > 0 && (
            <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold text-gray-500">Try these tools:</span>
              {post.relatedTools.map((href) => {
                const labels: Record<string, string> = {
                  '/ai-caption-generator': 'AI Caption Generator',
                  '/ai-instagram-caption-generator': 'Instagram Caption Generator',
                  '/ai-youtube-script-generator': 'YouTube Script Generator',
                  '/ai-tiktok-caption-generator': 'TikTok Caption Generator',
                  '/ai-thumbnail-generator': 'Thumbnail Generator',
                };
                return (
                  <button
                    key={href}
                    onClick={() => navigate(href)}
                    className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"
                  >
                    {labels[href] || href}
                  </button>
                );
              })}
            </div>
          )}

          {post.content.map((section, i) => renderSection(section, i, onGetStarted, navigate))}
        </div>
      </article>

      {/* RELATED POSTS */}
      {relatedPosts.length > 0 && (
        <section className="py-12 px-6 bg-gray-50 border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {relatedPosts.map((related) => (
                <button
                  key={related.slug}
                  onClick={() => navigate(`/blog/${related.slug}`)}
                  className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition group"
                >
                  <p className="text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition leading-snug">{related.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{related.description}</p>
                  <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-semibold mt-3">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">Put This Into Practice with AI</h2>
          <p className="text-gray-400 mb-8">Media Wizard gives you AI-powered tools for captions, scripts, thumbnails, and content planning. Free to start with 50 credits every month.</p>
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
