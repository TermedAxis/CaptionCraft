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
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 text-base mb-1">{result.title}</h3>
        {result.threadSummary && (
          <p className="text-sm text-gray-500 mb-4">{result.threadSummary}</p>
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
                      ? "bg-blue-600 text-white"
                      : isClosing
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {isHook ? "1" : isClosing ? <MessageSquare className="w-3.5 h-3.5" /> : tweet.number}
                  </div>
                  {!isLast && (
                    <div className="flex flex-col items-center mt-1 mb-1 flex-1">
                      <div className="w-0.5 flex-1 bg-gray-200 min-h-[12px]" />
                      <ChevronDown className="w-3 h-3 text-gray-300 shrink-0" />
                    </div>
                  )}
                </div>

                <div className={`flex-1 pb-4 ${isLast ? "" : ""}`}>
                  <div className={`rounded-xl p-3.5 ${
                    isHook
                      ? "bg-blue-50 border border-blue-200"
                      : isClosing
                      ? "bg-gray-800 text-white"
                      : "bg-gray-50 border border-gray-200"
                  }`}>
                    {isHook && (
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide block mb-1">Hook Tweet</span>
                    )}
                    {isClosing && (
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1">Closing Tweet</span>
                    )}
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isClosing ? "text-white" : "text-gray-800"}`}>
                      {tweet.content}
                    </p>
                    <div className={`flex justify-end mt-2 text-xs ${
                      isClosing ? "text-gray-400" : tweet.charCount > 280 ? "text-red-500 font-medium" : "text-gray-400"
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

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hashtags</span>
          </div>
          <p className="text-sm text-blue-600">{result.hashtags}</p>
        </div>
      </div>

      {result.engagementTips?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-semibold text-gray-900">Engagement Tips</h4>
          </div>
          <ul className="space-y-2">
            {result.engagementTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-0.5 w-5 h-5 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
