export const SITE_URL = 'https://mediawizard.app';
export const SITE_NAME = 'Media Wizard';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface PageSEO {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  keywords?: string;
  ogType?: 'website' | 'article';
}

export const SEO_PAGES: Record<string, PageSEO> = {
  home: {
    title: 'Media Wizard – Best Free AI Caption, Script & Thumbnail Generator',
    description: 'Media Wizard is the #1 free AI content generator for creators. Generate viral Instagram captions, YouTube scripts, TikTok hooks, and thumbnail ideas instantly. No credit card required.',
    canonical: `${SITE_URL}/`,
    keywords: 'AI caption generator, Instagram caption generator, YouTube script generator, TikTok caption generator, AI thumbnail generator, viral caption generator, free AI content generator',
  },
  aiCaptionGenerator: {
    title: 'AI Caption Generator – Create Viral Captions Online for Free | Media Wizard',
    description: 'Generate scroll-stopping social media captions instantly with AI. The best free AI caption generator for Instagram, TikTok, LinkedIn, and Twitter. Try it free — no sign-up needed.',
    canonical: `${SITE_URL}/ai-caption-generator`,
    keywords: 'AI caption generator, free caption generator, best AI caption generator, caption generator online, social media caption generator, viral caption generator',
  },
  instagramCaptionGenerator: {
    title: 'AI Instagram Caption Generator – Free Viral Captions | Media Wizard',
    description: 'Generate perfect Instagram captions in seconds with AI. Get hashtag suggestions, emoji-ready copy, and platform-optimized captions for every niche. 100% free to try.',
    canonical: `${SITE_URL}/ai-instagram-caption-generator`,
    keywords: 'Instagram caption generator, AI Instagram captions, free Instagram caption generator, Instagram caption ideas, best Instagram captions AI, viral Instagram captions',
  },
  youtubeScriptGenerator: {
    title: 'AI YouTube Script Generator – Hook-First Scripts That Grow Watch Time | Media Wizard',
    description: 'Create structured YouTube video scripts with AI. Hook-first format, chapter breakdowns, and retention-boosting storytelling. The best free YouTube script generator online.',
    canonical: `${SITE_URL}/ai-youtube-script-generator`,
    keywords: 'YouTube script generator, AI YouTube script, free YouTube script generator, YouTube video script, script generator online, how to write YouTube scripts',
  },
  tiktokCaptionGenerator: {
    title: 'AI TikTok Caption Generator – Viral Hooks & Captions Free | Media Wizard',
    description: 'Generate viral TikTok captions and hooks with AI. Trend-aware, hashtag-optimized, and built for the FYP. The best free TikTok caption generator for creators.',
    canonical: `${SITE_URL}/ai-tiktok-caption-generator`,
    keywords: 'TikTok caption generator, AI TikTok captions, free TikTok caption generator, TikTok hooks generator, viral TikTok captions, TikTok content ideas',
  },
  thumbnailGenerator: {
    title: 'AI Thumbnail Generator – Create Click-Worthy YouTube Thumbnails | Media Wizard',
    description: 'Generate professional YouTube thumbnail concepts with AI. Describe your video and get compelling thumbnail ideas instantly. Boost your CTR with better thumbnails.',
    canonical: `${SITE_URL}/ai-thumbnail-generator`,
    keywords: 'AI thumbnail generator, YouTube thumbnail generator, thumbnail ideas AI, free thumbnail generator, YouTube thumbnail creator, click-worthy thumbnails',
  },
  blog: {
    title: 'Blog – AI Content Creation Tips & Guides for Creators | Media Wizard',
    description: 'Learn how to create viral content with AI. Guides, tips, and strategies for Instagram, YouTube, TikTok creators. Grow faster with smarter content.',
    canonical: `${SITE_URL}/blog`,
    keywords: 'AI content creation, social media tips, creator guides, viral content strategy, Instagram tips, YouTube tips, TikTok tips',
  },
};

export function getProgrammaticSEO(type: 'instagram' | 'youtube' | 'tiktok', slug: string, label: string): PageSEO {
  if (type === 'instagram') {
    return {
      title: `${label} Instagram Captions – 30+ AI-Generated Examples | Media Wizard`,
      description: `Get 30+ ready-to-use Instagram captions for ${label.toLowerCase()}. AI-generated, hashtag-optimized, and proven to boost engagement. Try the free caption generator.`,
      canonical: `${SITE_URL}/instagram-captions-for-${slug}`,
      keywords: `${label.toLowerCase()} Instagram captions, Instagram captions for ${label.toLowerCase()}, ${label.toLowerCase()} caption ideas, AI Instagram captions ${label.toLowerCase()}`,
    };
  }
  if (type === 'youtube') {
    return {
      title: `YouTube Video Ideas for ${label} – 30+ Topics & Scripts | Media Wizard`,
      description: `Discover 30+ YouTube video ideas for ${label.toLowerCase()} creators. AI-generated topics, hooks, and script outlines. Start growing your channel today.`,
      canonical: `${SITE_URL}/youtube-video-ideas-for-${slug}`,
      keywords: `YouTube video ideas ${label.toLowerCase()}, ${label.toLowerCase()} YouTube topics, YouTube content ideas for ${label.toLowerCase()}, best YouTube videos for ${label.toLowerCase()}`,
    };
  }
  return {
    title: `TikTok Hooks for ${label} – 30+ Viral Opening Lines | Media Wizard`,
    description: `Get 30+ viral TikTok hooks for the ${label.toLowerCase()} industry. AI-generated opening lines that stop the scroll and grow your FYP reach. Free to use.`,
    canonical: `${SITE_URL}/tiktok-hooks-for-${slug}`,
    keywords: `TikTok hooks ${label.toLowerCase()}, ${label.toLowerCase()} TikTok content, viral TikTok hooks ${label.toLowerCase()}, TikTok ideas for ${label.toLowerCase()}`,
  };
}

export function getBlogSEO(slug: string, title: string, description: string): PageSEO {
  return {
    title: `${title} | Media Wizard Blog`,
    description,
    canonical: `${SITE_URL}/blog/${slug}`,
    ogType: 'article',
  };
}
