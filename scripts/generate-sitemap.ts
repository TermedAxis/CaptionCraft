import { writeFileSync } from 'fs';
import { join } from 'path';

const SITE_URL = 'https://mediawizard.app';
const TODAY = new Date().toISOString().split('T')[0];

const INSTAGRAM_NICHES = [
  'fitness','real-estate','food','travel','fashion','beauty','wellness',
  'photography','business','pets','sustainability','finance','parenting',
  'gaming','education','music','lifestyle','art','tech','sports','cooking',
];

const YOUTUBE_TOPICS = [
  'students','beginners','finance','cooking','fitness','travel','gaming',
  'health','tech','entrepreneurship',
];

const TIKTOK_INDUSTRIES = [
  'beauty','gym','finance','gaming','food','fashion','wellness',
  'education','real-estate','healthcare',
];

const BLOG_SLUGS = [
  '100-instagram-captions-for-fitness',
  'best-youtube-hooks-that-go-viral',
  'how-to-write-viral-captions-using-ai',
  'tiktok-hooks-guide-for-creators',
  'ai-content-creation-tools-comparison',
  'instagram-growth-strategy-for-creators',
  'youtube-thumbnail-guide',
  'social-media-content-calendar-guide',
  'youtube-script-writing-guide',
  'tiktok-growth-strategy',
  'content-creator-burnout-prevention',
  'linkedin-content-strategy',
];

interface UrlEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

const urls: UrlEntry[] = [];

const add = (path: string, priority: string, changefreq: string) => {
  urls.push({ loc: `${SITE_URL}${path}`, lastmod: TODAY, changefreq, priority });
};

add('/', '1.0', 'weekly');
add('/ai-caption-generator', '0.9', 'weekly');
add('/ai-instagram-caption-generator', '0.9', 'weekly');
add('/ai-youtube-script-generator', '0.9', 'weekly');
add('/ai-tiktok-caption-generator', '0.9', 'weekly');
add('/ai-thumbnail-generator', '0.9', 'weekly');
add('/blog', '0.8', 'weekly');

for (const slug of BLOG_SLUGS) {
  add(`/blog/${slug}`, '0.7', 'monthly');
}

for (const niche of INSTAGRAM_NICHES) {
  add(`/instagram-captions-for-${niche}`, '0.7', 'monthly');
}

for (const topic of YOUTUBE_TOPICS) {
  add(`/youtube-video-ideas-for-${topic}`, '0.7', 'monthly');
}

for (const industry of TIKTOK_INDUSTRIES) {
  add(`/tiktok-hooks-for-${industry}`, '0.7', 'monthly');
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const outPath = join(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf-8');
console.log(`Sitemap generated: ${urls.length} URLs → ${outPath}`);
