import { useState } from "react";

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
}

export function useImageGeneration() {
  const [images, setImages] = useState<Record<string, GeneratedImage>>({});
  const [loadingKeys, setLoadingKeys] = useState<Record<string, boolean>>({});
  const [errorKeys, setErrorKeys] = useState<Record<string, string>>({});

  const generateImage = async (key: string, prompt: string, width = 1024, height = 1024) => {
    setLoadingKeys((prev) => ({ ...prev, [key]: true }));
    setErrorKeys((prev) => ({ ...prev, [key]: "" }));

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, width, height }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Image generation failed");

      setImages((prev) => ({ ...prev, [key]: { imageUrl: data.imageUrl, prompt } }));
    } catch (err) {
      setErrorKeys((prev) => ({
        ...prev,
        [key]: err instanceof Error ? err.message : "Failed to generate image",
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
