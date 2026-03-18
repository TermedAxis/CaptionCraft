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
    <div className="space-y-5">
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

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 text-base mb-4">{result.title}</h3>

        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Hook</span>
            </div>
            <p className="text-sm text-gray-800 font-medium">{result.hook}</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Post Body</span>
            <p className="text-sm text-gray-800 mt-1.5 whitespace-pre-wrap leading-relaxed">{result.body}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Call to Action</span>
            </div>
            <p className="text-sm text-gray-800">{result.cta}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hashtags</span>
            </div>
            <p className="text-sm text-blue-600">{result.hashtags}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3.5 py-2.5">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            <span><span className="font-medium">Best time to post:</span> {result.bestTimeToPost}</span>
          </div>
        </div>
      </div>

      {result.contentTips?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-semibold text-gray-900">Content Tips</h4>
          </div>
          <ul className="space-y-2">
            {result.contentTips.map((tip, i) => (
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
