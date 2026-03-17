import { Loader2, Wand2, Zap } from "lucide-react";
import { ContentTab, ContentFormValues } from "./types";

const POST_PLATFORMS = ["Instagram", "Facebook", "LinkedIn", "Twitter", "Threads"];
const CAROUSEL_PLATFORMS = ["Instagram", "LinkedIn", "Facebook"];
const VIDEO_PLATFORMS = ["TikTok", "Instagram Reels", "YouTube Shorts", "Facebook Reels"];
const THREAD_PLATFORMS = ["Twitter", "Threads"];

const TONES = ["Casual", "Professional", "Educational", "Inspirational", "Funny", "Bold", "Storytelling"];

const GOALS: Record<ContentTab, string[]> = {
  post: ["Build brand awareness", "Drive engagement", "Generate leads", "Promote product/service", "Educate audience", "Entertain"],
  carousel: ["Teach a concept", "Showcase products", "Share tips/how-to", "Tell a story", "Build authority", "Drive saves"],
  video: ["Go viral", "Educate viewers", "Showcase product", "Build community", "Drive website traffic", "Entertain"],
  thread: ["Share expertise", "Tell a story", "Break down a topic", "Build authority", "Drive engagement", "Educate followers"],
};

const TOPIC_PLACEHOLDERS: Record<ContentTab, string> = {
  post: "e.g., 5 morning habits that changed my life...",
  carousel: "e.g., How to grow your Instagram from 0 to 10k followers...",
  video: "e.g., Day in the life of a freelance designer...",
  thread: "e.g., Everything I learned about building a startup in 2 years...",
};

const BUTTON_LABELS: Record<ContentTab, string> = {
  post: "Post Plan",
  carousel: "Carousel Plan",
  video: "Video Script",
  thread: "Thread",
};

interface ContentFormProps {
  tab: ContentTab;
  values: ContentFormValues;
  onChange: (values: ContentFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  freeLimitReached?: boolean;
}

export function ContentForm({ tab, values, onChange, onSubmit, loading, freeLimitReached }: ContentFormProps) {
  const platforms =
    tab === "post" ? POST_PLATFORMS :
    tab === "carousel" ? CAROUSEL_PLATFORMS :
    tab === "thread" ? THREAD_PLATFORMS :
    VIDEO_PLATFORMS;

  const set = (field: keyof ContentFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => onChange({ ...values, [field]: e.target.value });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-bat-muted mb-1.5">Platform</label>
          <select
            value={values.platform}
            onChange={set("platform")}
            className="w-full px-4 py-2.5 bg-bat-bg border border-bat-border rounded-xl text-white focus:ring-0 focus:border-bat-border2 text-sm"
          >
            {platforms.map((p) => (
              <option key={p} value={p.toLowerCase().replace(" ", "-")}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-bat-muted mb-1.5">Tone</label>
          <select
            value={values.tone}
            onChange={set("tone")}
            className="w-full px-4 py-2.5 bg-bat-bg border border-bat-border rounded-xl text-white focus:ring-0 focus:border-bat-border2 text-sm"
          >
            {TONES.map((t) => (
              <option key={t} value={t.toLowerCase()}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-bat-muted mb-1.5">
          Topic / Theme <span className="text-red-400">*</span>
        </label>
        <textarea
          required
          rows={3}
          value={values.topic}
          onChange={set("topic")}
          placeholder={TOPIC_PLACEHOLDERS[tab]}
          className="w-full px-4 py-2.5 bg-bat-bg border border-bat-border rounded-xl text-white placeholder:text-bat-subtle focus:ring-0 focus:border-bat-border2 resize-none text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-bat-muted mb-1.5">Goal</label>
        <select
          value={values.goal}
          onChange={set("goal")}
          className="w-full px-4 py-2.5 bg-bat-bg border border-bat-border rounded-xl text-white focus:ring-0 focus:border-bat-border2 text-sm"
        >
          <option value="">Select a goal (optional)</option>
          {GOALS[tab].map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-bat-muted mb-1.5">Target Audience (Optional)</label>
        <input
          type="text"
          value={values.targetAudience}
          onChange={set("targetAudience")}
          placeholder="e.g., Entrepreneurs aged 25-35, fitness enthusiasts..."
          className="w-full px-4 py-2.5 bg-bat-bg border border-bat-border rounded-xl text-white placeholder:text-bat-subtle focus:ring-0 focus:border-bat-border2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-bat-muted mb-1.5">Extra Context (Optional)</label>
        <textarea
          rows={2}
          value={values.extraContext}
          onChange={set("extraContext")}
          placeholder="Any additional details, brand guidelines, or specific requirements..."
          className="w-full px-4 py-2.5 bg-bat-bg border border-bat-border rounded-xl text-white placeholder:text-bat-subtle focus:ring-0 focus:border-bat-border2 resize-none text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !values.topic.trim() || freeLimitReached}
        className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-bat-accent transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : freeLimitReached ? (
          <>
            <Zap className="w-5 h-5" />
            Upgrade to Generate
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate {BUTTON_LABELS[tab]}
          </>
        )}
      </button>
    </form>
  );
}
