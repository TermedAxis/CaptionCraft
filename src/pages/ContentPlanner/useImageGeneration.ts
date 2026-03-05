import { useState } from "react";

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function getAspectRatio(width: number, height: number): string {
  const ratio = width / height;
  if (ratio >= 1.7) return "16:9";
  if (ratio >= 1.3) return "4:3";
  if (ratio <= 0.6) return "9:16";
  if (ratio <= 0.8) return "3:4";
  return "1:1";
}

export function useImageGeneration() {
  const [images, setImages] = useState<Record<string, GeneratedImage>>({});
  const [loadingKeys, setLoadingKeys] = useState<Record<string, boolean>>({});
  const [errorKeys, setErrorKeys] = useState<Record<string, string>>({});

  const generateImage = async (key: string, prompt: string, width = 1024, height = 1024) => {
    setLoadingKeys((prev) => ({ ...prev, [key]: true }));
    setErrorKeys((prev) => ({ ...prev, [key]: "" }));

    try {
      const aspectRatio = getAspectRatio(width, height);

      const response = await fetch(`${supabaseUrl}/functions/v1/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      setImages((prev) => ({ ...prev, [key]: { imageUrl: data.imageUrl, prompt } }));
    } catch (err) {
      setErrorKeys((prev) => ({
        ...prev,
        [key]: err instanceof Error ? err.message : "Image generation failed. Please try again.",
      }));
    } finally {
      setLoadingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  const clearImage = (key: string) => {
    setImages((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return { images, loadingKeys, errorKeys, generateImage, clearImage };
}
