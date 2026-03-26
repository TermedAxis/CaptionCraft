import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useCredits } from "../../hooks/useCredits";
import { ModelId } from "../../lib/supabase";
import { getCreditCost, FREE_LIMITS } from "../../lib/credits";
import { ModelSelector } from "../../components/ModelSelector";
import { AlignLeft, LayoutGrid, MessageSquare, Copy, Check, Bookmark, BookmarkCheck, AlertCircle, Wand2, Zap } from "lucide-react";
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
  onUpgrade: () => void;
}

export function ContentPlanner({ onRequestAuth, onUpgrade }: ContentPlannerProps) {
  const { user, profile } = useAuth();
  const { plan, credits, checkFreeLimit, consumeGeneration } = useCredits();
  const [tab, setTab] = useState<ContentTab>("post");
  const [form, setForm] = useState<ContentFormValues>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnyResult | null>(null);
  const [resultTab, setResultTab] = useState<ContentTab>("post");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelId>("base");
  const [freeUsed, setFreeUsed] = useState(0);
  const [freeChecked, setFreeChecked] = useState(false);

  useEffect(() => {
    if (user && plan === "free") {
      checkFreeLimit("post").then(({ used }) => {
        setFreeUsed(used);
        setFreeChecked(true);
      });
    } else {
      setFreeChecked(true);
    }
  }, [user, plan]);

  const freeLimit = FREE_LIMITS.post;
  const freeLimitReached = plan === "free" && freeChecked && freeUsed >= freeLimit;
  const creditCost = plan !== "free" ? getCreditCost("post", selectedModel) : 0;

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

    if (plan === "free") {
      const { allowed, used } = await checkFreeLimit("post");
      setFreeUsed(used);
      if (!allowed) {
        onUpgrade();
        return;
      }
    } else if (credits < creditCost) {
      setError(`Not enough credits. You need ${creditCost} but have ${credits}.`);
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
          model: selectedModel,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate content plan");

      setResult(data.result);
      setResultTab(tab);

      await consumeGeneration("post", selectedModel);
      if (plan === "free") setFreeUsed((prev) => prev + 1);
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
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-950 rounded-xl">
            <LayoutGrid className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Creator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Plan and script your social media content with AI</p>
          </div>
        </div>
        {user && plan === "free" && freeChecked && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
            freeLimitReached ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300" : "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
          }`}>
            <AlertCircle className="w-4 h-4" />
            <span>Free: {freeUsed}/{freeLimit} posts used</span>
            {freeLimitReached && (
              <button onClick={onUpgrade} className="underline font-semibold ml-1">Upgrade</button>
            )}
          </div>
        )}
        {user && plan !== "free" && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{credits.toLocaleString()} credits</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 mb-8">
        {TAB_CONFIG.map(({ id, label, icon: Icon, description }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`flex-1 flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
              tab === id
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <Icon className={`w-6 h-6 ${tab === id ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`} />
            <div className="text-center">
              <p className={`text-sm font-semibold ${tab === id ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-gray-200"}`}>{label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[480px_1fr] gap-8 items-start">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 h-fit">
          {error && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm mb-5">
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
            freeLimitReached={freeLimitReached}
          />
          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700 space-y-4">
            <ModelSelector
              feature="post"
              plan={plan}
              selected={selectedModel}
              onChange={setSelectedModel}
              onUpgradeRequired={onUpgrade}
            />
            {plan !== "free" && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Cost: <span className="font-semibold text-gray-900 dark:text-white ml-1">{creditCost} credits</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500">Balance: {credits}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
                <Wand2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Your content plan will appear here</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Fill in the form and hit generate</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="relative mb-4">
                <div className="w-12 h-12 border-4 border-blue-100 dark:border-blue-900 rounded-full" />
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Crafting your content plan...</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">This may take a moment</p>
            </div>
          )}

          {result && !loading && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{RESULT_LABELS[resultTab]}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600 dark:text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition ${
                      saved
                        ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
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
