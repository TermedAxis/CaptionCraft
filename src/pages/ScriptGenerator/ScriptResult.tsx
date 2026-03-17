import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Scissors, Clock, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScriptVariation, ScriptLength, LENGTH_LABELS } from './types';

interface ScriptResultProps {
  variations: ScriptVariation[];
  onCutDown: (script: ScriptVariation, targetLength: ScriptLength) => void;
  cuttingDown: boolean;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 text-bat-muted hover:text-white hover:bg-bat-surface2 rounded-lg transition"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function formatScriptAsText(v: ScriptVariation): string {
  const points = v.mainPoints.map((p, i) => `${i + 1}. ${p.title}\n${p.content}`).join('\n\n');
  return `HOOK:\n${v.hook}\n\nINTRO:\n${v.intro}\n\nMAIN POINTS:\n${points}\n\nCTA:\n${v.cta}`;
}

interface VariationCardProps {
  variation: ScriptVariation;
  index: number;
  total: number;
  onCutDown: (script: ScriptVariation, targetLength: ScriptLength) => void;
  cuttingDown: boolean;
}

function VariationCard({ variation, index, total, onCutDown, cuttingDown }: VariationCardProps) {
  const [expanded, setExpanded] = useState(index === 0);
  const [showCutDown, setShowCutDown] = useState(false);
  const [targetLength, setTargetLength] = useState<ScriptLength>('short');
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(formatScriptAsText(variation));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const cutDownLengths: ScriptLength[] = ['very_short', 'short', 'medium', 'long', 'very_long'];

  return (
    <div className="border border-bat-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 bg-bat-surface hover:bg-bat-surface2 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white">
            {total > 1 ? `Variation ${index + 1}` : 'Generated Script'}
          </span>
          <div className="flex items-center gap-2 text-xs text-bat-subtle">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {variation.estimatedDuration}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {variation.wordCount} words
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {expanded && (
            <button
              onClick={(e) => { e.stopPropagation(); handleCopyAll(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-bat-muted bg-bat-surface2 border border-bat-border hover:border-bat-border2 rounded-lg transition"
            >
              {copiedAll ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              {copiedAll ? 'Copied!' : 'Copy All'}
            </button>
          )}
          <div className="p-1 bg-bat-surface2 hover:bg-bat-border rounded-md transition">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-bat-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-bat-muted" />
            )}
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-bat-border divide-y divide-bat-border overflow-hidden"
          >
            <ScriptSection label="HOOK" content={variation.hook} accent="blue" />
            <ScriptSection label="INTRO" content={variation.intro} accent="gray" />

            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold tracking-widest text-bat-subtle uppercase">Main Points</span>
                <CopyButton text={variation.mainPoints.map((p, i) => `${i + 1}. ${p.title}\n${p.content}`).join('\n\n')} />
              </div>
              <div className="space-y-3">
                {variation.mainPoints.map((point, i) => (
                  <div key={i} className="bg-bat-surface2 border border-bat-border rounded-xl p-3">
                    <p className="text-xs font-semibold text-white mb-1">
                      {i + 1}. {point.title}
                    </p>
                    <p className="text-sm text-bat-muted leading-relaxed">{point.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <ScriptSection label="CTA" content={variation.cta} accent="green" />

            <div className="px-5 py-4 bg-bat-surface2 border-t border-bat-border">
              {!showCutDown ? (
                <button
                  onClick={() => setShowCutDown(true)}
                  className="flex items-center gap-2 text-sm text-bat-muted hover:text-white font-medium transition"
                >
                  <Scissors className="w-4 h-4 text-bat-muted" />
                  Cut down this script
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-white">Cut down to:</p>
                  <div className="flex flex-wrap gap-2">
                    {cutDownLengths.map((l) => (
                      <button
                        key={l}
                        onClick={() => setTargetLength(l)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                          targetLength === l
                            ? 'bg-white text-black border-white'
                            : 'bg-bat-bg text-bat-muted border-bat-border hover:border-bat-border2'
                        }`}
                      >
                        {LENGTH_LABELS[l].split(' (')[0]}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onCutDown(variation, targetLength)}
                      disabled={cuttingDown}
                      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-bat-accent disabled:bg-bat-surface2 disabled:text-bat-subtle text-black text-sm font-medium rounded-lg transition"
                    >
                      {cuttingDown ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin" />Cutting down...</>
                      ) : (
                        <><Scissors className="w-3.5 h-3.5" />Cut Down</>
                      )}
                    </button>
                    <button
                      onClick={() => setShowCutDown(false)}
                      className="px-4 py-2 text-sm text-bat-muted hover:bg-bat-surface2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScriptSection({
  label,
  content,
  accent,
}: {
  label: string;
  content: string;
  accent: 'blue' | 'gray' | 'green';
}) {
  const accentStyles = {
    blue: 'border-l-white/50 bg-white/5',
    gray: 'border-l-bat-border bg-transparent',
    green: 'border-l-white/30 bg-white/5',
  };

  return (
    <div className={`px-5 py-4 border-l-4 mx-0 ${accentStyles[accent]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold tracking-widest text-bat-subtle uppercase">{label}</span>
        <CopyButton text={content} />
      </div>
      <p className="text-sm text-bat-muted leading-relaxed">{content}</p>
    </div>
  );
}

export function ScriptResult({ variations, onCutDown, cuttingDown }: ScriptResultProps) {
  return (
    <div className="space-y-4">
      {variations.map((variation, index) => (
        <VariationCard
          key={index}
          variation={variation}
          index={index}
          total={variations.length}
          onCutDown={onCutDown}
          cuttingDown={cuttingDown}
        />
      ))}
    </div>
  );
}
