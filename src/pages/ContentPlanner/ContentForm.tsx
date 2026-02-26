import { Loader2, Wand2 } from "lucide-react";
import { ContentTab, ContentFormValues } from "./types";

const POST_PLATFORMS = ["Instagram", "Facebook", "LinkedIn", "Twitter", "Threads"];
const CAROUSEL_PLATFORMS = ["Instagram", "LinkedIn", "Facebook"];
const VIDEO_PLATFORMS = ["TikTok", "Instagram Reels", "YouTube Shorts", "Facebook Reels"];

const TONES = ["Casual", "Professional", "Educational", "Inspirational", "Funny", "Bold", "Storytelling"];

const GOALS: Record<ContentTab, string[]> = {
  post: ["Build brand awareness", "Drive engagement", "Generate leads", "Promote product/service", "Educate audience", "Entertain"],
  carousel: ["Teach a concept", "Showcase products", "Share tips/how-to", "Tell a story", "Build authority", "Drive saves"],
  video: ["Go viral", "Educate viewers", "Showcase product", "Build community", "Drive website traffic", "Entertain"],
};

interface ContentFormProps {
  tab: ContentTab;
  values: ContentFormValues;
  onChange: (values: ContentFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function ContentForm({ tab, values, onChange, onSubmit, loading }: ContentFormProps) {
  const platforms = tab === "post" ? POST_PLATFORMS : tab === "carousel" ? CAROUSEL_PLATFORMS : VIDEO_PLATFORMS;

  const set = (field: keyof ContentFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => onChange({ ...values, [field]: e.target.value });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform</label>
          <select
            value={values.platform}
            onChange={set("platform")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {platforms.map((p) => (
              <option key={p} value={p.toLowerCase().replace(" ", "-")}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tone</label>
          <select
            value={values.tone}
            onChange={set("tone")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {TONES.map((t) => (
              <option key={t} value={t.toLowerCase()}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Topic / Theme <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={3}
          value={values.topic}
          onChange={set("topic")}
          placeholder={
            tab === "post"
              ? "e.g., 5 morning habits that changed my life..."
              : tab === "carousel"
              ? "e.g., How to grow your Instagram from 0 to 10k followers..."
              : "e.g., Day in the life of a freelance designer..."
          }
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Goal</label>
        <select
          value={values.goal}
          onChange={set("goal")}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="">Select a goal (optional)</option>
          {GOALS[tab].map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Audience (Optional)</label>
        <input
          type="text"
          value={values.targetAudience}
          onChange={set("targetAudience")}
          placeholder="e.g., Entrepreneurs aged 25-35, fitness enthusiasts..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Extra Context (Optional)</label>
        <textarea
          rows={2}
          value={values.extraContext}
          onChange={set("extraContext")}
          placeholder="Any additional details, brand guidelines, or specific requirements..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !values.topic.trim()}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate {tab === "post" ? "Post Plan" : tab === "carousel" ? "Carousel Plan" : "Video Script"}
          </>
        )}
      </button>
    </form>
  );
}
