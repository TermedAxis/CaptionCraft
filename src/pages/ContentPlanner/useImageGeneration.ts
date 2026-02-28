import { useState } from "react";

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
}

function buildPollinationsUrl(prompt: string, width: number, height: number, seed: number, model = "flux") {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${seed}&model=${model}`;
}

export function useImageGeneration() {
  const [images, setImages] = useState<Record<string, GeneratedImage>>({});
  const [loadingKeys, setLoadingKeys] = useState<Record<string, boolean>>({});
  const [errorKeys, setErrorKeys] = useState<Record<string, string>>({});

  const generateImage = async (key: string, prompt: string, width = 1024, height = 1024) => {
    setLoadingKeys((prev) => ({ ...prev, [key]: true }));
    setErrorKeys((prev) => ({ ...prev, [key]: "" }));

    const seed = Math.floor(Math.random() * 1000000);
    const models = ["flux", "turbo", "flux-realism"];

    let lastError = "";

    for (const model of models) {
      const url = buildPollinationsUrl(prompt, width, height, seed, model);
      try {
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImages((prev) => ({ ...prev, [key]: { imageUrl: objectUrl, prompt } }));
          setLoadingKeys((prev) => ({ ...prev, [key]: false }));
          return;
        }
        lastError = `Service returned ${response.status}. `;
      } catch {
        lastError = "Network error reaching image service. ";
      }
    }

    setErrorKeys((prev) => ({
      ...prev,
      [key]: lastError + "The image service may be temporarily unavailable. Please try again.",
    }));
    setLoadingKeys((prev) => ({ ...prev, [key]: false }));
  };

  const clearImage = (key: string) => {
    setImages((prev) => {
      const next = { ...prev };
      if (next[key]?.imageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(next[key].imageUrl);
      }
      delete next[key];
      return next;
    });
  };

  return { images, loadingKeys, errorKeys, generateImage, clearImage };
}
