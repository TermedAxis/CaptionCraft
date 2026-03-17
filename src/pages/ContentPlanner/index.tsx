import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { AlignLeft, LayoutGrid, MessageSquare, Copy, Check, Bookmark, BookmarkCheck, AlertCircle, Wand2 } from "lucide-react";
import { ContentForm } from "./ContentForm";
import { PostResult } from "./PostResult";
import { CarouselResult } from "./CarouselResult";
import { VideoResult } from "./VideoResult";
import { ThreadResult } from "./ThreadResult";
import {
  ContentTab,
  ContentFormValues,
  PostResult as PostResultType,
  CarouselResult as CarouselResultType,
  VideoResult as VideoResultType,
  ThreadResult as ThreadResultType,
} from "./types";

const DEFAULT_FORM: ContentFormValues = {
  platform: "instagram",
  topic: "",
  tone: "casual",
  targetAudience: "",
  goal: "",
  extraContext: "",
};

const TAB_CONFIG: { id: ContentTab; label: string; icon: React.ElementType; description: string; defaultPlatform: string }[] = [
  { id: "post", label: "Social Post", icon: AlignLeft, description: "Single image or text post", defaultPlatform: "instagram" },
  { id: "carousel", label: "Carousel", icon: LayoutGrid, description: "Multi-slide swipeable post", defaultPlatform: "instagram" },
  { id: "thread", label: "Thread", icon: MessageSquare, description: "Twitter / Threads thread", defaultPlatform: "twitter" },
];

const RESULT_LABELS: Record<ContentTab, string> = {
  post: "Post Plan",
  carousel: "Carousel Plan",
  video: "Video Script",
  thread: "Thread",
};

type AnyResult = PostResultType | CarouselResultType | VideoResultType | ThreadResultType;

interface ContentPlannerProps {
  onRequestAuth: (message?: string) => void;
}

export function ContentPlanner({ onRequestAuth }: ContentPlannerProps) {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<ContentTab>("post");
  const [form, setForm] = useState<ContentFormValues>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnyResult | null>(null);
  const [resultTab, setResultTab] = useState<ContentTab>("post");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleTabChange = (newTab: ContentTab) => {
    const config = TAB_CONFIG.find((t) => t.id === newTab)!;
    setTab(newTab);
    setResult(null);
    setError("");
    setForm({ ...DEFAULT_FORM, platform: config.defaultPlatform });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      onRequestAuth("Sign in to generate content plans");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);
    setSaved(false);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content-plan`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType: tab,
          platform: form.platform,
          topic: form.topic,
          tone: form.tone,
          targetAudience: form.targetAudience || undefined,
          goal: form.goal || undefined,
          extraContext: form.extraContext || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate content plan");

      setResult(data.result);
      setResultTab(tab);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate content plan");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = JSON.stringify(result, null, 2);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!result) return;
    if (!user || !profile) {
      onRequestAuth("Sign in to save your content plans");
      return;
    }
    try {
      await supabase.from("content_plans").insert({
        user_id: profile.id,
        content_type: resultTab,
        platform: form.platform,
        topic: form.topic,
        tone: form.tone,
        result,
      });
      setSaved(true);
    } catch {
      setError("Failed to save content plan");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Creator</h1>
        <p className="text-gray-600">Plan and script your social media content with AI</p>
      </div>

      <div className="flex gap-3 mb-8">
        {TAB_CONFIG.map(({ id, label, icon: Icon, description }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`flex-1 flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
              tab === id
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Icon className={`w-6 h-6 ${tab === id ? "text-blue-600" : "text-gray-400"}`} />
            <div className="text-center">
              <p className={`text-sm font-semibold ${tab === id ? "text-blue-700" : "text-gray-800"}`}>{label}</p>
              <p className="text-xs text-gray-500 hidden sm:block">{description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}
          <ContentForm
            tab={tab}
            values={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        <div>
          {!result && !loading && (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center h-full flex flex-col items-center justify-center">
              <Wand2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Your content plan will appear here</p>
              <p className="text-gray-400 text-sm mt-1">Fill in the form and hit generate</p>
            </div>
          )}

          {loading && (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Crafting your content plan...</p>
              <p className="text-gray-400 text-sm mt-1">This may take a moment</p>
            </div>
          )}

          {result && !loading && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">{RESULT_LABELS[resultTab]}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition ${
                      saved
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>

              {resultTab === "post" && <PostResult result={result as PostResultType} />}
              {resultTab === "carousel" && <CarouselResult result={result as CarouselResultType} />}
              {resultTab === "video" && <VideoResult result={result as VideoResultType} />}
              {resultTab === "thread" && <ThreadResult result={result as ThreadResultType} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
