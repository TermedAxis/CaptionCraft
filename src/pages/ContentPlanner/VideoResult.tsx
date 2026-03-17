import { motion } from "framer-motion";
import { Hash, Lightbulb, Music, Video, Layers, Eye, Clock } from "lucide-react";
import { VideoResult as VideoResultType } from "./types";

interface VideoResultProps {
  result: VideoResultType;
}

export function VideoResult({ result }: VideoResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="bg-bat-surface rounded-xl border border-bat-border p-5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-white text-base">{result.title}</h3>
          <span className="flex items-center gap-1.5 text-xs font-medium text-bat-muted bg-bat-surface2 border border-bat-border px-2.5 py-1 rounded-full shrink-0 ml-3">
            <Clock className="w-3.5 h-3.5" />
            {result.duration}
          </span>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3.5 mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Video className="w-4 h-4 text-red-400" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Hook (First 3 Seconds)</span>
          </div>
          <p className="text-sm text-white font-medium">{result.hook}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-bat-subtle uppercase tracking-wide">Script</span>
          </div>
          <div className="space-y-2">
            {result.script?.map((segment, i) => (
              <div key={i} className="flex gap-3 border border-bat-border rounded-lg p-3 bg-bat-surface2">
                <div className="shrink-0">
                  <span className="text-xs font-bold text-white bg-bat-surface border border-bat-border px-2 py-0.5 rounded">{segment.timestamp}</span>
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-start gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-bat-subtle mt-0.5 shrink-0" />
                    <p className="text-xs text-bat-muted"><span className="font-medium text-white">On screen:</span> {segment.action}</p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-bat-subtle text-xs mt-0.5 shrink-0">🎙</span>
                    <p className="text-xs text-white"><span className="font-medium">Voiceover:</span> {segment.voiceover}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {result.bRollSuggestions?.length > 0 && (
          <div className="bg-bat-surface rounded-xl border border-bat-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-bat-muted" />
              <h4 className="text-sm font-semibold text-white">B-Roll Suggestions</h4>
            </div>
            <ul className="space-y-1.5">
              {result.bRollSuggestions.map((s, i) => (
                <li key={i} className="text-sm text-bat-muted flex items-start gap-2">
                  <span className="text-bat-subtle mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-bat-surface rounded-xl border border-bat-border p-5 space-y-4">
          {result.textOverlays?.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-bat-subtle uppercase tracking-wide">Text Overlays</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.textOverlays.map((t, i) => (
                  <span key={i} className="text-xs bg-bat-surface2 text-white border border-bat-border px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          )}
          {result.music && (
            <div className="flex items-center gap-2 text-sm text-bat-muted">
              <Music className="w-4 h-4 text-bat-subtle" />
              <span><span className="font-medium text-white">Music vibe:</span> {result.music}</span>
            </div>
          )}
        </div>

        <div className="bg-bat-surface rounded-xl border border-bat-border p-5 space-y-4">
          <div>
            <span className="text-xs font-semibold text-bat-subtle uppercase tracking-wide">Caption</span>
            <p className="text-sm text-white mt-1.5 leading-relaxed">{result.caption}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Hash className="w-4 h-4 text-bat-subtle" />
              <span className="text-xs font-semibold text-bat-subtle uppercase tracking-wide">Hashtags</span>
            </div>
            <p className="text-sm text-bat-muted">{result.hashtags}</p>
          </div>
        </div>
      </div>

      {result.productionTips?.length > 0 && (
        <div className="bg-bat-surface rounded-xl border border-bat-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-bat-muted" />
            <h4 className="text-sm font-semibold text-white">Production Tips</h4>
          </div>
          <ul className="space-y-2">
            {result.productionTips.map((tip, i) => (
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
