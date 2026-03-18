import { Sparkles, ScrollText, Image, LayoutGrid } from 'lucide-react';

const ALL_TOOLS = [
  {
    title: 'AI Caption Generator',
    description: 'Generate scroll-stopping captions for any platform in seconds.',
    href: '/ai-caption-generator',
    icon: Sparkles,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Instagram Caption Generator',
    description: 'Captions built specifically for Instagram\'s format and algorithm.',
    href: '/ai-instagram-caption-generator',
    icon: Sparkles,
    color: 'bg-pink-50 text-pink-600',
  },
  {
    title: 'YouTube Script Generator',
    description: 'Hook-first scripts that hold attention and grow watch time.',
    href: '/ai-youtube-script-generator',
    icon: ScrollText,
    color: 'bg-red-50 text-red-600',
  },
  {
    title: 'TikTok Caption Generator',
    description: 'Viral hooks and captions built for the FYP.',
    href: '/ai-tiktok-caption-generator',
    icon: Sparkles,
    color: 'bg-gray-100 text-gray-700',
  },
  {
    title: 'AI Thumbnail Generator',
    description: 'Professional thumbnail concepts that boost click-through rate.',
    href: '/ai-thumbnail-generator',
    icon: Image,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'Content Planner',
    description: 'Full content calendars and posts generated with AI.',
    href: '/',
    icon: LayoutGrid,
    color: 'bg-green-50 text-green-600',
  },
];

interface RelatedToolsProps {
  exclude?: string;
  onGetStarted: () => void;
  navigate: (path: string) => void;
}

export function RelatedTools({ exclude, onGetStarted, navigate }: RelatedToolsProps) {
  const tools = ALL_TOOLS.filter((t) => t.href !== exclude).slice(0, 4);

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-200">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Explore More AI Tools</h2>
        <p className="text-gray-500 mb-8 text-sm">Everything you need to create content that performs — in one platform.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.href}
              onClick={() => tool.href === '/' ? onGetStarted() : navigate(tool.href)}
              className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition group"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tool.color}`}>
                <tool.icon className="w-4 h-4" />
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition">{tool.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
