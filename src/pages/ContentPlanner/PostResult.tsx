import { motion } from "framer-motion";
import { Clock, Hash, Lightbulb, MessageCircle, Zap } from "lucide-react";
import { PostResult as PostResultType } from "./types";
import { ImageGeneratorPanel } from "./ImageGeneratorPanel";
import { useImageGeneration } from "./useImageGeneration";

interface PostResultProps {
  result: PostResultType;
}

export function PostResult({ result }: PostResultProps) {
  const { images, loadingKeys, errorKeys, generateImage, clearImage } = useImageGeneration();
  const imagePrompt = `Social media post image: ${result.title}. ${result.hook}. Visually striking, high quality photography or illustration, no text overlay.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <ImageGeneratorPanel
        imageKey="post-main"
        defaultPrompt={imagePrompt}
        imageUrl={images["post-main"]?.imageUrl}
        loading={loadingKeys["post-main"]}
        error={errorKeys["post-main"]}
        onGenerate={generateImage}
        onClear={clearImage}
        width={1080}
        height={1080}
        label="Post Image"
      />

      <div className="bg-bat-surface rounded-xl border border-bat-border p-5">
        <h3 className="font-semibold text-white text-base mb-4">{result.title}</h3>

        <div className="space-y-4">
          <div className="bg-bat-surface border border-bat-border rounded-lg p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-4 h-4 text-bat-muted" />
              <span className="text-xs font-semibold text-bat-muted uppercase tracking-wide">Hook</span>
            </div>
            <p className="text-sm text-white font-medium">{result.hook}</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-bat-subtle uppercase tracking-wide">Post Body</span>
            <p className="text-sm text-white mt-1.5 whitespace-pre-wrap leading-relaxed">{result.body}</p>
          </div>

          <div className="bg-bat-surface2 border border-bat-border rounded-lg p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <MessageCircle className="w-4 h-4 text-bat-muted" />
              <span className="text-xs font-semibold text-bat-muted uppercase tracking-wide">Call to Action</span>
            </div>
            <p className="text-sm text-white">{result.cta}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Hash className="w-4 h-4 text-bat-subtle" />
              <span className="text-xs font-semibold text-bat-subtle uppercase tracking-wide">Hashtags</span>
            </div>
            <p className="text-sm text-bat-muted">{result.hashtags}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-bat-muted bg-bat-surface2 rounded-lg px-3.5 py-2.5">
            <Clock className="w-4 h-4 text-bat-subtle shrink-0" />
            <span><span className="font-medium text-white">Best time to post:</span> {result.bestTimeToPost}</span>
          </div>
        </div>
      </div>

      {result.contentTips?.length > 0 && (
        <div className="bg-bat-surface rounded-xl border border-bat-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-bat-muted" />
            <h4 className="text-sm font-semibold text-white">Content Tips</h4>
          </div>
          <ul className="space-y-2">
            {result.contentTips.map((tip, i) => (
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
