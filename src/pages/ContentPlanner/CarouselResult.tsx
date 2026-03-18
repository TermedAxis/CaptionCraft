import { Hash, Lightbulb, Layout, ChevronRight } from "lucide-react";
import { CarouselResult as CarouselResultType } from "./types";
import { ImageGeneratorPanel } from "./ImageGeneratorPanel";
import { useImageGeneration } from "./useImageGeneration";

interface CarouselResultProps {
  result: CarouselResultType;
}

export function CarouselResult({ result }: CarouselResultProps) {
  const { images, loadingKeys, errorKeys, generateImage, clearImage } = useImageGeneration();

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 text-base mb-4">{result.title}</h3>

        <div className="space-y-3">
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
              <div className="flex items-center gap-1.5 mb-2 opacity-80">
                <Layout className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold uppercase tracking-wide">Cover Slide</span>
              </div>
              <p className="font-bold text-lg leading-tight">{result.coverSlide?.headline}</p>
              {result.coverSlide?.subtext && (
                <p className="text-sm opacity-90 mt-1">{result.coverSlide.subtext}</p>
              )}
            </div>
            <ImageGeneratorPanel
              imageKey="cover"
              defaultPrompt={`${result.coverSlide?.headline}. ${result.coverSlide?.subtext ?? ""}. Eye-catching cover image for a social media carousel. High quality, bold, no text overlay.`}
              imageUrl={images["cover"]?.imageUrl}
              loading={loadingKeys["cover"]}
              error={errorKeys["cover"]}
              onGenerate={generateImage}
              onClear={clearImage}
              width={1080}
              height={1080}
              label="Cover Slide Image"
            />
          </div>

          {result.slides?.map((slide, i) => {
            const slideKey = `slide-${i}`;
            const slidePrompt = slide.visualNote
              ? `${slide.visualNote}. ${slide.heading}. High quality, visually compelling, no text overlay.`
              : `${slide.heading}. Social media carousel slide image. High quality, no text overlay.`;
            return (
              <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {slide.slideNumber}
                  </span>
                  <p className="text-sm font-semibold text-gray-900">{slide.heading}</p>
                </div>
                <ul className="space-y-1">
                  {slide.bulletPoints?.map((point, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-sm text-gray-700">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                {slide.visualNote && (
                  <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-2">
                    Visual: {slide.visualNote}
                  </p>
                )}
                <ImageGeneratorPanel
                  imageKey={slideKey}
                  defaultPrompt={slidePrompt}
                  imageUrl={images[slideKey]?.imageUrl}
                  loading={loadingKeys[slideKey]}
                  error={errorKeys[slideKey]}
                  onGenerate={generateImage}
                  onClear={clearImage}
                  width={1080}
                  height={1080}
                  label={`Slide ${slide.slideNumber} Image`}
                />
              </div>
            );
          })}

          <div className="bg-gray-800 rounded-xl p-4 text-white">
            <div className="flex items-center gap-1.5 mb-2 opacity-70">
              <Layout className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wide">Closing Slide</span>
            </div>
            <p className="text-sm mb-2">{result.closingSlide?.message}</p>
            {result.closingSlide?.cta && (
              <p className="text-sm font-bold text-blue-300">{result.closingSlide.cta}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Caption</span>
          <p className="text-sm text-gray-800 mt-1.5 leading-relaxed">{result.caption}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hashtags</span>
          </div>
          <p className="text-sm text-blue-600">{result.hashtags}</p>
        </div>
      </div>

      {result.designTips?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-semibold text-gray-900">Design Tips</h4>
          </div>
          <ul className="space-y-2">
            {result.designTips.map((tip, i) => (
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
