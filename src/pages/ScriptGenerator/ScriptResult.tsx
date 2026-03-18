import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Scissors, Clock, FileText, Loader2 } from 'lucide-react';
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
      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
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
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-900">
            {total > 1 ? `Variation ${index + 1}` : 'Generated Script'}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
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
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              {copiedAll ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              {copiedAll ? 'Copied!' : 'Copy All'}
            </button>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          <ScriptSection label="HOOK" content={variation.hook} accent="blue" />
          <ScriptSection label="INTRO" content={variation.intro} accent="gray" />

          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Main Points</span>
              <CopyButton text={variation.mainPoints.map((p, i) => `${i + 1}. ${p.title}\n${p.content}`).join('\n\n')} />
            </div>
            <div className="space-y-3">
              {variation.mainPoints.map((point, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    {i + 1}. {point.title}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">{point.content}</p>
                </div>
              ))}
            </div>
          </div>

          <ScriptSection label="CTA" content={variation.cta} accent="green" />

          <div className="px-5 py-4 bg-gray-50">
            {!showCutDown ? (
              <button
                onClick={() => setShowCutDown(true)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition"
              >
                <Scissors className="w-4 h-4" />
                Cut down this script
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Cut down to:</p>
                <div className="flex flex-wrap gap-2">
                  {cutDownLengths.map((l) => (
                    <button
                      key={l}
                      onClick={() => setTargetLength(l)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                        targetLength === l
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
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
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium rounded-lg transition"
                  >
                    {cuttingDown ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" />Cutting down...</>
                    ) : (
                      <><Scissors className="w-3.5 h-3.5" />Cut Down</>
                    )}
                  </button>
                  <button
                    onClick={() => setShowCutDown(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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
    blue: 'border-l-blue-500 bg-blue-50',
    gray: 'border-l-gray-300 bg-white',
    green: 'border-l-green-500 bg-green-50',
  };

  return (
    <div className={`px-5 py-4 border-l-4 mx-0 ${accentStyles[accent]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{label}</span>
        <CopyButton text={content} />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
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
