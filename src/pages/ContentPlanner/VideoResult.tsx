import { Hash, Lightbulb, Music, Video, Layers, Eye, Clock } from "lucide-react";
import { VideoResult as VideoResultType } from "./types";

interface VideoResultProps {
  result: VideoResultType;
}

export function VideoResult({ result }: VideoResultProps) {
  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base">{result.title}</h3>
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full shrink-0 ml-3">
            <Clock className="w-3.5 h-3.5" />
            {result.duration}
          </span>
        </div>

        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3.5 mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Video className="w-4 h-4 text-red-500 dark:text-red-400" />
            <span className="text-xs font-semibold text-red-600 dark:text-red-300 uppercase tracking-wide">Hook (First 3 Seconds)</span>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{result.hook}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Script</span>
          </div>
          <div className="space-y-2">
            {result.script?.map((segment, i) => (
              <div key={i} className="flex gap-3 border border-gray-100 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                <div className="shrink-0">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">{segment.timestamp}</span>
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-start gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-600 dark:text-gray-400"><span className="font-medium">On screen:</span> {segment.action}</p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 shrink-0">🎙</span>
                    <p className="text-xs text-gray-800 dark:text-gray-200"><span className="font-medium">Voiceover:</span> {segment.voiceover}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {result.bRollSuggestions?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">B-Roll Suggestions</h4>
            </div>
            <ul className="space-y-1.5">
              {result.bRollSuggestions.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
          {result.textOverlays?.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Text Overlays</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.textOverlays.map((t, i) => (
                  <span key={i} className="text-xs bg-gray-900 dark:bg-gray-700 text-white px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          )}
          {result.music && (
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Music className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span><span className="font-medium">Music vibe:</span> {result.music}</span>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Caption</span>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1.5 leading-relaxed">{result.caption}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Hashtags</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">{result.hashtags}</p>
          </div>
        </div>
      </div>

      {result.productionTips?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Production Tips</h4>
          </div>
          <ul className="space-y-2">
            {result.productionTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="mt-0.5 w-5 h-5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
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
