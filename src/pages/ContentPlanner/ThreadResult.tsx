import { motion } from "framer-motion";
import { Hash, Lightbulb, MessageSquare, ChevronDown } from "lucide-react";
import { ThreadResult as ThreadResultType } from "./types";

interface ThreadResultProps {
  result: ThreadResultType;
}

export function ThreadResult({ result }: ThreadResultProps) {
  const allTweets = [
    { number: 1, content: result.hook, charCount: result.hook?.length ?? 0, isHook: true },
    ...(result.tweets ?? []).map((t) => ({ ...t, isHook: false })),
    { number: (result.tweets?.length ?? 0) + 2, content: result.closingTweet, charCount: result.closingTweet?.length ?? 0, isHook: false, isClosing: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="bg-bat-surface rounded-xl border border-bat-border p-5">
        <h3 className="font-semibold text-white text-base mb-1">{result.title}</h3>
        {result.threadSummary && (
          <p className="text-sm text-bat-muted mb-4">{result.threadSummary}</p>
        )}

        <div className="space-y-0">
          {allTweets.map((tweet, i) => {
            const isLast = i === allTweets.length - 1;
            const isClosing = (tweet as { isClosing?: boolean }).isClosing;
            const isHook = (tweet as { isHook?: boolean }).isHook;

            return (
              <div key={i} className="relative flex gap-3">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isHook
                      ? "bg-white text-black"
                      : isClosing
                      ? "bg-bat-surface2 border border-bat-border text-white"
                      : "bg-bat-surface2 border border-bat-border text-bat-muted"
                  }`}>
                    {isHook ? "1" : isClosing ? <MessageSquare className="w-3.5 h-3.5" /> : tweet.number}
                  </div>
                  {!isLast && (
                    <div className="flex flex-col items-center mt-1 mb-1 flex-1">
                      <div className="w-0.5 flex-1 bg-bat-border min-h-[12px]" />
                      <ChevronDown className="w-3 h-3 text-bat-subtle shrink-0" />
                    </div>
                  )}
                </div>

                <div className={`flex-1 pb-4 ${isLast ? "" : ""}`}>
                  <div className={`rounded-xl p-3.5 ${
                    isHook
                      ? "bg-white/10 border border-white/20"
                      : isClosing
                      ? "bg-bat-surface2 border border-bat-border"
                      : "bg-bat-surface2 border border-bat-border"
                  }`}>
                    {isHook && (
                      <span className="text-xs font-semibold text-white uppercase tracking-wide block mb-1">Hook Tweet</span>
                    )}
                    {isClosing && (
                      <span className="text-xs font-semibold text-bat-subtle uppercase tracking-wide block mb-1">Closing Tweet</span>
                    )}
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isClosing ? "text-bat-muted" : isHook ? "text-white" : "text-white"}`}>
                      {tweet.content}
                    </p>
                    <div className={`flex justify-end mt-2 text-xs ${
                      tweet.charCount > 280 ? "text-red-400 font-medium" : "text-bat-subtle"
                    }`}>
                      {tweet.charCount}/280
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-bat-surface rounded-xl border border-bat-border p-5 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Hash className="w-4 h-4 text-bat-subtle" />
            <span className="text-xs font-semibold text-bat-subtle uppercase tracking-wide">Hashtags</span>
          </div>
          <p className="text-sm text-bat-muted">{result.hashtags}</p>
        </div>
      </div>

      {result.engagementTips?.length > 0 && (
        <div className="bg-bat-surface rounded-xl border border-bat-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-bat-muted" />
            <h4 className="text-sm font-semibold text-white">Engagement Tips</h4>
          </div>
          <ul className="space-y-2">
            {result.engagementTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-bat-muted">
                <span className="mt-0.5 w-5 h-5 bg-bat-surface2 text-white border border-bat-border rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
