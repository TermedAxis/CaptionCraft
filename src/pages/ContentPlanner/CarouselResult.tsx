import { motion } from "framer-motion";
import { Hash, Lightbulb, LayoutGrid as Layout, ChevronRight } from "lucide-react";
import { CarouselResult as CarouselResultType } from "./types";
import { ImageGeneratorPanel } from "./ImageGeneratorPanel";
import { useImageGeneration } from "./useImageGeneration";

interface CarouselResultProps {
  result: CarouselResultType;
}

export function CarouselResult({ result }: CarouselResultProps) {
  const { images, loadingKeys, errorKeys, generateImage, clearImage } = useImageGeneration();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="bg-bat-surface rounded-xl border border-bat-border p-5">
        <h3 className="font-semibold text-white text-base mb-4">{result.title}</h3>

        <div className="space-y-3">
          <div className="space-y-3">
            <div className="bg-bat-surface2 border border-bat-border rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2 opacity-80">
                <Layout className="w-3.5 h-3.5 text-bat-muted" />
                <span className="text-xs font-semibold text-bat-muted uppercase tracking-wide">Cover Slide</span>
              </div>
              <p className="font-bold text-lg leading-tight text-white">{result.coverSlide?.headline}</p>
              {result.coverSlide?.subtext && (
                <p className="text-sm text-bat-muted mt-1">{result.coverSlide.subtext}</p>
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
              <div key={i} className="border border-bat-border rounded-xl p-4 space-y-3 bg-bat-surface2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-bat-surface border border-bat-border text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {slide.slideNumber}
                  </span>
                  <p className="text-sm font-semibold text-white">{slide.heading}</p>
                </div>
                <ul className="space-y-1">
                  {slide.bulletPoints?.map((point, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-sm text-bat-muted">
                      <ChevronRight className="w-3.5 h-3.5 text-bat-subtle mt-0.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                {slide.visualNote && (
                  <p className="text-xs text-bat-subtle italic border-t border-bat-border pt-2">
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

          <div className="bg-bat-surface2 border border-bat-border rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2 opacity-70">
              <Layout className="w-3.5 h-3.5 text-bat-muted" />
              <span className="text-xs font-semibold text-bat-muted uppercase tracking-wide">Closing Slide</span>
            </div>
            <p className="text-sm text-bat-muted mb-2">{result.closingSlide?.message}</p>
            {result.closingSlide?.cta && (
              <p className="text-sm font-bold text-white">{result.closingSlide.cta}</p>
            )}
          </div>
        </div>
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

      {result.designTips?.length > 0 && (
        <div className="bg-bat-surface rounded-xl border border-bat-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-bat-muted" />
            <h4 className="text-sm font-semibold text-white">Design Tips</h4>
          </div>
          <ul className="space-y-2">
            {result.designTips.map((tip, i) => (
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
